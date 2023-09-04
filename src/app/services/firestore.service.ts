import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs'
import { Product } from '../interfaces/product';
import { Firestore, collectionData, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  agregarProducto(producto: Product) {
    const productRef = collection(this.firestore, 'productos')
    return addDoc(productRef, producto)
  }

  obtenerProducto(): Observable<Product[]> {

    const q = query(collection(this.firestore, "productos"))

    return from(getDocs(q)).pipe(
      map((x) =>{
        const productos: Product[] = []
        x.forEach((doc) => {
          const data = doc.data() as Product
          productos.push(data)
        })
        return productos
      })
    )

    // const querySnapshot = await getDocs(q)
    // querySnapshot.forEach((doc) => {
    //   const productos = doc.data()
    //   console.log(productos)
    // })
  }
  
}
