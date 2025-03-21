import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductAPIService } from '../../../app/services/product-api.service';

@Component({
  selector: 'app-view-product',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  isEditing: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private router: Router, private productService: ProductAPIService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Fetch all products from the API
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Add an originalIndex property to each product to keep track of the original order
        this.products = products.map((product, index) => ({
          ...product,
          originalIndex: index
        }));
        this.filteredProducts = [...this.products];
        this.calculateTotalPages();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getPaginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      Object.values(product).some((value: any) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      ));
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  onEditAction(product: any): void {
    this.router.navigate(['/products/add'], { state: { product } });
  }

  onDeleteAction(productID: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productID).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after deletion
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      });
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction if the same column is clicked again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending order for a new column
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    if (column === '#') {
      // Sort by originalIndex
      this.filteredProducts.sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a.originalIndex - b.originalIndex; // Ascending order
        } else {
          return b.originalIndex - a.originalIndex; // Descending order
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

    this.currentPage = 1; // Reset to the first page after sorting
  }
}