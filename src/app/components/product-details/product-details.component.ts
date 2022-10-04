import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product & { id: string; } | undefined;

  constructor( private route: ActivatedRoute, private products: ProductsService, private location: Location) { }

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

}
