import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Camera, Photo, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  

  formulario: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.formulario = new FormGroup({
      nombre: new FormControl(),
      precio: new FormControl(),
      stock: new FormControl(),
    });
  }

  ngOnInit(): void {}

  async agregarProducto() {
    const producto = {
      nombre: this.formulario.get('nombre')?.value,
      precio: this.formulario.get('precio')?.value,
      stock: this.formulario.get('stock')?.value,
      imagenUrl: '',
    };

    const res = await this.firestoreService.agregarProducto(producto)
  }
}