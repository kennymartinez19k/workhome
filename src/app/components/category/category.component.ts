import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { Subscription, filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: any[] = []
  category: string | null = null
  user: any = {}
  showSuccessMsg = false
  subscription!: Subscription
  cartItems: any = []


  constructor(private firestore: Firestore, private activatedRoute: ActivatedRoute,
    private storage: StorageService, private cartService: ShoppingCartService,
    private cdRef: ChangeDetectorRef, private router: Router, private alert: AlertController,
    private productService: ProductService, private auth: AuthService,
    private loading: LoadingController) { }

  async ngOnInit() {
    this.user = await this.storage.get('usuario')
    let uid = await this.auth.getUserUid()
    this.cdRef.detectChanges()

    this.activatedRoute.paramMap.subscribe(params => {
      this.category = params.get('nombre')
      this.loadProducts()
    })

    this.cartItems = await this.cartService.getCartItems(uid)

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(async () => {
      this.cartItems = await this.cartService.getCartItems(uid)
    })

  }

  async loadProducts() {
    const productRef = collection(this.firestore, 'productos')
    const q = query(productRef, where('categoryId', '==', this.category))

    try {
      const querySnap = await getDocs(q)
      this.products = querySnap.docs.map(doc => doc.data())
      console.log('productos: ', this.products)
    } catch (error) {
      console.log('error al cargar el producto', error)
    }
  }


  editProduct(product: Product) {
    if (product.productId) {
      this.router.navigate(['/edit-product', product.productId])
    } else {
    }
  }

  deleteProduct(productId: string, imageName: string): void {
    console.log(productId)
    this.productService.deleteProduct(productId, imageName).then(() => {
      this.products = this.products.filter(product => product.productId !== productId)
      this.cdRef.detectChanges();
    })
      .catch(error => {
        console.log("error eliminar producto", error)
      })
  }

  async confirmDeleteProduct(productId: string, imageName: string) {
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
          this.deleteProduct(productId, imageName)
        }
      }]
    })
    await alert.present()
  }

  async addToCart(product: any) {
    let uid = await this.auth.getUserUid()
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
      this.showSuccessMsg = true
      this.cartItems = await this.cartService.getCartItems(uid)
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
