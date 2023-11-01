import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-searched',
  templateUrl: './products-searched.component.html',
  styleUrls: ['./products-searched.component.scss']
})
export class ProductsSearchedComponent implements OnInit {
  products: any[] = []
  user: any = {}
  showSuccessMsg = false


  constructor(private productService: ProductService, private storage: StorageService,
    private cartService: ShoppingCartService, private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    this.cdRef.detectChanges()
    
    this.productService.getSearchResults().subscribe(results => {
      this.products = results
      console.log(this.products)
    })
    this.user = await this.storage.get('usuario')
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
