import { Plant, ThemeType } from './types';

export const PLANTS: Plant[] = [
  {
    id: '1',
    nombre: 'Monstera Deliciosa',
    tipo: 'Interior',
    precio: 25000,
    descripcion: 'Conocida como costilla de Adán, es perfecta para darle un toque tropical a tu salón.',
    cuidados: ['Luz indirecta', 'Riego semanal'],
    stock: true,
    nuevo: true,
    dificultad: 'Fácil',
    luz: 'Indirecta',
    riego: 'Moderado',
    imagen: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    nombre: 'Ficus Lyrata',
    tipo: 'Interior',
    precio: 38000,
    descripcion: 'Sus grandes hojas en forma de violín son el centro de atención en cualquier espacio.',
    cuidados: ['Luz brillante', 'No mover'],
    stock: true,
    nuevo: false,
    dificultad: 'Media',
    luz: 'Directa',
    riego: 'Moderado',
    imagen: 'https://images.unsplash.com/photo-1597055181300-e3633a907519?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    nombre: 'Sansevieria',
    tipo: 'Interior',
    precio: 15000,
    descripcion: 'La planta indestructible. Purifica el aire y sobrevive a casi todo.',
    cuidados: ['Poca luz', 'Poco riego'],
    stock: true,
    nuevo: false,
    dificultad: 'Fácil',
    luz: 'Baja',
    riego: 'Poco',
    imagen: 'https://images.unsplash.com/photo-1593433550831-7290ec598f56?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    nombre: 'Pilea Peperomioides',
    tipo: 'Interior',
    precio: 12000,
    descripcion: 'Conocida como la planta del dinero china por sus hojas redondas.',
    cuidados: ['Luz indirecta', 'Giro regular'],
    stock: true,
    nuevo: true,
    dificultad: 'Fácil',
    luz: 'Indirecta',
    riego: 'Moderado',
    imagen: 'https://images.unsplash.com/photo-1623132646399-5553e1a05cc6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    nombre: 'Cactus Euphorbia',
    tipo: 'Suculenta',
    precio: 32000,
    descripcion: 'Estatuesco y minimalista. Requiere muy poca atención.',
    cuidados: ['Sol directo', 'Riego escaso'],
    stock: true,
    nuevo: false,
    dificultad: 'Fácil',
    luz: 'Directa',
    riego: 'Poco',
    imagen: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    nombre: 'Helecho Boston',
    tipo: 'Colgante',
    precio: 18000,
    descripcion: 'Frondoso y elegante, ideal para baños por su amor a la humedad.',
    cuidados: ['Humedad alta', 'Luz filtrada'],
    stock: true,
    nuevo: false,
    dificultad: 'Media',
    luz: 'Media',
    riego: 'Frecuente',
    imagen: 'https://images.unsplash.com/photo-1592150621344-82d43b4a13c9?auto=format&fit=crop&q=80&w=800'
  }
];

export const THEMES: Record<ThemeType, { bg: string, text: string, accent: string, card: string, mute: string }> = {
  morning: {
    bg: 'bg-[#FAF8F3]',
    text: 'text-[#1A1A1A]',
    accent: 'text-[#2D6A4F]',
    card: 'bg-white',
    mute: 'text-[#6B6B6B]'
  },
  midnight: {
    bg: 'bg-[#0F1412]',
    text: 'text-[#E8F3ED]',
    accent: 'text-[#95D5B2]',
    card: 'bg-[#1A231F]',
    mute: 'text-[#A0AFAA]'
  },
  sunset: {
    bg: 'bg-[#1C1917]',
    text: 'text-[#FDE68A]',
    accent: 'text-[#F59E0B]',
    card: 'bg-[#292524]',
    mute: 'text-[#D6D3D1]'
  }
};
