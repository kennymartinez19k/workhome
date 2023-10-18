import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, deleteDoc,
updateDoc, getDocs, getDoc, doc } from '@angular/fire/firestore';
import { Product } from '../interfaces/product';
import { Observable, map, from } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private firestore: Firestore) {}

  async sentOrderToFirestore(userId: any, carritoItems: any[], location: any): Promise <void> {
    try {
      const ordersRef = collection(this.firestore, 'pedidos')
      const newOrder = {
        userId: userId,
        items: carritoItems,
        fecha: new Date().toLocaleDateString(),
        ubicacion: location,
        status_enviado: 'no',
        id: ''
      }
      const orderRef = await addDoc(ordersRef, newOrder)
      const orderId = orderRef.id
      await updateDoc(orderRef, {id: orderId})

      //eliminar productos del carrito del usuario despues de ser enviados
      const cartRef = collection(this.firestore, 'carrito')
      const q =  query(cartRef, where('userId', '==', userId))
      const querySnap = await getDocs(q)

      querySnap.forEach(async (doc) => {
        await deleteDoc(doc.ref)
        console.log('Pedido enviado con éxito. ID del pedido:', orderId);
      })


    } catch (error) {
      console.log('Error al enviar el pedido:', error);
    }

  }
  

  async sentOrder(orderId: any): Promise<void> {
    const orderRef = doc(this.firestore, 'pedidos', orderId)
    try {
      await updateDoc(orderRef, {status_enviado: 'yes'})
      console.log('status actualizado con exito')
    } catch (error) {
      console.error(error)
    }
  }
  
  getOrder(): Observable<Product[]> {
    const q = query(
      collection(this.firestore, 'pedidos'),
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

}
