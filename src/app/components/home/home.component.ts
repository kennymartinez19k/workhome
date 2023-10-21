import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { SwiperOptions } from 'swiper';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

products: any[] = []
user: any = {}
showSuccessMsg = false
searchTerm: string = ''
searchProduct: any[] = []
cartItems: any = []
subscription
  constructor(private router: Router, private productService: ProductService, 
    private alert: AlertController, private storageService: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef,
    private auth: AuthService, private loading: LoadingController){
    this.products = [{
      nombre: "",
      precio: 0,
      stock: 0,
      img: ""
    }]
  }

  config: SwiperOptions = {
    slidesPerView: 2,
    scrollbar: { draggable: true },
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    },
    
    loop:true
  };

   async ngOnInit() {
    this.cdRef.detectChanges()

    this.productService.getProduct().subscribe(products => {
      this.products = products
    })

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
      ).subscribe(async () => {
        this.user = await this.storageService.get("usuario")
        let userId = await this.auth.getUserUid()
        this.cartItems = await this.cartService.getCartItems(userId)
      })
  }

  editProduct(product: Product) {
    if(product.productId) {
      this.router.navigate(['/edit-product', product.productId])
    } else {
    }
  }

  deleteProduct(productId: string): void {
    console.log(productId)
    this.productService.deleteProduct(productId).then( () => {
      this.products = this.products.filter(product => product.productId !== productId)
      this.cdRef.detectChanges();
    })
    .catch(error => {
      console.log("error eliminar producto", error)
    })
  }

  async confirmDelete(productId: string) {
    const alert = await this.alert.create({
      header: 'Eliminar el producto',
      message: '¿Está seguro de eliminar el producto?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {alert.dismiss()}
      },
    {
      text: 'Eliminar',
      handler: () => {
        this.deleteProduct(productId)}
    }]
    })
    await alert.present()
  }

 async addToCart(product: any) {
  let userId = await this.auth.getUserUid()
  console.log(product.qty)
  let pd = {...product}

  const loading = await this.loading.create({
    message: 'Añadiendo al carrito...'
  })

  if(userId) {
    await loading.present()
    await this.cartService.addProductCart(pd)
    product.qty = 0
    this.showSuccessMsg = true
    this.cartItems = await this.cartService.getCartItems(userId)
  } else {
    const alert = await this.alert.create({
      header: 'Debe iniciar sesión para poder comprar',
      message: 'Pulse Ok para ser redirigido al inicio de sesión',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {alert.dismiss()}
      },
    {
      text: 'Ok',
      handler: () => {
        this.router.navigate(['login'])}
    }]
    })
    await alert.present()
  }

  await loading.dismiss()
  
 }

 async removeToCard(product){
  if(product.qty > 0){
    product.qty--
  }  
 }

 async searchProducts() {
  this.productService.searchProducts(this.searchTerm)
  this.router.navigate(['/search-results'])
 }

 goToProductDetail(product: any) {
  this.router.navigate(['product-detail', product.productId])
 }

 addQty(product){
   if(product.qty < product.stock){
     product.qty++
  }
 }

 ngOnDestroy() {
    this.subscription ? this.subscription.unsubscribe() : null;
     
 }
 
}

