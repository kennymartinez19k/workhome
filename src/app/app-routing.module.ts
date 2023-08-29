import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ExitosoComponent } from './components/exitoso/exitoso.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  { path: '', component: RegisterComponent },
  {path:'register', component: RegisterComponent},
  {path:'exito', component: ExitosoComponent},
  { path: 'home', component: HomeComponent },
  {path: '',component: LoginComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
