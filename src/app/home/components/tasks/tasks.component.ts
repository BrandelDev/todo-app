import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonLabel, IonCheckbox, IonItem, IonList } from "@ionic/angular/standalone";
import { BehaviorSubject, map, mergeScan, Observable, Subscription, tap } from 'rxjs';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { TaskService } from '../../services/task.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonLabel, IonCheckbox, IonItem, IonList]
})
export class TaskComponent {
  private readonly pageSize = 10;
  private lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  private readonly _taskService = inject(TaskService);
  private loadMore$ = new BehaviorSubject<void>(undefined);

  tasks$!: Observable<Tarea[]>;
  subscription: Subscription[] = [];


  ngOnInit(): void {
    this.getTareas();
  }

  getTareas() {
    this.tasks$ = this.loadMore$.pipe(
      mergeScan(
        (acc: Tarea[]) =>
          this._taskService.listTasksPage$(this.pageSize, this.lastDoc).pipe(
            tap((page) => {
              this.lastDoc = page.lastDoc;
            }),
            map((page) => [...acc, ...page.items])
          ),
        [] as Tarea[]
      )
    );
  }

  constructor() { }

  loadMore(): void {
    this.loadMore$.next();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());

  }
}
