import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OrdersService } from 'src/app/services/orders.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  uid: any
  totalPrice: number = 0
  latitude: any
  longitude: any
  location = false
  urlMap: SafeResourceUrl | undefined

  constructor(private cartService: ShoppingCartService, private auth: AuthService,
    private orderService: OrdersService, private alert: AlertController,
    private cdRef: ChangeDetectorRef, private sanitizer: DomSanitizer,
    private storage: StorageService, private router: Router,
    private loading: LoadingController) { }

  async ngOnInit() {
    this.uid = await this.auth.getUserUid()
    this.cartItems = await this.cartService.getCartItems(this.uid)
    console.log(this.cartItems)
    this.calculateTotalPrice()

  }

  incrementQty(cartItem: any): void {
    if (cartItem.product.stock > cartItem.qty) {
      cartItem.qty++;
      this.cartService.updateCartItemQty(cartItem.orderId, cartItem.qty).then(() => {
        console.log("incrementado a cantidad: ", cartItem.qty)
        this.calculateTotalPrice()
      })
    } else {
      console.log('NO HAY STOCK')
    }
  }

  decrementQty(cartItem: any): void {
    if (cartItem.qty > 1) {
      cartItem.qty--;
      this.cartService.updateCartItemQty(cartItem.orderId, cartItem.qty).then(() => {
        console.log("disminuido a cantidad: ", cartItem.qty)
        this.calculateTotalPrice()
      });
    }
  }


  async saveOrder() {

    const uid = await this.auth.getUserUid()
    const userExists = await this.storage.get('usuario')
  
      const loading = await this.loading.create({
        message: 'Realizando pedido...'
      })
  
      if (uid && userExists) {
        const msgWelcome = `🤝Saludos ${userExists.username}, 💫Bienvenido a Bodega La FE, En Breve estaremos atendiendo su Pedido.✨Gracias por Preferirnos!!!🙂`
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${this.latitude},${this.longitude}`
        const whatsapp = `https://api.whatsapp.com/send?phone=+1${userExists.tel}&text=${msgWelcome}`
        await loading.present()
        try {
          await this.orderService.sentOrderToFirestore(uid, this.cartItems, mapUrl,
            userExists.username, userExists.tel, whatsapp).then(async () => {
              await loading.dismiss()
              this.router.navigate(['/cart-success'])
            })
          for (const cartItem of this.cartItems) {
            const newStock = cartItem.product.stock - cartItem.qty
            await this.cartService.deleteCartItem(cartItem.orderId)
            await this.cartService.reduceStock(cartItem.product.productId, newStock)
          }
  
          this.cartItems = [];
          this.totalPrice = 0;
          console.log('Pedido enviado y carrito limpiado con éxito');
  
        } catch (error) {
          console.error('Error al enviar el pedido y limpiar el carrito', error);
        }
      } else {
        const alert = await this.alert.create({
          header: 'Debe iniciar sesión para poder comprar',
          message: 'Pulse Ok para ser redirigido al inicio de sesión',
          buttons: [{
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => { alert.dismiss() }
          },
          {
            text: 'Ok',
            handler: () => {
              this.router.navigate(['login'])
            }
          }]
        })
        await alert.present()
      }


   
  }


  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, cartItem) => {
      return total + cartItem.product.precio * cartItem.qty;

    }, 0);
  }

  async getLocation() {
    const loading = await this.loading.create({
      message: 'Obteniendo ubicación...'
    })
    loading.present()
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      })
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude
      console.log('latitud: ', this.latitude, 'longitud: ', this.longitude)
      const url = `https://www.google.com/maps/embed/v1/place?q=${this.latitude},${this.longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      this.location = true
    } catch (error) {
      loading.dismiss()
      const alert = await this.alert.create({
        header: 'Error al obtener ubicación',
        message: 'Verifique que su ubicación este encendida o que acepto los permisos requeridos.',
        buttons: ['OK']
      })
      alert.present()
      console.error('Error al obtener la ubicación:', error);
    }
    loading.dismiss()
  }

  async confirmDelete(orderId: string) {
    const alert = await this.alert.create({
      header: 'Eliminar el producto',
      message: '¿Está seguro de eliminar el producto?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => { alert.dismiss() }
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.deleteCartItem(orderId)
        }
      }]
    })
    await alert.present()
  }

  async deleteCartItem(cartItem: any): Promise<void> {
    console.log(cartItem)
    try {
      await this.cartService.deleteCartItem(cartItem.orderId);

      // Filtrar la lista de cartItems para quitar el elemento eliminado
      this.cartItems = this.cartItems.filter(item => item.orderId !== cartItem.orderId);

      this.calculateTotalPrice();
      console.log('Producto eliminado del carrito con éxito.');

      // Forzar un ciclo de detección de cambios
      this.cdRef.detectChanges()
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  }
}