import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs'
import { Product } from '../interfaces/product';
import { Firestore, collectionData, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
// import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
// import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  async agregarProducto(producto: Product) {
    // const storage = getStorage()
    // const storageRef = ref(storage, `${producto.nombre}_${Date.now()}.jpg`)
    // if (cameraPhoto.base64String) {
    //   const blob = this.base64ToBlob(cameraPhoto.base64String, 'image/jpeg')
    //   await uploadBytes(storageRef, blob)

    // }

    // const imagenUrl = await getDownloadURL(storageRef)

    // producto.imagenUrl = imagenUrl

    const productRef = collection(this.firestore, 'productos')
    return addDoc(productRef, producto)
  }

  private base64ToBlob(base64: string, type: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], {type})
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
