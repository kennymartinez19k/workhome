import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;
  nombre: string = ''
  email: string = ''

constructor(private auth: Auth, private authService: AuthService, private router: Router, private firestoreService: FirestoreService){
  this.formReg = new FormGroup({
    nombre: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })
}

ngOnInit(): void{}

async onSubmit(){

  this.authService.register(this.formReg.value)
  .then(response =>{
    const registro = this.firestoreService.addUser(this.formReg.value.nombre, this.formReg.value.email)
    console.log(response, registro)
    this.router.navigate(['/login'])
  })
  .catch(error => console.log(error))
}

}
