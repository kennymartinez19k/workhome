import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentData, where, getDocs, doc, updateDoc, query, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {


  constructor(private firestore: Firestore, private authService: AuthService) {}

async addProductCart(product: any): Promise<void> {
  console.log(product)
  const uid = await this.authService.getUserUid()
  try {
    const cartRef = collection(this.firestore, 'carrito');
    const q = query(cartRef, where('uid', '==', uid), where('product.productId', '==', product.productId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      // El producto ya existe en el carrito, actualiza la cantidad
      const existingCartItem = querySnapshot.docs[0];
      const existingQty = existingCartItem.data()['qty'] || 0;
      const newQty = existingQty + product.qty;

      await updateDoc(existingCartItem.ref, { qty: newQty });
      console.log('Producto existente en el carrito, cantidad actualizada:', newQty);
    } else {
      // El producto no existe en el carrito, agrégalo
      const newCartItem: any = {
        uid: uid,
        product: product,
        qty: product.qty,
        orderId: ''
      };

      const orderRef = await addDoc(cartRef, newCartItem);
      const orderId = orderRef.id;
      await updateDoc(orderRef, { orderId: orderId });
      console.log('Producto añadido al carrito con ID:', orderId);
      let products = this.getCartItems(uid)
      localStorage.setItem("cartItems", JSON.stringify(products))
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito', error);
  }
}


async getCartItems(uid: any): Promise<any[]> {
  try {
    const q = query(collection(this.firestore, 'carrito'), where('uid', '==', uid))
    const querySnap = await getDocs(q)
    const cartItems: any[] = []

    querySnap.forEach((doc) => {
      const cartItem = doc.data() as DocumentData
      cartItems.push(cartItem)
    })

    return cartItems
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    return []
  }
}

async updateCartItemQty(cartItemId: any, newQty: number): Promise<void> {
  try {
    const cartItemRef = doc(this.firestore, 'carrito', cartItemId)
    await updateDoc(cartItemRef, {qty: newQty})
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
  }
}

async reduceStock(productId: any, newStock: number): Promise<void> {
  try {
    const productRef = doc(this.firestore, 'productos', productId)
    await updateDoc(productRef, {stock: newStock})
    console.log('STOCK REDUCIDO A: ', newStock)
  } catch (error) {
    
  }
}

async deleteCartItem(cartItemId: string): Promise<void> {
  const cartItemRef = doc(this.firestore, 'carrito', cartItemId);

  try {
    await deleteDoc(cartItemRef);
    console.log('Elemento del carrito eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar el elemento del carrito:', error);
  }
}

}
