import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCart } from '../../interfaces/product-cart';
import { Cart } from '../../interfaces/cart';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() productCarts: ProductCart[] = [];
  @Input() cart!: Cart;

  totalPrice = 0;

  constructor( private cartService: CartService, private router: Router ) { }

  ngOnInit(): void {
    this.productCarts.forEach((item, index) => {
      this.totalPrice += (item.quantity * this.products[index].price);
    })
  }

  completeCart() {
    Swal.fire({
      icon: 'success',
      text: 'Your order has been submitted successfully'
    });

    this.cartService.completeCart(this.cart);
    this.router.navigateByUrl('/home');
  }

}
