import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { Product } from '../interfaces/product';
import { Firestore, collection, doc, setDoc, addDoc,collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  async savePerson(uid: string, nombre: string, email: string) {
    const userRef = doc(this.firestore, 'personas', uid)
    await setDoc(userRef, {nombre, email, uid})
  }

  addProduct(product: Product) {
    const productRef = collection(this.firestore, 'productos')
    return addDoc(productRef, product)
  }

  getProduct(): Observable<Product[]> {
    const productRef = collection(this.firestore, 'productos')
    return collectionData(productRef, {idField: 'id'}) as Observable<Product[]>
  }

}
