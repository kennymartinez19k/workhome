import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  userData: any;
  usuario: any;

  constructor(private router: Router, private auth: AuthService, 
    private alert: AlertController, private test: Auth){}

    logout(){
    this.auth.logout().then(async() => {
      const alert = await this.alert.create({
        header: 'Cierre de sesión existoso',
        message: 'Vuelva a inicar sesión para seguir comprando.',
        buttons: ['OK']
      })
      await alert.present()
      localStorage.removeItem("usuario")
      this.router.navigate(['login'])
    })
  }

  ngOnInit(): void {

    const dataUsuario = localStorage.getItem("usuario")
    if(dataUsuario) {
      this.usuario = JSON.parse(dataUsuario)
    }
    
    const userDataRef = localStorage.getItem("usuario")
    if(userDataRef) {
      this.userData = JSON.parse(userDataRef)
    }

  }

}