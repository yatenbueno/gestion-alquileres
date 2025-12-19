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

export interface Reserva {
  id: number;
  propiedad_id: number;
  cliente_id: number;
  check_in: string;
  check_out: string;
  cantidad_noches: number;
  precio_total: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  created_at: string;
}