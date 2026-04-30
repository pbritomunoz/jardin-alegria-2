export interface Plant {
  id: string;
  nombre: string;
  tipo: 'Interior' | 'Exterior' | 'Suculenta' | 'Colgante';
  precio: number;
  imagen?: string;
  stock: boolean;
  nuevo: boolean;
  descripcion: string;
  cuidados: string[];
  dificultad: 'Fácil' | 'Media' | 'Avanzada';
  luz: 'Baja' | 'Media' | 'Indirecta' | 'Directa';
  riego: 'Poco' | 'Moderado' | 'Frecuente';
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
