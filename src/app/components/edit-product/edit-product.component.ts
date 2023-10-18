import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product: Product | undefined
  formEdit: FormGroup
  
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService,
    private router: Router, private cdRef: ChangeDetectorRef) {
    this.formEdit = new FormGroup({
      nombre: new FormControl(''),
      precio: new FormControl(0),
      stock: new FormControl(0),
      categoryId: new FormControl(''),
    });
  }


  ngOnInit(): void {
    this.cdRef.detectChanges()
    const productId = this.activatedRoute.snapshot.paramMap.get('productId')
    if(productId !== null) {
      this.productService.getProductById(productId).then((product) =>{
        if(product) {
          this.product = product
          this.formEdit.patchValue(product)
        }
      })
    }
  }

  editProduct() {
    if(this.product && this.product.productId) {
      const productUpt: Product = {
        ...this.product,
        ...this.formEdit.value
      }
      this.productService.updateProduct(this.product.productId, productUpt).then( ()=>{
        this.router.navigate(['home']).then(()=>{location.reload()})
      })
    }
  }
}
