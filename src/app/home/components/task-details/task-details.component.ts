import { Component, DestroyRef, effect, inject, input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LoaderComponent } from "src/app/core/components/loader/loader.component";
import { IonFooter, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonItem, IonSelect, IonSelectOption, IonLabel, IonModal, IonDatetime, IonDatetimeButton, IonTextarea, IonInput, IonContent, IonHeader, IonTitle } from "@ionic/angular/standalone";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
  imports: [
    LoaderComponent,
    IonToolbar,
    IonButtons,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonFooter,
    IonModal,
    IonDatetime,
    IonDatetimeButton,
    IonButton,
    IonIcon,
    IonTextarea,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    ReactiveFormsModule
  ]
})
export class TaskDetailsComponent implements OnInit {
    
  private readonly _taskService = inject(TaskService);
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _activateRoute = inject(ActivatedRoute);
  private readonly _location = inject(Location);

  taskDetailsForm!: FormGroup;
  taskId: string | null = null;

  isLoading: boolean = false;
  showErrors: boolean = false;
  isFormInvalid: boolean = false;

  constructor() {
    this.taskDetailsForm = this._fb.group({
      titulo: [''],
      descripcion: [''],
      prioridad: ['',],
      fechaVencimiento: [null],
      selectedTag: ['']
    });
      
      const id = this._activateRoute.snapshot.paramMap.get('id');
      if (!id) {
        return;
      }
      this.taskId = id;
      this.isLoading = true;
      this._taskService
        .getTaskById$(id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((tarea) => {
          if (!tarea) {
            this.isLoading = false;
            return;
          }
          this.taskDetailsForm.patchValue({
            titulo: tarea.titulo ?? '',
            descripcion: tarea.descripcion ?? '',
            prioridad: tarea.prioridad ?? '',
            fechaVencimiento: tarea.fechaVencimiento ?? null,
            selectedTag: tarea.etiqueta ?? '',
          });
          this.isLoading = false;
        });  
  }

  ngOnInit() {
  }

  async onSubmit(): Promise<void> {
    this.taskDetailsForm.markAllAsTouched();

    if (this.taskDetailsForm.invalid) {
      this.isFormInvalid = true;
      return;
    }

    if (!this.taskId) {
      return;
    }

    this.isFormInvalid = false;
    const formValue = this.taskDetailsForm.value;
    const fechaVencimiento = this.normalizeFecha(formValue.fechaVencimiento);

    try {
      this.isLoading = true;
      await this._taskService.updateTask(this.taskId, {
        titulo: formValue.titulo ?? '',
        descripcion: formValue.descripcion ?? '',
        prioridad: formValue.prioridad,
        fechaVencimiento,
        etiqueta: formValue.selectedTag ?? null,
      });
      this._location.back();
    } catch (error) {
      console.error('Error actualizando la tarea', error);
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this._location.back();
  }

  async onDelete(): Promise<void> {
    if (!this.taskId) {
      return;
    }

    const confirmed = window.confirm('¿Eliminar esta tarea?');
    if (!confirmed) {
      return;
    }

    try {
      this.isLoading = true;
      await this._taskService.deleteTask(this.taskId);
      this._location.back();
    } catch (error) {
      console.error('Error eliminando la tarea', error);
    } finally {
      this.isLoading = false;
    }
  }

  private normalizeFecha(value: unknown): Timestamp | null {
    if (!value) {
      return null;
    }
    if (value instanceof Timestamp) {
      return value;
    }
    if (value instanceof Date) {
      return Timestamp.fromDate(value);
    }
    if (typeof value === 'string') {
      return Timestamp.fromDate(new Date(value));
    }
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
      return Timestamp.fromDate((value as { toDate: () => Date }).toDate());
    }
    return null;
  }

}
