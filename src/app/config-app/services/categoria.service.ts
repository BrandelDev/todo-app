import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly firestore = inject(Firestore);

  async addCategoria(categoria: Categoria) {
    const categoriasRef = collection(this.firestore, 'categorias');
    return addDoc(categoriasRef, {
      nombre: categoria.nombre,
      createdAt: new Date(),
    });
  }

  listCategorias$(): Observable<Categoria[]> {
    const categoriasRef = collection(this.firestore, 'categorias');
    const q = query(categoriasRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) =>
        docs.map((data: any) => ({
          id: data.id,
          nombre: data.nombre,
          color: data.color ?? null,
        }))
      )
    );
  }

  deleteCategoria(id: string) {
    const categoriaRef = doc(this.firestore, 'categorias', id);
    return deleteDoc(categoriaRef);
  }
}
