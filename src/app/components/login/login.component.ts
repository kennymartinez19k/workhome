import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {

  formLogin: FormGroup;
  userdata: User[] = []
  constructor( private router: Router, private authService: AuthService, 
    private firestoreService: FirestoreService, private storageService: StorageService){
  this.formLogin = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

}

  ngOnInit(): void {}

 async login() {

    const userData = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    }

    this.authService.login(userData)

      this.firestoreService.obtenerUsuario().subscribe(async userdata => {
        this.userdata = userdata
        const username = userdata.map(x => x.username)
        const email = userdata.map(x => x.email)
        const role = userdata.map(x => x.role)
        const usuario = {username, email, role}
        await this.storageService.set("usuario", usuario)
        
        this.router.navigate(['home']).then(()=> {location.reload()})
      })
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .then(response => {
        const usuarioNombre = this.authService.getCurrentUser()?.displayName
        const usuarioEmail = this.authService.getCurrentUser()?.email
        const userData = {username: usuarioNombre, email: usuarioEmail}
        localStorage.setItem("usuario", JSON.stringify(userData))
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