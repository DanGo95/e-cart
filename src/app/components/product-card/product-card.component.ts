import { Component, OnInit } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { Router } from '@angular/router';
import { Cart } from '../../interfaces/cart';
import { ProductCart } from '../../interfaces/product-cart';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  products$!: Observable<Product[]>;
  productCarts!: ProductCart[];
  itemsCart: Product[] = [];

  isLoading = false;

  constructor( private products: ProductsService, private cartService: CartService, private router: Router ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.products$ = this.products.getProducts();
    /* get cart */
    this.cartService.getCart().pipe(
      /* search products from cart */
      mergeMap(cart => this.cartService.getProductCarts(cart))
    ).subscribe( res => {
      this.productCarts = res;
      /* populate product from cart */
      res.forEach( element => {
        this.products.getProductDetails(element).subscribe( product => this.itemsCart.push(product))
      })
      this.isLoading = false;
    })
  }

  onProductClick( product: Product ) {
    this.router.navigate(['/product', product.id]);
  }

  addToCart( product: Product ) {
    Swal.showLoading();
    this.cartService.addProductToCart(product)?.subscribe( resp => {
      Swal.close();
      Swal.fire({
        icon: 'success',
        text: 'The product has been added to the cart'
      });
    });
  }

  removeProduct( product: Product ) {
    Swal.showLoading();
    if ( product.id ) {
      const item = this.productCarts.find( element => element.product_id === product.id);
      if ( item?.id ) {
        this.cartService.removeProduct(item.id);
        Swal.fire({
          icon: 'success',
          text: 'The product has been removed from the cart'
        });
      }
    }
  }

  existInCart( product: Product ) {
    if ( this.productCarts ) {
      return this.productCarts.find( element => element.product_id === product.id);
    }
    return;
  }

}
