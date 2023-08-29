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
    this.authService.login(this.formLogin.value)
    .then(response => {
      console.log(response)
      localStorage.setItem("islog", JSON.stringify(true))
      alert("Logeo Exitoso")
      this.router.navigate(['/home'])
    })
    .catch(error => {
      console.log(error)
      alert("Credenciales incorrectas")
    })
  }

  onClick() {
    this.authService.loginWithGoogle()
      .then(response => {
        localStorage.setItem("islog", JSON.stringify(true))
        console.log(response);
        alert("Logeo Exitoso")
        this.router.navigate(['home'])
      })
      .catch(error => {
        console.log(error)
      })
  }
}