import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-products-searched',
  templateUrl: './products-searched.component.html',
  styleUrls: ['./products-searched.component.scss']
})
export class ProductsSearchedComponent implements OnInit {
  products: any[] = []
  user: any = {}
  showSuccessMsg = false
  subscription!: Subscription
  cartItems: any = []


  constructor(private productService: ProductService, private storage: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef,
    private router: Router, private alert: AlertController, private auth: AuthService,
    private loading: LoadingController) { }

  async ngOnInit() {
    this.cdRef.detectChanges()

    this.productService.getSearchResults().subscribe(results => {
      this.products = results
      console.log(this.products)
    })
    this.user = await this.storage.get('usuario')

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(async () => {
      this.user = await this.storage.get("usuario")
      let userId = await this.auth.getUserUid()
      this.cartItems = await this.cartService.getCartItems(userId)
    })
  }

  async addToCart(product: any) {
    let userId = await this.auth.getUserUid()
    console.log(product.qty)
    let pd = { ...product }

    const loading = await this.loading.create({
      message: 'Añadiendo al carrito...'
    })

    const userExists = await this.storage.get('usuario')
    if (userExists) {
      await loading.present()
      await this.cartService.addProductCart(pd)
      product.qty = 0
      this.cartItems = await this.cartService.getCartItems(userId)
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

    await loading.dismiss()

  }


  editProduct(product: Product) {
    if (product.productId) {
      this.router.navigate(['/edit-product', product.productId])
    } else {
    }
  }

  deleteProduct(productId: string): void {
    console.log(productId)
    this.productService.deleteProduct(productId).then(() => {
      this.products = this.products.filter(product => product.productId !== productId)
      this.cdRef.detectChanges();
    })
      .catch(error => {
        console.log("error eliminar producto", error)
      })
  }

  async confirmDeleteProduct(productId: string) {
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
          this.deleteProduct(productId)
        }
      }]
    })
    await alert.present()
  }

  async removeToCart(product) {
    if (product.qty > 0) {
      product.qty--
    }
  }

  goToProductDetail(product: any) {
    this.router.navigate(['product-detail', product.productId])
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
