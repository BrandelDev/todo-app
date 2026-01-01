import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

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

}
