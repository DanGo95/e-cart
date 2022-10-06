import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductCart } from '../interfaces/product-cart';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsCollection!: AngularFirestoreCollection<Product>;

  productDetails?: Product;
  
  constructor( private afs: AngularFirestore ) {
    this.productsCollection = this.afs.collection('products');
  }

  getProducts() {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  getProductById( id: string ) {
    return this.productsCollection.doc(id).valueChanges({ idField: 'id' });
  }

  getProductDetails( productCart: ProductCart ) {
    return this.productsCollection.valueChanges({ idField: 'id' }).pipe(
      map( (products: Product[]) => {
        this.productDetails = products.filter( product => product.id === productCart.product_id )[0];
        return this.productDetails;
      })
    )
  }
}
