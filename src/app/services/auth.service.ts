import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: FirestoreService) { }

  async register(email: string, password: string, nombre: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password)
      const uid = result.user.uid
      
      await this.firestore.savePerson(uid, nombre, email)
    } catch (error) {
      console.log("error de registro", error)
    }
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password)
    } catch (error) {
      console.log("error de logueo", error)
    }
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

}
