import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { GuardFactoryService } from './guard.guard';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CartComponent } from './components/cart/cart.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { HistoryOrdersComponent } from './components/history-orders/history-orders.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductsSearchedComponent } from './components/products-searched/products-searched.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CartSuccessComponent } from './components/cart-success/cart-success.component';
import { AddPromotionComponent } from './components/add-promotion/add-promotion.component';

const routes: Routes = [

  {path: '',component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'product-detail/:productId', component: ProductDetailComponent, canActivate: [GuardFactoryService]},
  {path: 'add-product', component: AddProductComponent},
  {path: 'add-promotion', component: AddPromotionComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'cart', component: CartComponent, canActivate: [GuardFactoryService]},
  {path: 'edit-product/:productId', component: EditProductComponent, canActivate: [GuardFactoryService]},
  {path: 'orders', component: OrdersComponent},
  {path: 'history', component: HistoryOrdersComponent},
  {path: 'category/:nombre', component: CategoryComponent},
  {path: 'search-results', component: ProductsSearchedComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'cart-success', component: CartSuccessComponent, canActivate: [GuardFactoryService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
