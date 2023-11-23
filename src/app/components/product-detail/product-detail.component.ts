import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Subscription, filter } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  productDetail: any = {}
  showSuccessMsg = false
  cartItems: any = []
  subscription!: Subscription


  constructor(private cdRef: ChangeDetectorRef, private route: ActivatedRoute,
    private productService: ProductService, private cart: ShoppingCartService,
    private auth: AuthService, private loading: LoadingController, private router: Router,
    private modalCtrl: ModalController) {}

  async ngOnInit(){

    let userId = await this.auth.getUserUid()
    this.cartItems = await this.cart.getCartItems(userId)
    this.cdRef.detectChanges()

    const productId = this.route.snapshot.paramMap.get('productId')
    if(productId !== null) {
      this.productService.getProductById(productId).then((product) =>{
        if(product) {
          this.productDetail = product
          console.log(this.productDetail)
        }
      })
    }
    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(async () => {
      this.cartItems = await this.cart.getCartItems(userId)
    })
  }

configSwiper: SwiperOptions = {
  slidesPerView: 1.5,
  spaceBetween: 20,
  centeredSlides: true
}

async openImgModal(imageUrl: string) {
  const modalCtrl = await this.modalCtrl.create({
    component: ImageModalComponent,
    componentProps: {
      imageUrl: imageUrl
    },
    cssClass: 'transparent-modal'
  })
  await modalCtrl.present()
}

  async addToCart(product: any) {
    let userId = await this.auth.getUserUid()
    console.log(product.qty)
    let pd = { ...product }

    const loading = await this.loading.create({
      message: 'Añadiendo al carrito...'
    })

      await loading.present()
      await this.cart.addProductCart(pd)
      product.qty = 0
      this.cartItems = await this.cart.getCartItems(userId)

    await loading.dismiss()

  }

  async removeToCart(product) {
    if (product.qty > 0) {
      product.qty--
    }
  }
  
  addQty(product) {
    if (product.qty < product.stock) {
      product.qty++
    }
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
  }

}
