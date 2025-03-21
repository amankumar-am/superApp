import { Component, OnInit } from '@angular/core';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import { ProductAPIService } from '../../app/services/product-api.service';

// Register the necessary components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chart: any;

  constructor(private productService: ProductAPIService) { }

  ngOnInit(): void {
    this.fetchDataAndCreateChart();
  }

  fetchDataAndCreateChart(): void {
    this.productService.getAllProducts().subscribe(
      (products) => {
        const productNames = products.map((product) => product.productName);
        const productPrices = products.map((product) => product.productPrice);
        this.createChart(productNames, productPrices);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  createChart(productNames: string[], productPrices: number[]): void {
    const canvas = document.getElementById('MyChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: productNames,
        datasets: [{
          label: 'Product Prices',
          data: productPrices,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}