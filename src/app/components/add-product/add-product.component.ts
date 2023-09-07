import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo } from '@capacitor/camera/dist/esm/definitions';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  
  formulario: FormGroup
  selectedImage: Photo | undefined = undefined

constructor(private firestoreService: FirestoreService, private router: Router) {
  this.formulario = new FormGroup({
    nombre: new FormControl(),
    precio: new FormControl(),
    stock: new FormControl()
  })
}


ngOnInit(): void {}

async agregarProducto() {

  const producto = {
    nombre: this.formulario.get('nombre')?.value,
    precio: this.formulario.get('precio')?.value,
    stock: this.formulario.get('stock')?.value,
    // imagenUrl: ''
  }
  const response = await this.firestoreService.agregarProducto(producto)
  // if(this.selectedImage) {
  // const response = await this.firestoreService.agregarProducto(producto, this.selectedImage)
  // console.log(response)
  // } else {
  //   alert("INGRESE UNA IMAGEN")
  // }
  console.log(response)
  this.router.navigate(['home'])
}

// async seleccionarImagen() {

//   try {
//     const image = await Camera.getPhoto({
//       resultType: CameraResultType.DataUrl,
//       source:CameraSource.Photos,
//       quality: 100
//     })
//     if(image) {
//       this.selectedImage = image
//     } else {
//       console.log("no se encontro una imagen")
//     }
//   }
//    catch (error) {
//     console.error('error al seleccionar una imagen', error)
//   }
// }

}
