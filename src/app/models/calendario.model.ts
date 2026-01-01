import { Timestamp } from 'firebase/firestore';

export type FirestoreDate = Timestamp | Date;

export interface CalendarioItem {
  id?: string;
  titulo: string;
  inicio: FirestoreDate;
  fin?: FirestoreDate;
  todoId?: string;
  tipo: 'evento' | 'recordatorio';
  creadaEn: FirestoreDate;
}
