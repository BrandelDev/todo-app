import { Timestamp } from 'firebase/firestore';

export type FirestoreDate = Timestamp | Date;

export interface Tarea {
  id?: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  fechaVencimiento?: FirestoreDate | null;
  creadaEn: FirestoreDate;
  actualizadaEn: FirestoreDate;
  etiqueta?: string | null;
}
