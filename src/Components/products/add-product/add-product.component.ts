import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService } from '../../../app/services/product-api.service';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductAPIService // Inject the API service
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(6)]],
      productType: ['', Validators.required],
      productOwner: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$'), this.minValueValidator(1)]],
      productOwnerEmail: ['', [Validators.required, Validators.email]]
    });

    // Check if product data is passed for editing
    const state = this.router.getCurrentNavigation()?.extras.state || window.history.state;
    if (state && state['product']) {
      this.isEditMode = true;
      this.productId = state['product'].productID; // Store the product ID
      this.productForm.patchValue(state['product']); // Populate the form with existing data
    }
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const productData = form.value;

      if (this.isEditMode) {
        // Update existing product
        this.updateProduct(productData);
      } else {
        // Add new product
        this.addProduct(productData);
      }
    }
  }

  addProduct(productData: any) {
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        alert('Product added successfully!');
        this.productForm.reset();
        this.router.navigate(['/products/view']).then((success) => {
          if (!success) {
            console.error('Navigation failed. Check if the route exists.');
          }
        });
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      }
    });
  }

  updateProduct(productData: any) {
    if (this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (response) => {
          console.log(response);

          alert('Product updated successfully!');
          this.productForm.reset();
          this.router.navigate(['/products/view']).then((success) => {
            if (!success) {
              console.error('Navigation failed. Check if the route exists.');
            }
          });
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product. Please try again.');
        }
      });
    } else {
      console.error('Product ID is missing.');
      alert('Product ID is missing. Cannot update product.');
    }
  }

  minValueValidator(min: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== null && value !== '' && (isNaN(value) || value < min)) {
        return { min: { requiredMin: min, actualValue: value } };
      }
      return null;
    };
  }

  goBack() {
    this.router.navigate(['/products/view']);
  }
}