import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonDatetime, IonFooter, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, IonDatetimeButton } from '@ionic/angular/standalone';

import { Tarea } from '../../models/tarea.model';
import { Location } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonContent,
    IonDatetime,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonDatetimeButton
  ],
})
export class NewTaskComponent {

  private readonly _location = inject(Location);
  private readonly _taskService = inject(TaskService);

  @Output() create = new EventEmitter<Tarea>();
  @Output() cancel = new EventEmitter<void>();

  tagOptions = ['UX', 'UI', 'Entrevista', 'Dev', 'Personal'];
  selectedTag: string = '';

  form = {
    titulo: '',
    descripcion: '',
    prioridad: 'media' as Tarea['prioridad'],
    fechaVencimiento: null as string | null,
    selectedTag: ''
  };

  async onSubmit(): Promise<void> {
    if (!this.form.titulo.trim()) {
      return;
    }

    const now = new Date();
    const fecha = this.form.fechaVencimiento
      ? new Date(this.form.fechaVencimiento)
      : null;
    const etiqueta = this.selectedTag ? this.selectedTag : null;

    const tarea: Tarea = {
      titulo: this.form.titulo.trim(),
      descripcion: this.form.descripcion.trim() || undefined,
      completada: false,
      prioridad: this.form.prioridad,
      fechaVencimiento: fecha,
      creadaEn: now,
      actualizadaEn: now,
      etiqueta,
    };

    await this.newTask(tarea);
    this.create.emit(tarea);
    this.resetForm();
  }

  onCancel(): void {
    this.resetForm();
    this._location.back();
    this.cancel.emit();
  }

  private resetForm(): void {
    this.form = {
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      fechaVencimiento: '',
      selectedTag: '',
    };
  }

  private async newTask(tarea: Tarea): Promise<void> {
    await this._taskService.createTask(tarea);
    this._location.back();
  }

}
