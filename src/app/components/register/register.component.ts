import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;

constructor( private authService: AuthService, private router: Router, 
  private userService: UserService, private cdRef: ChangeDetectorRef){
  this.formReg = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl()
  })
}

ngOnInit(): void{
  this.cdRef.detectChanges()
}

async register() {

const userData = {
  username: this.formReg.value.username,
  email: this.formReg.value.email
}

  this.authService.register(this.formReg.value).then(response => {
    const register = this.userService.addUser(userData)
    console.log(response, register)
    this.router.navigate(['/login'])
  }).catch(error => console.log(error))
}

}
