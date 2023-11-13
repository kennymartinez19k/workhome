import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {

  formLogin: FormGroup;
  userdata: User[] = []
  
  constructor( private router: Router, public authService: AuthService, 
    private userService: UserService, private storageService: StorageService,
    private cdRef: ChangeDetectorRef, private loading: LoadingController,
    private alert: AlertController){
  this.formLogin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
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

    const loading = await this.loading.create({
      message: 'Iniciando sesión...',
    });
  
    await loading.present();
  
    try {
      
      this.authService.login(userData).then( () => {
      
        this.userService.getUser().subscribe(async userdata => {
          this.userdata = userdata
          const username = userdata.map(x => x.username)
          const email = userdata.map(x => x.email)
          const role = userdata.map(x => x.role)
          const tel = userdata.map(x => x.tel)
          const usuario = {username, email, role, tel}
          await this.storageService.set("usuario", usuario)
          await loading.dismiss()
            this.router.navigate(['home'])
        })
      }).catch(async () => {
      await loading.dismiss()

        const alert = await this.alert.create({
          header: 'Error',
          message: 'Las credenciales son incorrectas. Por favor, inténtalo de nuevo.',
          buttons: ['OK'],
        });
    
        await alert.present();
      })
    } catch (error) {
      console.error(error);
      await loading.dismiss()
    }
    }

  async loginGuest() {
    await this.storageService.remove('usuario').then(()=>{
      this.router.navigate(['/home'])
    })
  }

  // loginGoogle() {
  //   this.authService.loginWithGoogle()
  // }

}