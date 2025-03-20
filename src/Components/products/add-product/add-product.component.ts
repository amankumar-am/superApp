import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Import Router and ActivatedRoute

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
    private router: Router, // Inject Router
    private route: ActivatedRoute // Inject ActivatedRoute
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

      form.reset();
      this.router.navigate(['/products/view']).then((success) => {
        if (!success) {
          console.error('Navigation failed. Check if the route exists.');
        }
      });
    }
  }

  addProduct(productData: any) {
    const productID = this.getNextProductID();
    const newProduct = { ...productData, productID };
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    alert('Product added successfully!');
  }

  updateProduct(productData: any) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const index = products.findIndex((p: any) => p.productID === this.productId);

    if (index !== -1) {
      products[index] = { ...productData, productID: this.productId }; // Update the product
      localStorage.setItem('products', JSON.stringify(products));
      console.log('Product updated:', products[index]);
      alert('Product updated successfully!');
    } else {
      console.error('Product not found for editing');
      alert('Product not found!');
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

  getNextProductID(): string {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    let maxID = 0;
    products.forEach((product: any) => {
      if (product.productID) {
        const idNumber = parseInt(product.productID.replace('PROD', ''), 10);
        if (idNumber > maxID) {
          maxID = idNumber;
        }
      }
    });
    return `PROD${maxID + 1}`;
  }
}