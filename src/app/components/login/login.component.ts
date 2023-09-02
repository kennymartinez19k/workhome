import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {Router} from "@angular/router"
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {

  formLogin: FormGroup;
constructor( private router: Router, private authService: AuthService ){
  this.formLogin = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

}

  ngOnInit(): void {}


  onSubmit(){

    const email = this.formLogin.value.email
    const password = this.formLogin.value.password
    this.authService.login(email, password)
    .then(response => {
      console.log(response)
      const usuarioNombre = this.authService.getCurrentUser()?.displayName
      const usuarioEmail = this.authService.getCurrentUser()?.email
      const userData = {nombre: usuarioNombre, email: usuarioEmail}
      localStorage.setItem("usuario", JSON.stringify(userData))
      localStorage.setItem("islog", JSON.stringify(true))
      alert("Logeo Exitoso")
      this.router.navigate(['profile'])
    })
    .catch(error => {
      console.log(error)
      alert("Credenciales incorrectas")
    })
  }

  onClick() {
    this.authService.loginWithGoogle()
      .then(response => {
        const usuarioNombre = this.authService.getCurrentUser()?.displayName
        const usuarioEmail = this.authService.getCurrentUser()?.email
        const userData = {nombre: usuarioNombre, email: usuarioEmail}
        localStorage.setItem("usuario", JSON.stringify(userData))
        localStorage.setItem("islog", JSON.stringify(true))
        console.log(response);
        alert("Logeo Exitoso")
        this.router.navigate(['profile'])
      })
      .catch(error => {
        console.log(error)
      })
  }
}