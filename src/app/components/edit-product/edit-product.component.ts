import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product: Product | undefined
  formEdit: FormGroup
  
  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
    private router: Router) {
    this.formEdit = new FormGroup({
      nombre: new FormControl(''),
      precio: new FormControl(0),
      stock: new FormControl(0),
      categoryId: new FormControl(''),
    });
  }


  ngOnInit(): void {
    const productId = this.activatedRoute.snapshot.paramMap.get('uid')
    if(productId !== null) {
      this.firestoreService.getProductById(productId).then((product) =>{
        if(product) {
          this.product = product
          this.formEdit.patchValue(product)
        }
      })
    }
  }

  editProduct() {
    if(this.product && this.product.uid) {
      const productUpt: Product = {
        ...this.product,
        ...this.formEdit.value
      }
      this.firestoreService.updateProduct(this.product.uid, productUpt).then( ()=>{
        this.router.navigate(['home']).then(()=>{location.reload()})
      })
    }
  }
}
