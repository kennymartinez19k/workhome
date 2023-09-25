import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  userData: any = {};
  usuario: any = {};

  constructor(private router: Router, private auth: AuthService, 
    private alert: AlertController, private storageService: StorageService){}

     logout(){
      this.storageService.clear().then(() => {
      this.auth.logout()
      this.router.navigate(['login']).then(()=>{location.reload()})
    })
  }

  async ngOnInit() {

    const dataUsuario = await this.storageService.get("usuario")
    if(dataUsuario) {
      this.usuario = dataUsuario
    }
    
    const userDataRef = await this.storageService.get("usuario")
    if(userDataRef) {
      this.userData = userDataRef
    }

  }

  async confirmLogout() {
    const alert = await this.alert.create({
      header: 'Cerrar sesión',
      message: '¿Está que desea cerrar sesión?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {alert.dismiss()}
      },
    {
      text: 'Eliminar',
      handler: () => {
        this.logout()}
    }]
    })
    await alert.present()
  }

}