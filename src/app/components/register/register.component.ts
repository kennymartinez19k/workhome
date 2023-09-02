import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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

  await this.authService.register(this.formReg.value)
  .then(response => {
    console.log(response)
    this.router.navigate(['login'])
  }).catch(error =>console.log(error))
}

}
