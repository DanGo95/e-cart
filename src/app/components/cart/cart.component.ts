import { Component, OnInit } from '@angular/core';
import { Cart } from '../../interfaces/cart';
import { ProductCart } from '../../interfaces/product-cart';
import { Product } from '../../interfaces/product';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { mergeMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart!: Cart;
  itemsCart!: ProductCart[];
  itemsDetails: Product[] = [];

  isLoading = false;

  constructor( private cartService: CartService, private productsService: ProductsService, private router: Router ) { }

  ngOnInit(): void {
    this.isLoading = true;
    /* get cart */
    this.cartService.getCart().pipe(
      mergeMap( (cart: any) => {
        this.cart = cart;
        /* search products from cart */
        return this.cartService.getProductCarts(cart);
      })
    ).subscribe( (res: any) => {
      this.itemsCart = res;
      /* populate product from cart */
      this.itemsDetails = [];
      res.forEach((element: ProductCart) => {
        this.productsService.getProductDetails(element).subscribe( 
          (product: any) => this.itemsDetails.push(product)
        )
      });
      this.isLoading = false;
    })
  }

  updateQuantity ( eventData: { id: string, quantity: any } ) {
    this.cartService.updateProduct(eventData.id, eventData.quantity);
  }

}
