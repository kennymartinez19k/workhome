import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  productDetail: any = {}
  showSuccessMsg = false

  constructor(private cdRef: ChangeDetectorRef, private route: ActivatedRoute,
    private productService: ProductService, private cart: ShoppingCartService) {}

  ngOnInit(){
    this.cdRef.detectChanges()

    const productId = this.route.snapshot.paramMap.get('uid')
    if(productId !== null) {
      this.productService.getProductById(productId).then((product) =>{
        if(product) {
          this.productDetail = product
          console.log(this.productDetail)
        }
      })
    }
  }

  addProductCart(product: any): void {
    this.cart.addProductCart(product)
  
    this.showSuccessMsg = true;
  
    setTimeout(() => {
      this.showSuccessMsg = false;
    }, 1000);
  }

}
