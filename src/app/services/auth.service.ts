import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private loading: LoadingController, private router: Router) { }

  async register({email, password}: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login({email, password}: any) {
      const loading = await this.loading.create({
        message: 'Iniciando sesión...'
      })
      await loading.present()
      await signInWithEmailAndPassword(this.auth, email, password)
      loading.dismiss()
  }

  async loginWithGoogle(){
    const loading = await this.loading.create({
      message: 'Iniciando sesión...'
    })
    await loading.present()
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  async logout() {
    return await signOut(this.auth);
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
