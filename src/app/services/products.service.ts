import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsCollection!: AngularFirestoreCollection<Product>;
  
  constructor( private afs: AngularFirestore ) {
    this.productsCollection = this.afs.collection('products');
  }

  getProducts() {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  getProductById( id: string ) {
    return this.productsCollection.doc(id).valueChanges({ idField: 'id' });
  }
}
