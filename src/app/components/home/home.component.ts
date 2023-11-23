import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PromotionService } from 'src/app/services/promotion.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  promotion: any[] = []
  user: any = {}
  searchTerm: string = ''
  searchProduct: any[] = []
  cartItems: any = []
  subscription!: Subscription;

  constructor(private router: Router, private productService: ProductService,
    private alert: AlertController, private storageService: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef,
    private auth: AuthService, private loading: LoadingController,
    private promotionService: PromotionService, private modal: ModalController) {}


  async ngOnInit() {

    this.cdRef.detectChanges()

    this.promotionService.refresh$.subscribe(() => {
      this.refreshPromotion()
    })

    this.promotionService.getPromotion().subscribe(promotion => {
      this.promotion = promotion
    })

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(async () => {
      this.user = await this.storageService.get("usuario")
      let userId = await this.auth.getUserUid()
      this.cartItems = await this.cartService.getCartItems(userId)
    })
  }

  refreshPromotion() {
    this.promotionService.getPromotion().subscribe(promotion => {
      this.promotion = promotion
    })
  }


  deletePromotion(promotionId: string): void {
    console.log(promotionId)
    this.promotionService.deletePromotion(promotionId).then(() => {
      this.promotion = this.promotion.filter(promotion => promotion.promotionId !== promotionId)
      this.cdRef.detectChanges();
    })
      .catch(error => {
        console.log("error eliminar producto", error)
      })
  }

  async confirmDeletePromotion(promotionId: string) {
    const alert = await this.alert.create({
      header: 'Eliminar promoción',
      message: '¿Está seguro de eliminar la promoción?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => { alert.dismiss() }
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.deletePromotion(promotionId)
        }
      }]
    })
    await alert.present()
  }

  async searchProducts() {
    this.productService.searchProducts(this.searchTerm)
    this.router.navigate(['/search-results'])
  }


  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
  }


}

