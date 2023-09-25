import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Geolocation } from '@capacitor/geolocation';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  latitude: any = ""
  longitude: any = ""
  showMap = false
  mapURL: SafeResourceUrl | undefined
  cartItems: any[] = []
  totalCartPrice: number = 0
  deliveryFree = false

  constructor(private sanitizer: DomSanitizer, private cartService: ShoppingCartService,
    private firestoreService: FirestoreService){}

  ngOnInit(): void {
    this.loadCartItems()
    this.cartService.cartTotalPrice$.subscribe((totalPrice) => {
      this.totalCartPrice = totalPrice
    })
  }


  addProduct(product: any){
    if(product.qty < product.stock ){
      product.qty++
      this.updateCart(product)
    }
  }

  removeProduct(product: any){
    if(product.qty > 0){
      product.qty--
      this.updateCart(product)
    }
  }
  
  async getLocation(){

    try{

      const coordinates = await Geolocation.getCurrentPosition();
      const locCordinates = coordinates.coords;
      this.latitude = locCordinates.latitude
      this.longitude = locCordinates.longitude

      const url = `https://www.google.com/maps/embed/v1/place?q=${this.latitude},${this.longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`

      this.mapURL = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      this.showMap = true

    }catch(error){
      console.log(error)
    }
  }

  loadCartItems () {
    this.cartService.getCart().then((cart) => {
      this.cartItems = cart
      this.calculateTotalPrice()
    })
  }

  calculateTotalPrice() {
    this.totalCartPrice = this.cartItems.reduce((total, product) => total + product.precio * product.qty, 0)
    if(this.totalCartPrice >= 1000) {
      this.deliveryFree = true
    }
  }

  private updateCart(product: any) {
    this.cartService.updateCart(product)
  }

   deleteFromCart(product: any) {
    this.cartService.removeFromCart(product).then(() => {
      this.loadCartItems()
    })
  }

  saveOrder(){
    this.firestoreService.sendOrderToFirestore().then(() =>{
      console.log('pedido enviado con exito')
    }).catch((error)=>{console.log(error)})
  }

}
