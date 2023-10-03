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
        uid: ''
      }
    
      
      if (this.imgUrl) {

        this.productService.addProduct(product).then( (productUid) => {
          console.log(`El producto se ha subido con el id: ${productUid}`)
          product.uid = productUid
          this.productService.updateProduct(productUid, product).then(() =>{
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
      })
      try {
        const image = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Photos, // Cambia a CameraSource.Photos para seleccionar desde la galería
        });
    
        if (image && image.dataUrl) {
          this.selectedFile = this.dataURLtoFile(
            image.dataUrl,
            `Photo_${new Date().getTime()}` // Nombre del archivo
          );
         await loading.present()
    
          // Subir la imagen a Firebase Storage
          const path = 'imagenes/' + this.selectedFile.name;
          const storageRef = ref(this.storage, path);
          const uploadTask = uploadBytes(storageRef, this.selectedFile);
          await uploadTask;
    
          // Obtener la URL de descarga
          const downloadURL = await getDownloadURL(storageRef);
          this.imgUrl = downloadURL;

          this.imgName = this.selectedFile.name
    
          // Almacenar la URL de descarga en Firestore
          const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
            url: this.imgUrl,
            timestamp: new Date(),
          });
          console.log('Imagen almacenada en Firestore con ID:', docRef.id);
    
        }
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }finally{
        (await loading).dismiss()
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