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

// async register(){

//   const userData = {
//     username: this.formReg.value.username,
//     password: this.formReg.value.password,
//     email: this.formReg.value.email
//   }

//   const userRef = {
//     username: userData.username,
//     email: userData.email,
//     uid: this.authService.getCurrentUser()?.uid,
//     role: 'usuario'
//   }

//     this.authService.register(userData).then( () => {
//     this.firestoreService.addUser(userRef)
//     console.log(userRef)
//     this.router.navigate(['login'])
//   } )

// }
async register() {

const userData = {
  username: this.formReg.value.username,
  email: this.formReg.value.email
}

  this.authService.register(this.formReg.value).then(response => {
    const register = this.firestoreService.addUser(userData)
    console.log(response, register)
    this.router.navigate(['/login'])
  }).catch(error => console.log(error))
}

}
