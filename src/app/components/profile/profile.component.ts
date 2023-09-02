import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Firestore ,collection, doc, getDocs, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

  public islog = false;
  userData: any;

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
      this.router.navigate(['login'])
    })
  }

  ngOnInit(): void {
    const estaLogeado = (localStorage.getItem("islog"))
    if(estaLogeado !== null){
      this.islog = JSON.parse(estaLogeado)
    }
    
    const userDataString = localStorage.getItem("usuario")
    if(userDataString) {
      this.userData = JSON.parse(userDataString)
    }
    console.log(this.test.currentUser?.displayName)

  }

}