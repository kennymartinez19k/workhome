import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;

constructor( private authService: AuthService, private router: Router){
  this.formReg = new FormGroup({
    nombre: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })
}

ngOnInit(): void{}

async register(){
  const nombre = this.formReg.value.nombre
  const email = this.formReg.value.email
  const password = this.formReg.value.password
  
  if(nombre && email && password){
    try {
      await this.authService.register(email, password, nombre)
      this.router.navigate(['profile'])
      alert("logeo exitoso")
    } catch (error) {
      alert("error")
    }
  }

}

}
