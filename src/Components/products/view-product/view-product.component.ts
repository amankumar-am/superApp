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
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1

  constructor(private router: Router) {
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(this.initialProducts));
    }
    this.products = localStorage.getItem('products') || '[]';
    this.productJSON = JSON.parse(this.products).map((product: any, index: number) => ({
      ...product,
      originalIndex: index
    }));
    this.filteredProducts = this.productJSON;
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getPaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  filterProducts() {
    this.filteredProducts = this.productJSON.filter((product) =>
      Object.values(product).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  onEditAction(product: any): void {
    this.router.navigate(['/products/add'], { state: { product } });
  }

  onDeleteAction(productID: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productJSON = this.productJSON.filter((product: any) => product.productID !== productID);
      localStorage.setItem('products', JSON.stringify(this.productJSON));
      this.refreshTable();
    }
  }

  refreshTable() {
    this.products = localStorage.getItem('products') || '[]';
    this.productJSON = JSON.parse(this.products).map((product: any, index: number) => ({
      ...product,
      originalIndex: index
    }));
    this.filteredProducts = this.productJSON;
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (column === '#') {
      this.filteredProducts.sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a.originalIndex - b.originalIndex;
        } else {
          return b.originalIndex - a.originalIndex;
        }
      });
    } else {
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

    this.currentPage = 1; // Reset to the first page after sorting
  }
}