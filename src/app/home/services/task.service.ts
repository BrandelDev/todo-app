import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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
    return addDoc(tareasRef, tarea);
  }

  async listTasksPage(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<{ items: Tarea[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const tareasRef = collection(this.firestore, 'tareas');
    const baseQuery = query(
      tareasRef,
      orderBy('creadaEn', 'desc'),
      limit(pageSize)
    );
    const pageQuery = lastDoc ? query(baseQuery, startAfter(lastDoc)) : baseQuery;
    const snapshot = await getDocs(pageQuery);
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Tarea),
    }));
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
      orderBy('creadaEn', 'desc'),
      limit(pageSize)
    );
    const pageQuery = lastDoc ? query(baseQuery, startAfter(lastDoc)) : baseQuery;
    return from(getDocs(pageQuery)).pipe(
      map((snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Tarea),
        }));
        const nextCursor =
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null;
        return { items, lastDoc: nextCursor };
      })
    );
  }

}
