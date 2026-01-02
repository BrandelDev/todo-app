import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';

import { CategoriaService } from 'src/app/config-app/services/categoria.service';
import { Categoria } from 'src/app/config-app/models/categoria.model';

@Component({
  selector: 'app-top-bar-filter',
  templateUrl: './top-bar-filter.component.html',
  styleUrls: ['./top-bar-filter.component.css'],
  imports: [
    CommonModule,
    IonSegment, 
    IonSegmentButton, 
    IonLabel,
    FormsModule
  ]
})
export class TopBarFilterComponent implements OnInit {

  filter:string = 'all';
  categorias$!: Observable<Categoria[]>;
  private readonly _categoriaService = inject(CategoriaService);
  @Output() filterChange = new EventEmitter<string>();

  constructor() { 
    this.categorias$ = this._categoriaService.listCategorias$();
  }

  ngOnInit() {
  }

  onFilterChange(value: any): void {
    console.log('Filter changed to:', value);
    this.filterChange.emit(value);
  }
}
