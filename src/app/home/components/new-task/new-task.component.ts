import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonDatetime, IonFooter, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, IonDatetimeButton } from '@ionic/angular/standalone';

import { Tarea } from '../../models/tarea.model';
import { Location } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { LoaderComponent } from "src/app/core/components/loader/loader.component";
import { Timestamp } from '@angular/fire/firestore';

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
    IonDatetimeButton,
    LoaderComponent,
    ReactiveFormsModule
  ],
})
export class NewTaskComponent {

  private readonly _fb = inject(FormBuilder);
  private readonly _location = inject(Location);
  private readonly _taskService = inject(TaskService);

  newTaskForm!: FormGroup;
  isLoading: boolean = false;
  showErrors: boolean = false;
  tagOptions = ['UX', 'UI', 'Entrevista', 'Dev', 'Personal'];
  selectedTag: string = '';
  isFormInvalid: boolean = false;


  constructor() {
    this.newTaskForm = this._fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['media', Validators.required],
      fechaVencimiento: [null, Validators.required],
      selectedTag: ['', Validators.required]
    });

  }
  async onSubmit(): Promise<void> {
    // Marca el formulario como tocado para mostrar errores
    this.newTaskForm.markAllAsTouched();

    if (this.newTaskForm.invalid) {
      this.isFormInvalid = true;
      return;
    }

    this.isFormInvalid = false;

    const formValue = this.newTaskForm.value;

    const tarea: Tarea = {
      ...formValue,
      fechaVencimiento: formValue.fechaVencimiento
        ? Timestamp.fromDate(new Date(formValue.fechaVencimiento))
        : null,
      createdAt: Timestamp.now(),
      completed: false
    };

    try {
      await this.newTask(tarea);
    } catch (error) {
      console.error('Error creando la tarea:', error);
    }
  }

  onCancel(): void {
    this._location.back();
  }

  private async newTask(tarea: Tarea): Promise<void> {
    try {
      this.isLoading = true;
      console.log('Creando tarea...');
      console.log(tarea);
      await this._taskService.createTask(tarea);
      this._location.back();
    } catch (error) {
      console.error('Error creando tarea', error);
    } finally {
      this.isLoading = false;       
    }
  }

}
