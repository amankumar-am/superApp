import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productType } from '../Interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductAPIService {
  apiUrl = "https://67dc13081fd9e43fe47719c6.mockapi.io/products";

  constructor(private http: HttpClient) { }

  // Fetch all products
  getAllProducts(): Observable<productType[]> {
    return this.http.get<productType[]>(this.apiUrl);
  }

  // Fetch a single product by ID
  getProductById(id: string): Observable<productType> {
    return this.http.get<productType>(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: productType): Observable<productType> {
    return this.http.post<productType>(this.apiUrl, product);
  }

  // Update an existing product
  updateProduct(id: string, product: productType): Observable<productType> {
    return this.http.put<productType>(`${this.apiUrl}/${id}`, product);
  }

  // Delete a product by ID
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}