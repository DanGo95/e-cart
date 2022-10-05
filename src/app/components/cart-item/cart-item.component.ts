import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductCart } from '../../interfaces/product-cart';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() productCarts: ProductCart[] = [];

  @Output() updateQuantity = new EventEmitter<{ id: string, quantity: any }>();

  constructor( private cartService: CartService, private router: Router ) { }

  ngOnInit(): void {}

  onUpdateQuantity( quantity: any, product: Product ) {
    if ( product.id ) {
      const item = this.productCarts.find( element => element.product_id === product.id);
      if ( item?.id ) {
        this.updateQuantity.emit({id: item.id, quantity});
      }
    }
  }

  removeProduct( product: Product ) {
    if ( product.id ) {
      const item = this.productCarts.find( element => element.product_id === product.id);
      if( item?.id ) {
        this.cartService.removeProduct(item.id);
      }
    }
  }

}
