import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  constructor(private firestore: Firestore,  private auth: AuthService, private cartService: ShoppingCartService) {}


  async sendOrderToFirestore() {
    const orderData = await this.cartService.getCart()
    if(orderData.length > 0) {
      const adminUserQuery = query(collection(this.firestore, 'usuarios'), where('role', '==', 'admin'))
      const adminUserSnap = await getDocs(adminUserQuery)

      if(!adminUserSnap.empty) {
        const adminUser = adminUserSnap.docs[0].data() as {uid: string}

        const orderToSend = {
          orderData: orderData,
          status_enviado: 'no'
        }
        const adminUserRef = collection(this.firestore, 'usuarios', adminUser['uid'], 'carritos')
        await addDoc(adminUserRef, orderToSend)

      }else {
        console.log('no se encontro admin')
      }
    }else {
      console.log('el carrito esta vacio')
    }
  }

  async addUser(user: User) {
    const userRef = collection(this.firestore, 'usuarios')
    return addDoc(userRef, user)
  }

  async addProduct(product: Product) {
    const productRef = collection(this.firestore, 'productos');
    const docRef = await addDoc(productRef, product)
    return docRef.id
  }

  //FILTRANDO PRODUCTOS POR CATEGORÍA

  // obtenerProducto(): Observable<Product[]> {
  //   const q = query(
  //     collection(this.firestore, 'productos'),
  //     where('categoryId', '==', 'Alimentos Frescos')
  //   );
  
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

  //DESCOMENTAR. TRAER TODOS LOS PRODUCTOS

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


  getUser(): Observable<User[]> {
    const q = query(
      collection(this.firestore, 'usuarios'),
      where('uid', '==', this.auth.getCurrentUser()?.uid)
    );
  
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const usuario: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as User;
          usuario.push(data);
        });
        return usuario;
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

}