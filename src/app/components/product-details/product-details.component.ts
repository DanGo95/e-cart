import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart.service';
import { ProductCart } from '../../interfaces/product-cart';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product & { id: string; } | undefined;
  productCarts!: ProductCart[];

  constructor( private route: ActivatedRoute, private products: ProductsService, private cartService: CartService, private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => {
      const { id } = params;
      this.products.getProductById(id).subscribe( (product) => {
        this.product = product
      });
    })
  }

  onReturn() {
    this.location.back();
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
