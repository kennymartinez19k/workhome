import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {

  formLogin: FormGroup;
  userdata: User[] = []
  
  constructor( private router: Router, private authService: AuthService, 
    private userService: UserService, private storageService: StorageService,
    private cdRef: ChangeDetectorRef){
  this.formLogin = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

}

  ngOnInit(): void {
    this.cdRef.detectChanges()
  }

 async login() {

    const userData = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    }

    this.authService.login(userData).then(()=>{
      
      this.userService.getUser().subscribe(async userdata => {
        this.userdata = userdata
        const username = userdata.map(x => x.username)
        const email = userdata.map(x => x.email)
        const role = userdata.map(x => x.role)
        const usuario = {username, email, role}
        await this.storageService.set("usuario", usuario)
        
        this.router.navigate(['home']).then(()=>{location.reload()})
      })
    })
  }

  //   loginGoogle() {
  //   this.authService.loginWithGoogle()
  //     .then( async () => {
  //       const usuarioNombre = this.authService.getCurrentUser()?.displayName
  //       const usuarioEmail = this.authService.getCurrentUser()?.email
  //       const userData = {username: usuarioNombre, email: usuarioEmail, role: 'usuario'}
  //       await this.storageService.set("usuario", userData)
  //       this.router.navigate(['home'])
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }

  async loginGoogle() {
    try {
      const result = await this.authService.loginWithGoogle().then(()=> {
        this.router.navigate(['home'])
        // .then(() => {location.reload()})
      console.log('logueado', result)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

}