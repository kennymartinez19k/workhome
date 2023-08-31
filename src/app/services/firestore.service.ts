import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, setDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  async savePerson(uid: string, nombre: string, email: string) {
    const userRef = doc(this.firestore, 'personas', uid)
    await setDoc(userRef, {nombre, email, uid})
  }

  getPerson(uid: string) {
    const userDocRef = doc(this.firestore, 'personas', uid)
    return docData(userDocRef)
  }

}
