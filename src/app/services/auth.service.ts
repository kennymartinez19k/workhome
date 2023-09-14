import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  async register({email, password}: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login({email, password}: any) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (error) {
      console.log("error de logueo", error)
    }
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  async logout() {
    return await signOut(this.auth);
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

}
