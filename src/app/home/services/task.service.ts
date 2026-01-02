import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  doc,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { docData, doc as docRef } from '@angular/fire/firestore';

import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly firestore = inject(Firestore);

  async createTask(tarea: Tarea) {
    const tareasRef = collection(this.firestore, 'tareas');
    const now = new Date();
    const ref = await addDoc(tareasRef, {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? '',
      prioridad: tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento ?? null,
      completed: tarea.completada ?? false,
      createdAt: tarea.creadaEn ?? now,
      updatedAt: tarea.actualizadaEn ?? now,
      selectedTag: tarea.etiqueta ?? null,
    });
    await updateDoc(doc(this.firestore, 'tareas', ref.id), { id: ref.id });
    return ref;
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

  listTasksRealtime$(): Observable<Tarea[]> {
    const tareasRef = collection(this.firestore, 'tareas');
    const q = query(tareasRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((data: any) => ({
          id: data.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          completada: data.completed ?? false,
          prioridad: data.prioridad,
          fechaVencimiento: data.fechaVencimiento ?? null,
          creadaEn: data.createdAt ?? null,
          actualizadaEn: data.updatedAt ?? null,
          etiqueta: data.selectedTag ?? null,
        }))
      )
    );
  }

  listTasksRealtimeByCategoria$(categoria: string | null): Observable<Tarea[]> {
    const tareasRef = collection(this.firestore, 'tareas');
    console.log('listTasksRealtimeByCategoria$ called with categoria:', categoria);
    const q = categoria && categoria !== 'all'
      ? query(tareasRef, where('selectedTag', '==', categoria), orderBy('createdAt', 'desc'))
      : query(tareasRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((data: any) => ({
          id: data.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          completada: data.completed ?? false,
          prioridad: data.prioridad,
          fechaVencimiento: data.fechaVencimiento ?? null,
          creadaEn: data.createdAt ?? null,
          actualizadaEn: data.updatedAt ?? null,
          etiqueta: data.selectedTag ?? null,
        }))
      )
    );
  }

  getTaskById$(id: string): Observable<Tarea | null> {
    const ref = docRef(this.firestore, 'tareas', id);
    return docData(ref, { idField: 'id' }).pipe(
      map((data: any) => ({
        id: data.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        completada: data.completed ?? false,
        prioridad: data.prioridad,
        fechaVencimiento: data.fechaVencimiento ?? null,
        creadaEn: data.createdAt ?? null,
        actualizadaEn: data.updatedAt ?? null,
        etiqueta: data.selectedTag ?? null,
      }))
    );
  }

  async updateTask(
    id: string,
    tarea: Pick<Tarea, 'titulo' | 'descripcion' | 'prioridad' | 'fechaVencimiento' | 'etiqueta'>
  ) {
    const tareaRef = doc(this.firestore, 'tareas', id);
    return updateDoc(tareaRef, {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion ?? '',
      prioridad: tarea.prioridad,
      fechaVencimiento: tarea.fechaVencimiento ?? null,
      selectedTag: tarea.etiqueta ?? null,
      updatedAt: new Date(),
    });
  }

  deleteTask(id: string) {
    const tareaRef = doc(this.firestore, 'tareas', id);
    return deleteDoc(tareaRef);
  }

  toggleComplete(id: string, completada: boolean) {
    const tareaRef = doc(this.firestore, 'tareas', id);
    return updateDoc(tareaRef, { completed: completada, updatedAt: new Date() });
  }

}
