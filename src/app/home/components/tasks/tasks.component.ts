import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonLabel, IonCheckbox, IonItem, IonItemDivider, IonList } from "@ionic/angular/standalone";
import { BehaviorSubject, map, mergeScan, Observable, Subscription, tap } from 'rxjs';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { TaskService } from '../../services/task.service';
import { Tarea } from '../../models/tarea.model';
import { LoaderComponent } from "src/app/core/components/loader/loader.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonLabel, IonCheckbox, IonItem, IonItemDivider, IonList, LoaderComponent]
})
export class TaskComponent {
  private readonly pageSize = 10;
  private lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  private readonly _taskService = inject(TaskService);
  private loadMore$ = new BehaviorSubject<void>(undefined);

  isLoading: boolean = false;
  tasks$!: Observable<Tarea[]>;
  tasksGrouped$!: Observable<TaskGroup[]>;
  subscription: Subscription[] = [];


  ngOnInit(): void {
    this.getTareas();
  }

  getTareas() {
    this.isLoading = true
    this.tasks$ = this.loadMore$.pipe(
      mergeScan(
        (acc: Tarea[]) =>
          this._taskService.listTasksPage$(this.pageSize, this.lastDoc).pipe(
            tap((page) => {
              console.log('Page loaded:')
              console.log(page)
              this.isLoading = false;
              this.lastDoc = page.lastDoc;
            }),
            map((page) => [...acc, ...page.items])
          ),
        [] as Tarea[]
      )
    );
    this.tasksGrouped$ = this.tasks$.pipe(map((items) => this.groupByDate(items)));
  }

  constructor() { }

  loadMore(): void {
    this.loadMore$.next();
  }

  onToggle(tarea: Tarea, checked: boolean): void {
    if (!tarea.id) {
      return;
    }
    this._taskService.toggleComplete(tarea.id, checked);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());

  }

  private groupByDate(items: Tarea[]): TaskGroup[] {
    const groups = new Map<string, { label: string; items: Tarea[] }>();
    items.forEach((tarea) => {
      const date = this.toDate(tarea.fechaVencimiento);
      const key = date ? this.formatKey(date) : 'sin-fecha';
      const label = date ? this.formatLabel(date) : 'Sin fecha';
      if (!groups.has(key)) {
        groups.set(key, { label, items: [] });
      }
      groups.get(key)?.items.push(tarea);
    });

    const sorted = Array.from(groups.entries()).sort((a, b) => {
      if (a[0] === 'sin-fecha') return 1;
      if (b[0] === 'sin-fecha') return -1;
      return a[0].localeCompare(b[0]);
    });

    return sorted.map(([_, value]) => value);
  }

  private toDate(value: Tarea['fechaVencimiento']): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    if ('toDate' in value && typeof value.toDate === 'function') {
      return value.toDate();
    }
    return null;
  }

  private formatKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatLabel(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    }).format(date);
  }
}

interface TaskGroup {
  label: string;
  items: Tarea[];
}
