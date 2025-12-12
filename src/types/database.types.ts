export interface Propiedad {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_por_noche: number;
  created_at: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  lugar_origen: string | null;
  telefono: string | null;
  email: string | null;
  dni_pasaporte: string | null;
}