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
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })
}

ngOnInit(): void{}

 register(){

  const userData = {
    username: this.formReg.value.username,
    password: this.formReg.value.password,
    email: this.formReg.value.email
  }

  const userRef = {
    username: userData.username,
    email: userData.email,
    uid: this.authService.getCurrentUser()?.uid,
    role: 'usuario'
  }

  this.authService.register(userData).then(()=>{
    this.firestoreService.addUser(userRef)
    this.router.navigate(['login'])
  })

}

}
