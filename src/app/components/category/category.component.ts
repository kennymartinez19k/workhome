import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  products: any[] = []
  category: string | null = null
  constructor(private firestore: Firestore, private activatedRoute: ActivatedRoute) {}

ngOnInit() {
  this.activatedRoute.paramMap.subscribe(params => {
    this.category = params.get('nombre')
    this.loadProducts()
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
}
