import { Component } from '@angular/core';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  imports: [AddProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
