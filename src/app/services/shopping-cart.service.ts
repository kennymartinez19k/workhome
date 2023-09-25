import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private cart: any[] = []
  private cartTotalPriceSubject = new BehaviorSubject<number>(0)
  cartTotalPrice$: Observable<number> = this.cartTotalPriceSubject.asObservable()

  constructor(private storage: StorageService) { 
    this.initCart()
   }

  async initCart() {
    const cart = await this.storage.get('cart')
    if(cart) {
      this.cart = cart
    }
    this.recalculateCartTotal()
  }

  async addToCart(product: any) {
    this.cart.push(product)
    await this.storage.set('cart', this.cart)
    this.recalculateCartTotal()
  }

  async removeFromCart(product: any) {
    this.cart = this.cart.filter(item => item.uid !== product.uid)
    await this.storage.set('cart', this.cart)
    this.recalculateCartTotal()
  }

  async getCart() {
    this.cart = await this.storage.get('cart') || []
    return this.cart
  }

  async updateCart(product: any) {
    const index = this.cart.findIndex(item => item.id === product.id)
    if(index !== -1) {
      this.cart[index].qty = product.qty
      await this.storage.set('cart', this.cart)
      this.recalculateCartTotal()
    }
  }

  private recalculateCartTotal() {
    let total = 0
    for (const product of this.cart) {
      total += product.precio * product.qty
    }
    this.cartTotalPriceSubject.next(total)
  }
}
