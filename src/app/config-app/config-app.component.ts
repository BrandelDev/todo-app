import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';

import { CategoriaService } from './services/categoria.service';
import { Categoria } from './models/categoria.model';

@Component({
  selector: 'app-config-app',
  templateUrl: './config-app.component.html',
  styleUrls: ['./config-app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    ReactiveFormsModule
  ]
})
export class ConfigAppComponent {

  private readonly _fb = inject(FormBuilder);
  private readonly _categoriaService = inject(CategoriaService);
  private readonly _location = inject(Location);

  categoriaForm!: FormGroup;
  categorias$!: Observable<Categoria[]>;
  isLoading: boolean = false;
  isFormInvalid: boolean = false;

  constructor() {
    this.categoriaForm = this._fb.group({
      nombre: ['', Validators.required]    
    });
    this.categorias$ = this._categoriaService.listCategorias$();
  }

  async onSubmit(): Promise<void> {
    this.categoriaForm.markAllAsTouched();

    if (this.categoriaForm.invalid) {
      this.isFormInvalid = true;
      return;
    }

    this.isFormInvalid = false;
    const formValue = this.categoriaForm.value;
    const nombre = (formValue.nombre ?? '').trim();
    if (!nombre) {
      this.isFormInvalid = true;
      return;
    }

    try {
      this.isLoading = true;
      await this._categoriaService.addCategoria({
        nombre: nombre     });
      this.categoriaForm.reset();
    } catch (error) {
      console.error('Error agregando categoria', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onDelete(categoria: Categoria): Promise<void> {
    if (!categoria.id) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar la categoria "${categoria.nombre}"?`);
    if (!confirmed) {
      return;
    }

    try {
      this.isLoading = true;
      await this._categoriaService.deleteCategoria(categoria.id);
    } catch (error) {
      console.error('Error eliminando categoria', error);
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this._location.back();
  }

}
