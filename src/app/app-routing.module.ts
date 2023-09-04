import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { GuardFactoryService } from './guard.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
const routes: Routes = [

  {path: '',component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [GuardFactoryService]},
  {path: 'product-detail', component: ProductDetailComponent},
  {path: 'add-product', component: AddProductComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
