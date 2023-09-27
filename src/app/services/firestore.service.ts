import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Firestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  constructor(private firestore: Firestore,  private auth: AuthService,
     private cartService: ShoppingCartService, private loading: LoadingController) {}


  async sendOrderToFirestore(ubicacion: any) {
    const orderData = await this.cartService.getCart();

    if (orderData.length > 0) {
      const orderToSend = {
        orderData: orderData,
        status_enviado: 'no',
        fecha: this.getFormattedDate(),
        ubicacion: ubicacion,
        id: '',
        userId: this.auth.getCurrentUser()?.uid
      };

      const carritoRef = collection(this.firestore, 'carrito');
     
      try {
        const orderRef = await addDoc(carritoRef, orderToSend)
        const orderId = orderRef.id
        await updateDoc(orderRef, {id: orderId})
        console.log('Documento agregado con ID:', orderId);
      } catch (error) {
        console.error('Error al agregar el documento:', error);
      }

    } else {
      console.log('El carrito está vacío.');
    }
  }

  async orderSent(orderId: string): Promise<void> {
    const orderRef = doc(this.firestore, 'carrito', orderId)

    try {
      await updateDoc(orderRef, {status_enviado: 'yes'})
      console.log('status actualizado con exito')
    } catch (error) {
      console.error(error)
    }
  }

  getFormattedDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const yyyy = today.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  }

  async addUser({username, email, role}: any): Promise<void> {
    const user = await this.auth.getUserUid()
    if(user) {
      const userRef = collection(this.firestore, 'usuarios')
      const userData = {
        uid: user,
        username, email,
        role: 'usuario'
      }
      await addDoc(userRef, userData)
    }
  }

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

  getOrder(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, 'carrito'),
      where('status_enviado', '==', 'no')
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