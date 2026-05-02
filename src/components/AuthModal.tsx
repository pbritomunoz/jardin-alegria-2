import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: any;
}

export default function AuthModal({ isOpen, onClose, activeTheme }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          onClose();
        } catch (err: any) {
          if (err.code === 'auth/network-request-failed') {
            throw new Error('Error de conexión. Por favor, verifica tu internet.');
          }
          if (err.code === 'auth/operation-not-allowed') {
            throw new Error('El registro con email no está habilitado en la consola de Firebase. Por favor, actívalo en Authentication > Sign-in method.');
          }
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            throw new Error('Credenciales inválidas. Por favor, revisa tu correo y contraseña.');
          }
          throw err;
        }
      } else if (mode === 'register') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          await updateProfile(user, { displayName: `${nombre} ${apellido}` });

          const profile: UserProfile = {
            uid: user.uid,
            nombre,
            apellido,
            email,
            telefono,
          };

          await setDoc(doc(db, 'users', user.uid), profile);
          onClose();
        } catch (err: any) {
          if (err.code === 'auth/operation-not-allowed') {
            throw new Error('El registro con email no está habilitado en la consola de Firebase. Por favor, actívalo en Authentication > Sign-in method.');
          }
          if (err.code === 'auth/email-already-in-use') {
            throw new Error('Este correo electrónico ya está en uso. Por favor, intenta con otro o inicia sesión.');
          }
          throw err;
        }
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Se ha enviado un enlace de recuperación a tu correo.');
        setTimeout(() => setMode('login'), 3000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl relative overflow-hidden ${activeTheme.bg} ${activeTheme.text}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif mb-2">
                {mode === 'login' ? 'Bienvenido' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Cuenta'}
              </h2>
              <p className="text-sm opacity-60">
                {mode === 'login' ? 'Ingresa tus credenciales botánicas' : mode === 'register' ? 'Únete a nuestra comunidad' : 'Ingresa tu correo para restablecer tu contraseña'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Nombre" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-black/5 border-none pl-12 pr-4 py-3 rounded-2xl focus:ring-2 ring-green-900 transition-all text-sm"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="Apellido" 
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full bg-black/5 border-none px-4 py-3 rounded-2xl focus:ring-2 ring-green-900 transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="Teléfono" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-black/5 border-none pl-12 pr-4 py-3 rounded-2xl focus:ring-2 ring-green-900 transition-all text-sm"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="Correo Electrónico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 border-none pl-12 pr-4 py-3 rounded-2xl focus:ring-2 ring-green-900 transition-all text-sm"
                />
              </div>

              {mode !== 'reset' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/5 border-none pl-12 pr-12 py-3 rounded-2xl focus:ring-2 ring-green-900 transition-all text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-green-900 text-white rounded-2xl font-bold shadow-lg shadow-green-950/20 hover:bg-green-800 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Entrar' : mode === 'register' ? 'Unirse' : 'Enviar Enlace'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              {mode === 'login' && (
                <button 
                  onClick={() => setMode('reset')}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity block w-full"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              
              <p className="text-xs opacity-60">
                {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="ml-2 font-bold hover:underline"
                >
                  {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
