import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { GuardFactoryService } from './guard.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { SliderComponent } from './components/slider/slider.component';
import { ImagenesComponent } from './components/imagenes/imagenes.component';
import { CartComponent } from './components/cart/cart.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

const routes: Routes = [

  {path: '',component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'product-detail', component: ProductDetailComponent},
  {path: 'add-product', component: AddProductComponent, canActivate: [GuardFactoryService]},
  {path: 'profile', component: ProfileComponent},
  {path: 'slider', component: SliderComponent},
  {path: 'img', component: ImagenesComponent},
  {path: 'cart', component: CartComponent, canActivate: [GuardFactoryService]},
  {path: 'edit-product/:uid', component: EditProductComponent, canActivate: [GuardFactoryService]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
