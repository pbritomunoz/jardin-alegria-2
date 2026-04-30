export interface Plant {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  imagen?: string;
  stock: boolean;
  nuevo: boolean;
  descripcion: string;
  cuidados: string[];
  luz?: string;
  riego?: string;
  dificultad?: string;
}

export interface CartItem {
  planta: Plant;
  cantidad: number;
}

export type ThemeType = 'morning' | 'midnight' | 'sunset';

export interface AppConfig {
  theme: ThemeType;
  viewMode: 'grid' | 'list';
}
