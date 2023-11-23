import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  userData: any = {};
  cartItems: any = []

  constructor(private router: Router, private auth: AuthService, 
    private alert: AlertController, private storageService: StorageService,
    private cartService: ShoppingCartService){}

     logout(){
      this.storageService.remove('usuario').then(() => {
      this.auth.logout()
      this.router.navigate(['login']).then(()=>{})
    })
  }

  async ngOnInit() {
    let userId = await this.auth.getUserUid()
    this.cartItems = await this.cartService.getCartItems(userId)
    this.userData = await this.storageService.get('usuario')
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
      text: 'Aceptar',
      handler: () => {
        this.logout()}
    }]
    })
    await alert.present()
  }

}