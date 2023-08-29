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

constructor( private authService: AuthService, private router: Router, private firestoreService: FirestoreService){
  this.formReg = new FormGroup({
    nombre: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })
}

ngOnInit(): void{}

async onSubmit(){

  const nombre = this.formReg.value.nombre;
  const email = this.formReg.value.email;
  
  const usuario = {nombre, email}

  this.authService.register(this.formReg.value)
  .then(response =>{
    const registro = this.firestoreService.addUser(usuario)
    console.log(response, registro)
    this.router.navigate(['/exito'])
  })
  .catch(error => console.log(error))
}

}
