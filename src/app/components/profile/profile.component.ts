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
    this.auth.logout().then(async() => {
      const alert = await this.alert.create({
        header: 'Cierre de sesión existoso',
        message: 'Vuelva a inicar sesión para seguir comprando.',
        buttons: ['OK']
      })
      await alert.present()
      this.storageService.remove("usuario")
      this.router.navigate(['login'])
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

}