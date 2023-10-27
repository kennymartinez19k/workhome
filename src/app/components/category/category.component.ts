import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ChangeDetectorRef } from '@angular/core';

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
  constructor(private firestore: Firestore, private activatedRoute: ActivatedRoute,
    private storage: StorageService, private cartService: ShoppingCartService,
    private cdRef: ChangeDetectorRef) {}

async ngOnInit() {
  this.cdRef.detectChanges()

  this.activatedRoute.paramMap.subscribe(params => {
    this.category = params.get('nombre')
    this.loadProducts()
  })
  this.user = await this.storage.get('usuario')

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

addToCart(product: any): void {

  this.cartService.addProductCart(product)
  this.showSuccessMsg = true
  console.log('añadido')
  
  setTimeout(() => {
    this.showSuccessMsg = false
  }, 1000)

}

}
