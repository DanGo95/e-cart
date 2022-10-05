import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
  cart!: Cart;
  productCarts!: ProductCart[];
  itemsCart: Product[] = [];

  constructor( private products: ProductsService, private cartService: CartService, private router: Router ) { }

  ngOnInit(): void {
    this.products$ = this.products.getProducts();
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
