import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  
  formulario: FormGroup

constructor(private firestoreService: FirestoreService, private router: Router) {
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    precio: new FormControl(),
    stock: new FormControl()
  })
}


ngOnInit(): void {}

async agregarProducto() {
  console.log(this.formulario.value)
  const response = await this.firestoreService.agregarProducto(this.formulario.value)
  console.log(response)
  this.router.navigate(['home'])
}

}
