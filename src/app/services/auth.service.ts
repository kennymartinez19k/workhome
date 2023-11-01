import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, sendPasswordResetEmail, GoogleAuthProvider, getAuth, signInWithCredential} from '@angular/fire/auth';
import { LoadingController, AlertController } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// import { GoogleAuthProvider, getAuth, signInWithCredential } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';
import {initializeApp} from 'firebase/app'
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isWeb = false
  firebase: any
  constructor(private auth: Auth, private loading: LoadingController, private alert: AlertController,
    private plataform: Platform, private storage: StorageService, private router: Router) {
      this.firebase = initializeApp(environment.firebase)
      GoogleAuth.initialize()
    }

  async register({email, password}: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  // async login({ email, password }: any) {
  //   const loading = await this.loading.create({
  //     message: 'Iniciando sesión...',
  //   });
  
  //   await loading.present();
  
  //   try {
  //     await signInWithEmailAndPassword(this.auth, email, password);

  //   } catch (error) {
  //     console.error(error);
  
  //     await loading.dismiss();
  
  //     const alert = await this.alert.create({
  //       header: 'Error',
  //       message: 'Las credenciales son incorrectas. Por favor, inténtalo de nuevo.',
  //       buttons: ['OK'],
  //     });
  
  //     await alert.present();
  //   } 
  // }

  async login({ email, password }: any) {
      await signInWithEmailAndPassword(this.auth, email, password);
  }

async loginWithGoogle() {
      const user = await GoogleAuth.signIn();
      if (user) {
        const credential = GoogleAuthProvider.credential(user.authentication.idToken);
        await signInWithCredential(getAuth(this.firebase), credential);
        const userData = { username: user.name, email: user.email, role: 'usuario' };
        await this.storage.set("usuario", userData);
        this.router.navigate(['/home']).then(()=>{})
      } else {
        console.log('Inicio de sesión con Google cancelado o fallido');
      }
    }


  // async loginWithGoogle() {
  //   try {
  //     const user = await GoogleAuth.signIn()
  //     if(user) {
  //       signInWithCredential(getAuth(this.firebase), GoogleAuthProvider.credential(user.authentication.idToken))
  //       const userData = {username: user.givenName, email: user.email, role: 'usuario'}
  //       await this.storage.set("usuario", userData)
  //     }
  //   }catch(error) {
  //     console.log(error)
  //   }
  // }

  logout() {
    return signOut(this.auth);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email)
      console.log('restablecimiento enviado por correo')
    } catch {
      console.log('error al enviar correo de restablecimiento')
    }
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

 async getUserUid() {
  const user = await this.auth.currentUser
  if(user) {
    return user.uid
  }else {
    return null
  }
 }
 

}
