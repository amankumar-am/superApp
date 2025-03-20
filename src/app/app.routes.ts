import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../Components/home/home.component';
import { AboutComponent } from '../Components/about/about.component';
import { ContactComponent } from '../Components/contact/contact.component';
import { ProductsComponent } from '../Components/products/products.component';
import { AddProductComponent } from '../Components/products/add-product/add-product.component';
import { ViewProductComponent } from '../Components/products/view-product/view-product.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'products/add', component: AddProductComponent },
    { path: 'products/view', component: ViewProductComponent },
    { path: 'contact', component: ContactComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
