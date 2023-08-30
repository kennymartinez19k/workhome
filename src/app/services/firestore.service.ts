import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { Registro } from '../interfaces/registro';
import { Observable } from 'rxjs'
import { AuthService } from './auth.service';
import { getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addUser(nombre: string, email: string): Promise<void>{
    const usuario = await this.authService.getUid()
    if(usuario) {
      const userRef = collection(this.firestore, 'Usuarios')
      const usuarioData = {
        uid: usuario,
        nombre, email
      }
      await addDoc(userRef, usuarioData)
    }
  }

  async getUsers(): Promise<any[]>{
    const usersCollection = collection(this.firestore, 'Usuarios')
    const querySnap = await getDocs(usersCollection)
    const usuarios = querySnap.docs.map(doc => doc.data())
    return usuarios
  
  }

}
