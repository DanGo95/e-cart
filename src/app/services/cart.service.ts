import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { Product } from '../interfaces/product';
import { Cart } from '../interfaces/cart';
import { ProductCart } from '../interfaces/product-cart';
import { from, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

const INCREMENT = firebase.firestore.FieldValue.increment(1);
const DECREMENT = firebase.firestore.FieldValue.increment(-1);

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartsCollection!: AngularFirestoreCollection<Cart>;
  private productCartCollection!: AngularFirestoreCollection<ProductCart>;

  itemDoc!: AngularFirestoreDocument<ProductCart>;
  item?: Observable<ProductCart>;

  cart?: Cart;
  cartItems?: ProductCart[] = [];
  productDetails?: Product;

  constructor( private afs: AngularFirestore, private auth: AuthService ) {
    this.productCartCollection = this.afs.collection('product_carts');
    this.cartsCollection = this.afs.collection<Cart>('carts');
  }

  getProductCarts( cart: Cart ) {
    return this.productCartCollection.valueChanges({idField: 'id'}).pipe(
      map( (products: ProductCart[]) => {
        this.cartItems = products.filter( product => product.cart_id === cart.id);
        return this.cartItems;
      })
    )
  }

  getCart() {
    return this.cartsCollection.valueChanges({idField: 'id'}).pipe(
      map( (carts: Cart[]) => {
        if ( this.auth.user !== '' ) {
          this.cart = carts.find( cart => cart.status === 'pending' && cart.uid === this.auth.user);
          if ( !this.cart ) {
            return this.createCart();
          }
        }
        return this.cart;
      })
    )
  }

  createCart() {
    if ( !this.cart && this.auth.user !== '' ) {
      const cart: Cart = {
        status: 'pending',
        uid: this.auth.user
      };
      return this.cartsCollection.add(cart);
    }
    return;
  }

  addProductToCart( product: Product ) {
    if ( product.id && this.cart?.id ) {
      const productCart: ProductCart = {
        product_id: product.id,
        cart_id: this.cart.id,
        quantity: 1
      };
      return from(this.productCartCollection.add(productCart));
    }
    return;
  }

  completeCart( cart: Cart ) {
    this.cartsCollection.doc(cart.id).update({status: 'completed'});
  }

  updateProduct( productId: string, quantity: number ) {
    this.productCartCollection.doc(productId).update({quantity});
  }

  removeProduct( productId: string ) {
    this.productCartCollection.doc(productId).delete();
  }
}
