import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail
} from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isWeb = false
  firebase: any
  constructor(private auth: Auth) {
    this.firebase = initializeApp(environment.firebase)
  }

  async register({ email, password }: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login({ email, password }: any) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }


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

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async getUserUid() {
    const user = await this.auth.currentUser
    if (user) {
      return user.uid
    } else {
      return null
    }
  }


}
