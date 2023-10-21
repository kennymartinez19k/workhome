  import { Component, OnInit } from '@angular/core';
  import { FormControl, FormGroup } from '@angular/forms';
  import { Router } from '@angular/router';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
  import { Firestore, collection, addDoc } from '@angular/fire/firestore';
  import { LoadingController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

  @Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
  })
  export class AddProductComponent implements OnInit {
    
    form: FormGroup;
    selectedFile: File | null = null;
    imgUrl: any = null;
    imgName: string | null = null;

    constructor(private productService: ProductService, private router: Router,
      private storage: Storage, private firestore: Firestore, private loading: LoadingController) {

      
      this.form = new FormGroup({
        nombre: new FormControl(),
        precio: new FormControl(),
        stock: new FormControl(),
        img: new FormControl(),
        categoryId: new FormControl()
      });
    }

async addProduct() {
      const product = {
        nombre: this.form.value.nombre.toLowerCase(),
        precio: this.form.value.precio,
        stock: this.form.value.stock,
        img: this.imgUrl,
        qty: 0,
        categoryId: this.form.value.categoryId,
        productId: ''
      }
    
      
      if (this.imgUrl) {

        this.productService.addProduct(product).then( (productId) => {
          console.log(`El producto se ha subido con el id: ${productId}`)
          product.productId = productId
          this.productService.updateProduct(productId, product).then(() =>{
            console.log('producto actualizado en firebase')
          })
          .then(()=>{
          this.router.navigate(['home']).then(()=> {location.reload()})
          })
        })
      } else {
        console.log('No se pudo almacenar la imagen en Firestore.');
      }
}


async takePhoto() {
  const loading = await this.loading.create({
    message: 'Subiendo imagen...'
  });

  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // Verificar si el dispositivo es móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Para dispositivos móviles, usar Camera.getPhoto con Prompt
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (image && image.dataUrl) {
        this.selectedFile = this.dataURLtoFile(
          image.dataUrl,
          `Photo_${new Date().getTime()}` // Nombre del archivo
        );
        await loading.present();

        // Subir la imagen a Firebase Storage
        const path = 'imagenes/' + this.selectedFile.name;
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytes(storageRef, this.selectedFile);
        await uploadTask;

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        this.imgUrl = downloadURL;
        this.imgName = this.selectedFile.name;

        // Almacenar la URL de descarga en Firestore
        const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
          url: this.imgUrl,
          timestamp: new Date(),
        });
        console.log('Imagen almacenada en Firestore con ID:', docRef.id);
      }
    } else {
      // Para dispositivos de escritorio, usar input file
      // Simular el clic en el input file
      input.click();

      // Esperar a que el usuario seleccione un archivo
      const files = await new Promise<FileList | null>((resolve) => {
        input.addEventListener('change', (event) => {
          const files = (event.target as HTMLInputElement).files;
          resolve(files);
        });
      });

      if (files && files.length > 0) {
        const selectedFile = files[0];

        await loading.present();

        // Subir la imagen a Firebase Storage
        const path = 'imagenes/' + selectedFile.name;
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytes(storageRef, selectedFile);
        await uploadTask;

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        this.imgUrl = downloadURL;
        this.imgName = selectedFile.name;

        // Almacenar la URL de descarga en Firestore
        const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
          url: this.imgUrl,
          timestamp: new Date(),
        });
        console.log('Imagen almacenada en Firestore con ID:', docRef.id);
      }
    }
  } catch (error) {
    console.error('Error al seleccionar la imagen:', error);
  } finally {
    await loading.dismiss();
  }
}


    private dataURLtoFile(dataUrl: string, filename: string): File {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    ngOnInit(): void {}

}