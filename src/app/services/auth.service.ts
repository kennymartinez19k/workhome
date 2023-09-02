import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: FirestoreService) { }

  async register({email, password}: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (error) {
      console.log("error de logueo", error)
    }
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

}
