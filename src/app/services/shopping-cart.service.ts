import { Injectable } from '@angular/core';
// import { StorageService } from './storage.service';
// import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collection, addDoc, DocumentData, where, getDocs, doc, updateDoc, query, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { isEmpty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  // private cart: any[] = []
  // private cartTotalPriceSubject = new BehaviorSubject<number>(0)
  // cartTotalPrice$: Observable<number> = this.cartTotalPriceSubject.asObservable()

  constructor(private firestore: Firestore, private authService: AuthService,
    private storage: StorageService) { 
    // this.initCart()
}

// async addProductCart(product: any): Promise<void> {
//   const userId = await this.authService.getUserUid()
//   try {
//     const cartRef = collection(this.firestore, 'carrito')
//     const newCartItem: any = {
//       userId: userId,
//       product: product,
//       qty: 1,
//       status_enviado: 'no',
//       orderId: ''
//     }

//     const orderRef = await addDoc(cartRef, newCartItem)
//     const orderId = orderRef.id
//     if(newCartItem.product.uid) {
//       newCartItem.qty++
//       console.log('ya existe, le sumamos una qty')
//       await updateDoc(orderRef, {orderId: orderId})
//     }else {
//     await updateDoc(orderRef, {orderId: orderId})
//     console.log('añadido con id: ', orderId)
//     }
    
//   } catch (error) {
//    console.log('error al agregar producto al carrito', error) 
//   }
// }

async addProductCart(product: any): Promise<void> {
  const userId = await this.authService.getUserUid()
  try {
    const cartRef = collection(this.firestore, 'carrito');
    const q = query(cartRef, where('userId', '==', userId), where('product.uid', '==', product.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      // El producto ya existe en el carrito, actualiza la cantidad
      const existingCartItem = querySnapshot.docs[0];
      const existingQty = existingCartItem.data()['qty'] || 0;
      const newQty = existingQty + 1;

      await updateDoc(existingCartItem.ref, { qty: newQty });
      console.log('Producto existente en el carrito, cantidad actualizada:', newQty);
    } else {
      // El producto no existe en el carrito, agrégalo
      const newCartItem: any = {
        userId: userId,
        product: product,
        qty: 1,
        orderId: ''
      };

      const orderRef = await addDoc(cartRef, newCartItem);
      const orderId = orderRef.id;
      await updateDoc(orderRef, { orderId: orderId });
      console.log('Producto añadido al carrito con ID:', orderId);
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito', error);
  }
}


async getCartItems(userId: any): Promise<any[]> {
  try {
    const q = query(collection(this.firestore, 'carrito'), where('userId', '==', userId))
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

async deleteCartItem(cartItemId: string): Promise<void> {
  const cartItemRef = doc(this.firestore, 'carrito', cartItemId);

  try {
    await deleteDoc(cartItemRef);
    console.log('Elemento del carrito eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar el elemento del carrito:', error);
  }
}



  // async initCart() {
  //   const cart = await this.storage.get('cart')
  //   if(cart) {
  //     this.cart = cart
  //   }
  //   this.recalculateCartTotal()
  // }

  // async addToCart(product: any) {
  //   this.cart.push(product)
  //   await this.storage.set('cart', this.cart)
  //   this.recalculateCartTotal()
  // }

  // async removeFromCart(product: any) {
  //   this.cart = this.cart.filter(item => item.uid !== product.uid)
  //   await this.storage.set('cart', this.cart)
  //   this.recalculateCartTotal()
  // }

  // async getCart() {
  //   this.cart = await this.storage.get('cart') || []
  //   return this.cart
  // }

  // async updateCart(product: any) {
  //   const index = this.cart.findIndex(item => item.id === product.id)
  //   if(index !== -1) {
  //     this.cart[index].qty = product.qty
  //     await this.storage.set('cart', this.cart)
  //     this.recalculateCartTotal()
  //   }
  // }

  // private recalculateCartTotal() {
  //   let total = 0
  //   for (const product of this.cart) {
  //     total += product.precio * product.qty
  //   }
  //   this.cartTotalPriceSubject.next(total)
  // }
}
