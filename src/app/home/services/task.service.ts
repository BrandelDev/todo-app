import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  limit,
  doc,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from '@angular/fire/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly firestore = inject(Firestore);

  createTask(tarea: Tarea) {
    const tareasRef = collection(this.firestore, 'tareas');
    const now = new Date();
    return addDoc(tareasRef, {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? '',
      prioridad: tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento ?? null,
      completed: tarea.completada ?? false,
      createdAt: tarea.creadaEn ?? now,
      updatedAt: tarea.actualizadaEn ?? now,
      selectedTag: tarea.etiqueta ?? null,
    });
  }

  async listTasksPage(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<{ items: Tarea[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const tareasRef = collection(this.firestore, 'tareas');
    const baseQuery = query(
      tareasRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const pageQuery = lastDoc ? query(baseQuery, startAfter(lastDoc)) : baseQuery;
    const snapshot = await getDocs(pageQuery);
    const items = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        completada: data.completed ?? false,
        prioridad: data.prioridad,
        fechaVencimiento: data.fechaVencimiento ?? null,
        creadaEn: data.createdAt ?? null,
        actualizadaEn: data.updatedAt ?? null,
        etiqueta: data.selectedTag ?? null,
      } as Tarea;
    });
    const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { items, lastDoc: nextCursor };
  }

  listTasksPage$(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Observable<{ items: Tarea[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const tareasRef = collection(this.firestore, 'tareas');
    const baseQuery = query(
      tareasRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const pageQuery = lastDoc ? query(baseQuery, startAfter(lastDoc)) : baseQuery;
    return from(getDocs(pageQuery)).pipe(
      map((snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            titulo: data.titulo,
            descripcion: data.descripcion,
            completada: data.completed ?? false,
            prioridad: data.prioridad,
            fechaVencimiento: data.fechaVencimiento ?? null,
            creadaEn: data.createdAt ?? null,
            actualizadaEn: data.updatedAt ?? null,
            etiqueta: data.selectedTag ?? null,
          } as Tarea;
        });
        const nextCursor =
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null;
        return { items, lastDoc: nextCursor };
      })
    );
  }

  toggleComplete(id: string, completada: boolean) {
    const tareaRef = doc(this.firestore, 'tareas', id);
    return updateDoc(tareaRef, { completed: completada, updatedAt: new Date() });
  }

}
