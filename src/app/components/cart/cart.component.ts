import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Geolocation } from '@capacitor/geolocation';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Product } from 'src/app/interfaces/product';
import { Observable, from, map } from 'rxjs';

Observable
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
  products: Product[] = []


  constructor(private sanitizer: DomSanitizer, private cartService: ShoppingCartService,
    private firestoreService: FirestoreService, private alert: AlertController,
    private storage: StorageService, private firestore: Firestore, private auth: Auth){}

  async ngOnInit() {
    // this.loadCartItems()
    // this.cartService.cartTotalPrice$.subscribe((totalPrice) => {
    //   this.totalCartPrice = totalPrice
    // })
    this.getCartItems().subscribe(products => {
      this.products = products
      console.log(products)
    })
  }

  getCartItems(): Observable<Product[]> {
    const userId = this.auth.currentUser?.uid
    const q = query(collection(this.firestore, 'carrito'), where('userId', "==", userId));
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
      console.log(this.latitude, this.longitude)
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

  async saveOrder(){
    const userExits = await this.storage.get('usuario')
    if(userExits) {
      this.firestoreService.sendOrderToFirestore(`https://www.google.com/maps/dir/${this.latitude},${this.longitude}/`).then(() =>{
      console.log('pedido enviado con exito')
    }).catch((error)=>{console.log(error)})
    }else {
      const alert = await this.alert.create({
        header: 'Inicie sesión',
        message: 'Por favor, inicie sesión para realizar el pedido',
        buttons: ['Aceptar']
      })
      await alert.present()
    }
  }

}
