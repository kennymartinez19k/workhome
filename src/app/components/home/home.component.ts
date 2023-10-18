import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { SwiperOptions } from 'swiper';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

products: any[] = []
user: any = {}
showSuccessMsg = false
searchTerm: string = ''
searchProduct: any[] = []

  constructor(private router: Router, private productService: ProductService, 
    private alert: AlertController, private storageService: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef){
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
    
   this.user = await this.storageService.get("usuario")
   console.log(this.user)
  }

  editProduct(product: Product) {
    if(product.productId) {
      this.router.navigate(['/edit-product', product.productId])
    } else {
      alert("el uid es null o undefined")
    }
  }

  deleteProduct(uid: string): void {
    this.productService.deleteProduct(uid).then( () => {
      this.products = this.products.filter(product => product.uid !== uid)
      this.cdRef.detectChanges();
    })
    .catch(error => {
      console.log("error eliminar producto", error)
    })
  }

  async confirmDelete(uid: string) {
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
        this.deleteProduct(uid)}
    }]
    })
    await alert.present()
  }

 addToCart(product: any): void {
  this.cartService.addProductCart(product)
  this.showSuccessMsg = true

  setTimeout(() => {
    this.showSuccessMsg = false
  }, 1000)
 }

 async searchProducts() {
  this.productService.searchProducts(this.searchTerm)
  this.router.navigate(['/search-results'])
 }

 goToProductDetail(product: any) {
  this.router.navigate(['product-detail', product.productId])
 }
 
}

