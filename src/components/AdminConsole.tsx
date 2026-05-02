import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Users, Loader2, Search, Table } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: any;
  isAdmin: boolean;
}

export default function AdminConsole({ isOpen, onClose, activeTheme, isAdmin }: AdminConsoleProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('nombre', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección'];
    const rows = users.map(u => [
      u.nombre,
      u.apellido,
      u.email,
      u.telefono,
      u.direccion || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_jardin_alegria_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin && isOpen) {
    return (
      <div className="fixed inset-0 z-[250] bg-black/90 flex items-center justify-center p-6 text-white text-center">
        <div>
          <h2 className="text-2xl font-serif mb-4">Acceso Denegado</h2>
          <p className="opacity-60 mb-8">No tienes permisos para acceder a esta área.</p>
          <button onClick={onClose} className="px-8 py-3 bg-white text-black rounded-full font-bold">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`w-full max-w-6xl h-full max-h-[90vh] rounded-[48px] shadow-2xl flex flex-col relative overflow-hidden ${activeTheme.bg} ${activeTheme.text}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-current/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-900 rounded-2xl flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif">Gestión de Clientes</h2>
                  <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Base de Datos Botánica</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-current/5 border-none pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 ring-green-900 transition-all font-medium"
                  />
                </div>
                <button 
                  onClick={exportToCSV}
                  disabled={users.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-950/20 hover:bg-green-800 transition-all disabled:opacity-30 whitespace-nowrap"
                >
                  <Download size={16} /> <span className="hidden sm:inline">Exportar a Excel (.csv)</span>
                </button>
                <button onClick={onClose} className="p-2.5 hover:bg-current/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <Loader2 className="animate-spin mb-4" size={48} />
                  <p className="text-sm font-bold uppercase tracking-widest">Sincronizando clientes...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <Table size={64} className="mb-4" />
                  <p className="font-serif text-2xl">No se encontraron clientes</p>
                  <p className="text-sm mt-2">Intenta con otro término de búsqueda.</p>
                </div>
              ) : (
                <div className="min-w-[800px]">
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Contacto</th>
                        <th className="px-6 py-4">Ubicación</th>
                        <th className="px-6 py-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.uid} className="group transition-all">
                          <td className="px-6 py-4 bg-current/5 rounded-l-3xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-900/10 text-green-900 flex items-center justify-center font-bold text-xs uppercase">
                                {u.nombre[0]}{u.apellido[0]}
                              </div>
                              <div>
                                <p className="font-bold">{u.nombre} {u.apellido}</p>
                                <p className="text-[10px] opacity-40 font-mono tracking-tighter truncate max-w-[150px]">{u.uid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 bg-current/5">
                            <p className="text-sm font-medium">{u.email}</p>
                            <p className="text-[10px] opacity-50">{u.telefono}</p>
                          </td>
                          <td className="px-6 py-4 bg-current/5">
                            <p className="text-sm opacity-70 truncate max-w-[200px]">{u.direccion || 'No especificada'}</p>
                          </td>
                          <td className="px-6 py-4 bg-current/5 rounded-r-3xl">
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Activo</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-current/10 bg-current/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
              <div className="flex items-center gap-2">
                <Table size={12} />
                <span>Total Clientes: {users.length}</span>
              </div>
              <div className="flex items-center gap-6">
                <span>Refresco en Tiempo Real</span>
                <span className="text-green-500">Estado: En Línea</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
