import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: any
  totalPrice: number = 0
  latitude: any
  longitude: any
  location = false

  constructor(private cartService: ShoppingCartService, private auth: AuthService,
    private firestoreService: FirestoreService) {}

  async ngOnInit() {
    this.userId = await this.auth.getUserUid()
    this.cartItems = await this.cartService.getCartItems(this.userId)
    console.log(this.cartItems)
    this.calculateTotalPrice()
  }

  incrementQty(cartItem: any): void {
    cartItem.qty++;
    this.cartService.updateCartItemQty(cartItem.orderId, cartItem.qty).then(()=>{
      console.log("incrementado a cantidad: ", cartItem.qty)
      this.calculateTotalPrice()
    })
  }

  decrementQty(cartItem: any): void {
    if (cartItem.qty > 1) {
      cartItem.qty--;
      this.cartService.updateCartItemQty(cartItem.orderId, cartItem.qty).then(()=> {
      console.log("disminuido a cantidad: ", cartItem.qty)
        this.calculateTotalPrice()
      });
    }
  }

  async saveOrder() {
    const userId = await this.auth.getUserUid()
    if(userId){
    const mapUrl = `https://www.google.com/maps/dir/${this.latitude},${this.longitude}/`
    try {
      await this.firestoreService.sentOrderToFirestore(userId, this.cartItems, mapUrl)

      for (const cartItem of this.cartItems) {
        await this.cartService.deleteCartItem(cartItem.orderId)
      }

      this.cartItems = [];
      this.totalPrice = 0;
      console.log('Pedido enviado y carrito limpiado con éxito');

    } catch (error) {
      console.error('Error al enviar el pedido y limpiar el carrito', error);
    }
    }else {
      alert('LOGUEATE')
    }
    
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, cartItem) => {
      return total + cartItem.product.precio * cartItem.qty;
    }, 0);
  }

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition()
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude
      console.log('latitud: ',this.latitude, 'longitud: ',this.longitude)
      this.location = true
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }
}