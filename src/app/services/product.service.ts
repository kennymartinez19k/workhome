import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { Product } from '../interfaces/product';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy, startAt, endAt } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private searchResults = new BehaviorSubject<any[]>([])
  searchTerm: string = ''


  constructor(private firestore: Firestore, private loading: LoadingController) {}


  async addProduct(product: Product) {
    const loading = await this.loading.create({
      message: 'Agregando producto...'
    })
    const productRef = collection(this.firestore, 'productos');
    await loading.present()
    const docRef = await addDoc(productRef, product)
    await loading.dismiss()
    return docRef.id
  }

  getProduct(): Observable<Product[]> {
    const q = query(collection(this.firestore, 'productos'));

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

  async getProductById(uid: string): Promise<Product | undefined> {
    const docRef = doc(this.firestore, 'productos', uid)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      return docSnap.data() as Product
    } else {
      return undefined
    }
  }

  async updateProduct(uid: string, product: Product): Promise <void> {
    const productRef = doc(this.firestore, 'productos', uid)
    return setDoc(productRef, product, {merge: true})
  }

  async deleteProduct(uid: string | undefined): Promise<void> {
    if(uid) {
      const productRef = doc(this.firestore, 'productos', uid)
      await deleteDoc(productRef)
    } else {
      console.log("UID de producto no valido")
    }
  }

   async searchProducts(searchTerm: any) {
    const productRef = collection(this.firestore, 'productos')
    const itemLower = searchTerm.toLowerCase()
    const q = query(
      productRef,
      where('nombre', '>=', itemLower),
      where('nombre', '<=', itemLower + '\uf8ff'),
      orderBy('nombre'),
      startAt(itemLower),
      endAt(itemLower + '\uf8ff')
    );
  
    try {
      const querySnap = await getDocs(q)
      const results = querySnap.docs.map(doc => doc.data())
      console.log(results)
      this.searchResults.next(results)
    } catch (error) {
      console.log('error al buscar producto ', error)
    }
   }

   getSearchResults() {
    return this.searchResults.asObservable()
   }

}