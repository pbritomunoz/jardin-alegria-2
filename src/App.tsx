/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  LayoutGrid, 
  List, 
  Settings, 
  Leaf, 
  Droplet, 
  Sun,
  ChevronRight,
  Info
} from 'lucide-react';
import { PLANTS, THEMES } from './constants';
import { Plant, CartItem, ThemeType } from './types';

export default function App() {
  // State
  const [theme, setTheme] = useState<ThemeType>('morning');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('todos');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Derived
  const activeTheme = THEMES[theme];
  
  const filteredPlants = useMemo(() => {
    if (filter === 'todos') return PLANTS;
    return PLANTS.filter(p => p.tipo.toLowerCase() === filter.toLowerCase());
  }, [filter]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.planta.precio * item.cantidad), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.cantidad, 0);
  }, [cart]);

  // Handlers
  const addToCart = (planta: Plant) => {
    setCart(prev => {
      const existing = prev.find(item => item.planta.id === planta.id);
      if (existing) {
        return prev.map(item => 
          item.planta.id === planta.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...prev, { planta, cantidad: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.planta.id === id) {
          const newQty = Math.max(0, item.cantidad + delta);
          return { ...item, cantidad: newQty };
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.planta.id !== id));
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-all duration-700 selection:bg-green-500/30`}>
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${activeTheme.bg === 'bg-[#FAF8F3]' ? 'bg-white/80' : 'bg-black/40'} backdrop-blur-xl border-b border-white/10`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-900/20">
            <Leaf size={20} />
          </div>
          <span className="text-xl font-serif font-medium tracking-tight">Jardín<span className="italic opacity-80 pl-1">Alegría</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Inicio', 'Catálogo', 'Colecciones', 'Contacto'].map((link) => (
            <a key={link} href="#" className="text-sm font-medium hover:opacity-100 opacity-60 transition-opacity">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings size={20} className="opacity-70" />
          </button>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 relative ${activeTheme.bg === 'bg-[#FAF8F3]' ? 'bg-[#2D6A4F] text-white' : 'bg-[#95D5B2] text-[#0F1412]'} shadow-lg scale-100 hover:scale-105 active:scale-95`}
          >
            <ShoppingBag size={18} />
            <span className="text-sm">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className={`inline-block mb-4 text-xs font-bold tracking-[0.2em] uppercase opacity-50 ${activeTheme.accent}`}>Botanical Studio</span>
            <h1 className="text-5xl md:text-7xl font-serif font-light leading-[1.1] mb-6">
              Plantas que <br /> 
              <span className="italic font-normal">transforman</span> <br />
              tu hogar.
            </h1>
            <p className={`text-lg mb-8 max-w-md font-light leading-relaxed ${activeTheme.mute}`}>
              Curamos una colección seleccionada de especímenes botánicos para quienes aprecian la belleza sutil y el diseño consciente.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-green-950 text-white rounded-full font-medium shadow-xl shadow-green-900/20 flex items-center gap-2 hover:bg-green-900 transition-colors"
              >
                Explorar Colección <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
          >
            <div className={`absolute -inset-10 border border-current opacity-5 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none`}></div>
            <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=1200" 
                alt="Jardín Hero" 
                className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-80">Featured Species</p>
                <h3 className="text-2xl font-serif">Calathea Ornata</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Catalog Filters */}
      <section id="catalogo" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-serif font-light mb-4 text-balance">Nuestra Colección</h2>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Interior', 'Exterior', 'Suculenta', 'Colgante'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f.toLowerCase())}
                  className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 border ${
                    filter === f.toLowerCase() 
                      ? 'bg-green-900 text-white border-green-900' 
                      : `border-current opacity-40 hover:opacity-100`
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10' : 'opacity-40 hover:opacity-100'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10' : 'opacity-40 hover:opacity-100'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Plants Grid/List */}
        <motion.div 
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "flex flex-col gap-4"
          }
        >
          <AnimatePresence mode='popLayout'>
            {filteredPlants.map((plant) => (
              <motion.div
                key={plant.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className={`group relative ${viewMode === 'grid' ? 'p-4 rounded-[32px]' : 'flex items-center gap-6 p-4 rounded-2xl'} ${activeTheme.card} border border-white/5 hover:border-white/20 transition-all duration-300`}
              >
                <div className={`relative overflow-hidden cursor-pointer ${viewMode === 'grid' ? 'aspect-square rounded-[24px]' : 'w-32 h-32 rounded-xl flex-shrink-0'}`}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <img 
                    src={plant.imagen} 
                    alt={plant.nombre} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {plant.nuevo && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">New</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                </div>

                <div className={`mt-6 ${viewMode === 'list' ? 'mt-0 flex-1' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 ${activeTheme.accent}`}>{plant.tipo}</p>
                      <h3 className="font-serif text-xl">{plant.nombre}</h3>
                    </div>
                    <span className="text-xl font-medium">${plant.precio.toLocaleString('es-CL')}</span>
                  </div>
                  
                  {viewMode === 'list' && (
                    <p className={`text-sm mt-1 mb-4 opacity-70 ${activeTheme.mute}`}>{plant.descripcion}</p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 opacity-60 text-[10px] border border-current px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <Sun size={10} /> {plant.luz}
                      </div>
                      <div className="flex items-center gap-1 opacity-60 text-[10px] border border-current px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <Droplet size={10} /> {plant.riego}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(plant)}
                      className="p-3 bg-black/5 hover:bg-green-900 hover:text-white rounded-full transition-all duration-300 active:scale-90"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute top-0 right-0 w-full max-w-md h-full ${activeTheme.bg} shadow-2xl flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h2 className="text-2xl font-serif">Tu Carrito</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="text-sm font-medium uppercase tracking-widest">Carrito Vacío</p>
                    <p className="text-xs italic mt-2">Agrega algunas plantas para dar vida a tu espacio.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.planta.id} className="flex gap-4 items-center animate-in slide-in-from-right duration-300">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.planta.imagen} alt={item.planta.nombre} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg leading-tight">{item.planta.nombre}</h4>
                        <p className={`text-xs opacity-60 mb-2 ${activeTheme.mute}`}>${item.planta.precio.toLocaleString('es-CL')}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.planta.id, -1)} className="p-1 border border-current opacity-40 hover:opacity-100 rounded-md">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium">{item.cantidad}</span>
                          <button onClick={() => updateQuantity(item.planta.id, 1)} className="p-1 border border-current opacity-40 hover:opacity-100 rounded-md">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-medium">${(item.planta.precio * item.cantidad).toLocaleString('es-CL')}</span>
                        <button onClick={() => removeFromCart(item.planta.id)} className="text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/10 bg-black/5">
                  <div className="flex items-center justify-between mb-2 opacity-60 text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-serif">Total</span>
                    <span className="text-2xl font-serif">${cartTotal.toLocaleString('es-CL')}</span>
                  </div>
                  <button className="w-full py-4 bg-green-950 text-white rounded-full font-bold shadow-xl shadow-green-900/20 hover:bg-green-900 transition-all scale-100 active:scale-95">
                    Finalizar Compra
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings / Personalization Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg p-10 rounded-[40px] shadow-2xl relative overflow-hidden ${activeTheme.bg} ${activeTheme.text}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full"
              >
                <X size={20} />
              </button>

              <h2 className="text-3xl font-serif mb-10 text-center">Personalización Avanzada</h2>
              
              <div className="space-y-12">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6 block">Paleta de Colores (Mood)</label>
                  <div className="grid grid-cols-3 gap-6">
                    {(Object.keys(THEMES) as ThemeType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`group relative flex flex-col items-center gap-3 transition-all duration-300`}
                      >
                        <div className={`w-16 h-16 rounded-3xl border-2 shadow-lg transition-transform duration-300 group-active:scale-90 flex items-center justify-center overflow-hidden ${
                          theme === t ? 'border-green-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}>
                          <div className={`w-full h-full ${THEMES[t].bg} flex flex-col`}>
                            <div className="flex-1 flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-full ${THEMES[t].accent.replace('text-', 'bg-')}`}></div>
                            </div>
                            <div className={`h-4 opacity-20 ${THEMES[t].card.replace('bg-', 'bg-')}`}></div>
                          </div>
                          {theme === t && (
                            <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity ${theme === t ? 'opacity-100' : 'opacity-40'}`}>
                          {t === 'morning' ? 'Mañana' : t === 'midnight' ? 'Medianoche' : 'Atardecer'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 block">Vista del Catálogo</label>
                    <div className="flex gap-2 p-1 bg-black/5 rounded-2xl border border-current/10">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 shadow-sm' : 'opacity-40'}`}
                      >
                        <LayoutGrid size={18} />
                        <span className="text-[10px] font-bold uppercase">Mosaico</span>
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 shadow-sm' : 'opacity-40'}`}
                      >
                        <List size={18} />
                        <span className="text-[10px] font-bold uppercase">Lista</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4 block">Animaciones</label>
                    <button className="w-full py-4 bg-black/5 border border-current/10 rounded-2xl flex items-center justify-center gap-2 opacity-40 relative group overflow-hidden">
                      <span className="text-[10px] font-bold uppercase">Fluidas (Activado)</span>
                      <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-current/5 text-center">
                <p className="text-[11px] italic opacity-40 italic">Los ajustes se guardan automáticamente en tu perfil botánico.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plant Detail Modal */}
      <AnimatePresence>
        {selectedPlant && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedPlant(null)}
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className={`w-full max-w-6xl max-h-[90vh] rounded-[48px] overflow-hidden flex flex-col md:flex-row relative ${activeTheme.bg} ${activeTheme.text}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPlant(null)}
                className="absolute top-8 right-8 z-10 w-12 h-12 bg-black/10 hover:bg-black/20 text-current rounded-full flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 relative bg-black/10">
                <img 
                  src={selectedPlant.imagen} 
                  alt={selectedPlant.nombre} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:opacity-100"></div>
              </div>

              <div className={`md:w-1/2 p-8 md:p-16 overflow-y-auto ${activeTheme.text}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold uppercase tracking-[.3em] opacity-50 ${activeTheme.accent}`}>{selectedPlant.tipo}</span>
                  {selectedPlant.nuevo && (
                     <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full">Edición Limitada</span>
                  )}
                </div>
                
                <h2 className="text-5xl md:text-6xl font-serif font-light mb-8 leading-tight">{selectedPlant.nombre}</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-3xl bg-black/5 border border-white/5">
                    <Sun className={`mb-2 opacity-50 ${activeTheme.accent}`} size={20} />
                    <p className="text-[10px] font-bold uppercase opacity-40">Luz</p>
                    <p className="text-sm font-medium">{selectedPlant.luz}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-black/5 border border-white/5">
                    <Droplet className={`mb-2 opacity-50 ${activeTheme.accent}`} size={20} />
                    <p className="text-[10px] font-bold uppercase opacity-40">Riego</p>
                    <p className="text-sm font-medium">{selectedPlant.riego}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-black/5 border border-white/5">
                    <Info className={`mb-2 opacity-50 ${activeTheme.accent}`} size={20} />
                    <p className="text-[10px] font-bold uppercase opacity-40">Dificultad</p>
                    <p className="text-sm font-medium">{selectedPlant.dificultad}</p>
                  </div>
                </div>

                <div className="prose prose-invert mb-10">
                  <p className={`text-lg leading-relaxed font-light ${activeTheme.mute}`}>
                    {selectedPlant.descripcion}
                  </p>
                </div>

                <div className="space-y-4 mb-12">
                   <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Consejos de Cuidado</h4>
                   <div className="flex flex-col gap-3">
                      {selectedPlant.cuidados.map((c, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${activeTheme.accent.replace('text-', 'bg-')}`}></div>
                          <span className="text-sm opacity-80">{c}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-auto">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-40 mb-1">Inversión Botánica</p>
                    <span className="text-4xl font-serif">${selectedPlant.precio.toLocaleString('es-CL')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(selectedPlant);
                      setSelectedPlant(null);
                      setIsCartOpen(true);
                    }}
                    className="px-10 py-5 bg-green-950 text-white rounded-full font-bold shadow-2xl shadow-green-900/40 hover:bg-green-900 transition-all hover:scale-105 active:scale-95"
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`py-20 px-6 border-t border-white/5 ${activeTheme.bg === 'bg-[#FAF8F3]' ? 'bg-white' : 'bg-black/20'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <Leaf size={24} className={activeTheme.accent} />
              <span className="text-2xl font-serif font-medium">Jardín<span className="italic opacity-80 pl-1">Alegría</span></span>
            </div>
            <p className={`text-sm leading-relaxed mb-6 ${activeTheme.mute}`}>
              Creemos que cada espacio merece un poco de naturaleza salvaje. Nuestra misión es conectar personas con sus compañeros verdes perfectos.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Pinterest', 'Email'].map(s => (
                <a key={s} href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-100 opacity-40 transition-opacity">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-30">Explorar</h5>
              <ul className="space-y-3 text-sm opacity-60">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Plantas de Interior</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Maceteros de Diseño</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Cuidado Botánico</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-30">Empresa</h5>
              <ul className="space-y-3 text-sm opacity-60">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Certificaciones</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Historia</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Contacto</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
               <h5 className="text-[10px] font-bold uppercase tracking-widest mb-6 opacity-30">Novedades</h5>
               <div className="flex">
                 <input 
                  type="email" 
                  placeholder="Tu correo botánico" 
                  className="bg-current/5 border-none px-4 py-3 rounded-l-xl focus:ring-1 ring-current text-sm w-full"
                 />
                 <button className="bg-current text-white px-4 rounded-r-xl">
                   <ChevronRight size={18} />
                 </button>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-20">
          <span>© 2026 JARDÍN ALEGRÍA STUDIO</span>
          <span>BORN IN SANTIAGO</span>
        </div>
      </footer>
    </div>
  );
}
