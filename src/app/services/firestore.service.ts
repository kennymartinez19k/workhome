import { Injectable } from '@angular/core';
import { Firestore,collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Registro } from '../interfaces/registro';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  addUser(user: Registro){
    const userRef = collection(this.firestore, 'Usuarios');
    return addDoc(userRef, user)
  }
}
