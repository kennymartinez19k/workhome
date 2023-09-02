import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

productForm: FormGroup
products: Product[]

constructor(private firestoreService: FirestoreService) {
  this.productForm = new FormGroup({
    name: new FormControl(),
    price: new FormControl(),
    stock: new FormControl()
  })
  this.products = [{
    name: '',
    price: 0,
    stock: 0
  }]
}

  
 async ngOnInit() {
  this.firestoreService.getProduct().subscribe(x => {
    this.products = x
  })
}

async addProduct() {
    console.log(this.productForm.value)

    const response = await this.firestoreService.addProduct(this.productForm.value)
    console.log(response)
}

}
