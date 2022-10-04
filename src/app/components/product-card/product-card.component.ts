import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  products$!: Observable<Product[]>;

  constructor( private products: ProductsService, private router: Router ) { }

  ngOnInit(): void {
    this.products$ = this.products.getProducts();
  }

  onProductClick( product: Product ) {
    this.router.navigate(['/product', product.id]);
  }

}
