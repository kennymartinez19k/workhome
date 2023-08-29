import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ExitosoComponent } from './components/exitoso/exitoso.component';
const routes: Routes = [
  { path: '', component: RegisterComponent },
  {path:'register', component: RegisterComponent},
  {path:'exito', component: ExitosoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
