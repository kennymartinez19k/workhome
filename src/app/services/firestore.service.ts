import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs'
import { Product } from '../interfaces/product';
import { Firestore, collectionData, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  

  constructor(private firestore: Firestore, private storage: Storage) {}

  async agregarProducto(producto: Product) {
    const productRef = collection(this.firestore, 'productos');
    return addDoc(productRef, producto);
  }

  //FILTRANDO PRODUCTOS POR CATEGORÍA

  obtenerProducto(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, 'productos'),
      where('categoryId', '==', 'banana')
    );
  
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const productos: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          productos.push(data);
        });
        return productos;
      })
    );
  }

  //DESCOMENTAR. TRAER TODOS LOS PRODUCTOS

  // obtenerProducto(): Observable<Product[]> {
  //   const q = query(collection(this.firestore, 'productos'));

  //   return from(getDocs(q)).pipe(
  //     map((querySnapshot) => {
  //       const productos: Product[] = [];
  //       querySnapshot.forEach((doc) => {
  //         const data = doc.data() as Product;
  //         productos.push(data);
  //       });
  //       return productos;
  //     })
  //   );
  // }
}