// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
// import { Firestore, collection, addDoc } from '@angular/fire/firestore';
// import { AlertController, LoadingController } from '@ionic/angular';
// import { ProductService } from 'src/app/services/product.service';

// @Component({
//   selector: 'app-add-product',
//   templateUrl: './add-product.component.html',
//   styleUrls: ['./add-product.component.scss']
// })
// export class AddProductComponent implements OnInit {

//   form: FormGroup;
//   selectedFile: File | null = null
//   imgUrl: any = null;
//   imgName: string | null = null;
//   imgUrlTemp: string | null = null;

//   constructor(private productService: ProductService, private router: Router,
//     private storage: Storage, private firestore: Firestore, private loading: LoadingController,
//     private alert: AlertController) {


//     this.form = new FormGroup({
//       nombre: new FormControl(),
//       precio: new FormControl(),
//       stock: new FormControl(),
//       img: new FormControl(),
//       categoryId: new FormControl()
//     });
//   }


//   async addProduct() {
//     if (this.areAllFieldsFilled() && this.imgUrlTemp !== null) {
//       const loading = await this.loading.create({
//         message: 'Subiendo imagen a Storage...'
//       });

//       try {
//         await loading.present();

//         // Convertir la imagen temporal a Blob antes de subirla a Firebase Storage
//         const blob = await fetch(this.imgUrlTemp).then((res) => res.blob());

//         // Crear una referencia en Firebase Storage
//         const path = 'imagenes/' + this.imgName;
//         const storageRef = ref(this.storage, path);

//         // Subir la imagen a Firebase Storage
//         const uploadTask = uploadBytes(storageRef, blob);
//         await uploadTask;

//         // Obtener la URL de descarga
//         const downloadURL = await getDownloadURL(storageRef);

//         // Crear el objeto Product con la URL de descarga
//         const product = {
//           nombre: this.form.value.nombre.toLowerCase(),
//           precio: this.form.value.precio,
//           stock: this.form.value.stock,
//           img: downloadURL, // Utilizar la URL de descarga
//           imageName: storageRef.name,
//           qty: 0,
//           categoryId: this.form.value.categoryId,
//           productId: ''
//         };

//         // Agregar el producto a la base de datos
//         const productId = await this.productService.addProduct(product);

//         // Actualizar el producto con el ID y otros detalles si es necesario
//         product.productId = productId;
//         await this.productService.updateProduct(productId, product);

//         console.log(`El producto se ha subido con el id: ${productId}`);
//       } catch (error) {
//         console.error('Error al subir la imagen a Firebase Storage:', error);
//       } finally {
//         await loading.dismiss();
//         this.router.navigate(['home']);
//       }
//     } else {
//       const alert = await this.alert.create({
//         header: 'Error al subir el producto',
//         message: 'Complete todos los campos para subir el producto.',
//         buttons: ['OK']
//       })
//       await alert.present()
//       console.log('No se pudo almacenar la imagen en Firestore.');
//     }
//   }


//   async takePhoto() {
//     const loading = await this.loading.create({
//       message: 'Subiendo imagen...'
//     });

//     try {
//       const input = document.createElement('input');
//       input.type = 'file';
//       input.accept = 'image/*';

//       // Verificar si el dispositivo es móvil
//       const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//       if (!isMobile) {
//         // Para dispositivos móviles, usar Camera.getPhoto con Prompt
//         const image = await Camera.getPhoto({
//           resultType: CameraResultType.DataUrl,
//           source: CameraSource.Prompt,
//         });

//         if (image && image.dataUrl) {
//           await this.compressAndSetImage(image.dataUrl);
//         }

//       } else {
//         // Para dispositivos de escritorio, usar input file
//         // Simular el clic en el input file
//         input.click();

//         // Esperar a que el usuario seleccione un archivo
//         const files = await new Promise<FileList | null>((resolve) => {
//           input.addEventListener('change', (event) => {
//             const files = (event.target as HTMLInputElement).files;
//             resolve(files);
//           });
//         });

//         if (files && files.length > 0) {
//           const selectedFile = files[0];

//           // Convertir el archivo a Blob antes de asignarlo a this.imgUrlTemp
//           const blob = selectedFile instanceof Blob ? selectedFile : new Blob([selectedFile]);

//           // Crear un objeto URL para la imagen seleccionada temporalmente
//           const dataUrl = URL.createObjectURL(blob);

//           await this.compressAndSetImage(dataUrl);
//         }
//       }
//     } catch (error) {
//       console.error('Error al seleccionar la imagen:', error);
//       await loading.dismiss();
//     } finally {
//       await loading.dismiss();
//     }
//   }

//   async compressAndSetImage(dataUrl: string) {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       throw new Error('Unable to create canvas context');
//     }

//     const image = new Image();
//     image.src = dataUrl;

//     await new Promise<void>((resolve) => {
//       image.onload = () => {
//         const maxWidth = 800; // Define el ancho máximo deseado
//         const maxHeight = 600; // Define el alto máximo deseado

//         let width = image.width;
//         let height = image.height;

//         // Redimensionar la imagen si es necesario
//         if (width > maxWidth) {
//           height *= maxWidth / width;
//           width = maxWidth;
//         }

//         if (height > maxHeight) {
//           width *= maxHeight / height;
//           height = maxHeight;
//         }

//         canvas.width = width;
//         canvas.height = height;

//         // Dibujar la imagen en el canvas
//         ctx.drawImage(image, 0, 0, width, height);

//         // Obtener el data URL de la imagen comprimida desde el canvas
//         const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 es la calidad de compresión (0.7 es buena calidad y compresión razonable)

//         // Almacenar la URL temporalmente
//         this.imgUrlTemp = compressedDataUrl;
//         this.imgName = `Photo_${new Date().getTime()}.jpg`; // Cambiar la extensión a jpg

//         resolve();
//       };
//     });
//   }



//   private dataURLtoFile(dataUrl: string, filename: string): File {
//     const arr = dataUrl.split(',');
//     const mime = arr[0].match(/:(.*?);/)![1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   }

//   private areAllFieldsFilled(): boolean {
//     const formValues = this.form.value;
//     return formValues.nombre && formValues.precio && formValues.stock && formValues.categoryId
//   }

//   ngOnInit(): void { }

// }


import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importa el plugin de la cámara
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  form: FormGroup;
  selectedFile: File | null = null
  imgUrl: any = null;
  imgName: string | null = null;
  imgUrlTemp: string | null = null;

  constructor(private productService: ProductService, private router: Router,
    private storage: Storage, private firestore: Firestore, private loading: LoadingController,
    private alert: AlertController) {

    this.form = new FormGroup({
      nombre: new FormControl(),
      precio: new FormControl(),
      stock: new FormControl(),
      img: new FormControl(),
      categoryId: new FormControl()
    });
  }

  async addProduct() {
    if (this.areAllFieldsFilled() && this.imgUrlTemp !== null) {
      const loading = await this.loading.create({
        message: 'Subiendo imagen a Storage...'
      });

      try {
        await loading.present();
        const blob = await fetch(this.imgUrlTemp).then((res) => res.blob());
        const path = 'imagenes/' + this.imgName;
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytes(storageRef, blob);
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        const product = {
          nombre: this.form.value.nombre.toLowerCase(),
          precio: this.form.value.precio,
          stock: this.form.value.stock,
          img: downloadURL,
          imageName: storageRef.name,
          qty: 0,
          categoryId: this.form.value.categoryId,
          productId: ''
        };
        const productId = await this.productService.addProduct(product);
        product.productId = productId;
        await this.productService.updateProduct(productId, product);
        console.log(`El producto se ha subido con el id: ${productId}`);
      } catch (error) {
        console.error('Error al subir la imagen a Firebase Storage:', error);
      } finally {
        await loading.dismiss();
        this.router.navigate(['home']);
      }
    } else {
      const alert = await this.alert.create({
        header: 'Error al subir el producto',
        message: 'Complete todos los campos para subir el producto.',
        buttons: ['OK']
      })
      await alert.present()
      console.log('No se pudo almacenar la imagen en Firestore.');
    }
  }

  async takePhoto() {
    const loading = await this.loading.create({
      message: 'Subiendo imagen...'
    });

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        const alert = await this.alert.create({
          header: 'Seleccionar origen',
          message: '¿De dónde quieres seleccionar la imagen?',
          buttons: [
            {
              text: 'Cámara',
              handler: async () => {
                await this.takePhotoFromSource(CameraSource.Camera);
              }
            },
            {
              text: 'Galería',
              handler: async () => {
                await this.takePhotoFromSource(CameraSource.Photos);

              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]
        });
        await alert.present();
      } else {
        await this.takePhotoFromSource(CameraSource.Photos);

      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async takePhotoFromSource(source: CameraSource) {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: source,
    });

    if (image && image.dataUrl) {
      await this.compressAndSetImage(image.dataUrl);
    }
  }

  async compressAndSetImage(dataUrl: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to create canvas context');
    }

    const image = new Image();
    image.src = dataUrl;

    await new Promise<void>((resolve) => {
      image.onload = () => {
        const maxWidth = 800; // Define el ancho máximo deseado
        const maxHeight = 600; // Define el alto máximo deseado

        let width = image.width;
        let height = image.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        this.imgUrlTemp = compressedDataUrl;
        this.imgName = `Photo_${new Date().getTime()}.jpg`; // Cambiar la extensión a jpg

        resolve();
      };
    });
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

  private areAllFieldsFilled(): boolean {
    const formValues = this.form.value;
    return formValues.nombre && formValues.precio && formValues.stock && formValues.categoryId
  }

  ngOnInit(): void { }
}
