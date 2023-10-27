import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, Subject } from 'rxjs';
import { Product } from '../interfaces/product';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy, startAt, endAt } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private searchResults = new BehaviorSubject<any[]>([])
  searchTerm: string = ''
  private _refresh$ = new Subject<void>()


  constructor(private firestore: Firestore, private loading: LoadingController) {}

  get refresh$() {
    return this._refresh$
  }

  async addProduct(product: Product) {
    const loading = await this.loading.create({
      message: 'Agregando producto...'
    })
    const productRef = collection(this.firestore, 'productos');
    await loading.present()
    const docRef = await addDoc(productRef, product)
    await loading.dismiss()
    this._refresh$.next()
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

  async getProductById(productId: string): Promise<Product | undefined> {
    const docRef = doc(this.firestore, 'productos', productId)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      return docSnap.data() as Product
    } else {
      return undefined
    }
  }

  async updateProduct(productId: string, product: Product): Promise <void> {

    const loading = await this.loading.create({
      message: 'Actualizando producto...'
    })
    const productRef = doc(this.firestore, 'productos', productId)
    await loading.present()
    await loading.dismiss()
    this._refresh$.next()
    return setDoc(productRef, product, {merge: true})
  }

  async deleteProduct(productId: string | undefined): Promise<void> {
    if(productId) {
      const productRef = doc(this.firestore, 'productos', productId)
      await deleteDoc(productRef)
    } else {
      console.log('ERROR al eliminar SERVICIO')
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