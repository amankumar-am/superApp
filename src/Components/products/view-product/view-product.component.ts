import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Products } from './initialProduct';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent {
  initialProducts = Products;
  products: string;
  searchTerm: string = '';
  filteredProducts: any[] = [];
  productJSON: any[] = [];
  selectedProduct: any = null;
  isEditing: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private router: Router) {
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(this.initialProducts));
    }
    this.products = localStorage.getItem('products') || '[]';
    this.productJSON = JSON.parse(this.products).map((product: any, index: number) => ({
      ...product,
      originalIndex: index // Add original index
    }));
    this.filteredProducts = this.productJSON;
  }

  // Filter products based on search term
  filterProducts() {
    this.filteredProducts = this.productJSON.filter((product) =>
      Object.values(product).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  // Navigate to the add-product component with the selected product data
  onEditAction(product: any): void {
    this.router.navigate(['/products/add'], { state: { product } });
  }

  // Delete a product by its ID
  onDeleteAction(productID: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productJSON = this.productJSON.filter((product: any) => product.productID !== productID);
      localStorage.setItem('products', JSON.stringify(this.productJSON));
      this.refreshTable();
    }
  }

  // Refresh the table by re-fetching data from localStorage
  refreshTable() {
    this.products = localStorage.getItem('products') || '[]';
    this.productJSON = JSON.parse(this.products).map((product: any, index: number) => ({
      ...product,
      originalIndex: index // Reassign original index after refresh
    }));
    this.filteredProducts = this.productJSON;
  }

  // Sort the table based on the column
  sort(column: string) {
    if (this.sortColumn === column) {
      // Toggle sort direction if the same column is clicked again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending order for a new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (column === '#') {
      // Sort by original index
      this.filteredProducts.sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a.originalIndex - b.originalIndex;
        } else {
          return b.originalIndex - a.originalIndex;
        }
      });
    } else {
      // Sort by other columns
      this.filteredProducts.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];

        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  }
}