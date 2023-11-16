import { Component } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Promotion } from 'src/app/interfaces/promotion';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent {

  imgUrl: any = null
  form: FormGroup
  selectedFile: File | null = null;
  imgName: string | null = null;

  constructor(private firestore: Firestore, private loading: LoadingController,
    private router: Router, private storage: Storage, private promotion: PromotionService){
      this.form = new FormGroup({
        img: new FormControl(),
        titleProm: new FormControl(),
        description: new FormControl()
      })
    }

  async addPromotion() {
    const promotion = {
      img: this.imgUrl,
      promotionId: '',
      title: this.form.value.titleProm,
      description: this.form.value.description
    }
    if(this.imgUrl) {
      this.promotion.addPromotion(promotion).then((promotionId) => {
        console.log(`la promocion se añadio con id ${promotionId}`)
        promotion.promotionId = promotionId
        this.promotion.updatePromotion(promotionId, promotion).then(() =>{
          console.log('producto actualizado en firebase')
          this.router.navigate(['/home'])
        })
      })
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
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    } finally {
      await loading.dismiss();
    }
  }
  

  // async takePhoto() {
  //   const loading = await this.loading.create({
  //     message: 'Subiendo imagen...'
  //   });
  
  //   try {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.accept = 'image/*';
  
  //     // Verificar si el dispositivo es móvil
  //     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  //     if (isMobile) {
  //       // Para dispositivos móviles, usar Camera.getPhoto con Prompt
  //       const image = await Camera.getPhoto({
  //         resultType: CameraResultType.DataUrl,
  //         source: CameraSource.Prompt,
  //       });
  
  //       if (image && image.dataUrl) {
  //         this.selectedFile = this.dataURLtoFile(
  //           image.dataUrl,
  //           `Photo_${new Date().getTime()}` // Nombre del archivo
  //         );
  //         await loading.present();
  
  //         // Subir la imagen a Firebase Storage
  //         const path = 'imagenes/' + this.selectedFile.name;
  //         const storageRef = ref(this.storage, path);
  //         const uploadTask = uploadBytes(storageRef, this.selectedFile);
  //         await uploadTask;
  
  //         // Obtener la URL de descarga
  //         const downloadURL = await getDownloadURL(storageRef);
  //         this.imgUrl = downloadURL;
  //         this.imgName = this.selectedFile.name;
  
  //         // Almacenar la URL de descarga en Firestore
  //         const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
  //           url: this.imgUrl,
  //           timestamp: new Date(),
  //         });
  //         console.log('Imagen almacenada en Firestore con ID:', docRef.id);
  //       }
  //     } else {
  //       // Para dispositivos de escritorio, usar input file
  //       // Simular el clic en el input file
  //       input.click();
  
  //       // Esperar a que el usuario seleccione un archivo
  //       const files = await new Promise<FileList | null>((resolve) => {
  //         input.addEventListener('change', (event) => {
  //           const files = (event.target as HTMLInputElement).files;
  //           resolve(files);
  //         });
  //       });
  
  //       if (files && files.length > 0) {
  //         const selectedFile = files[0];
  
  //         await loading.present();
  
  //         // Subir la imagen a Firebase Storage
  //         const path = 'imagenes/' + selectedFile.name;
  //         const storageRef = ref(this.storage, path);
  //         const uploadTask = uploadBytes(storageRef, selectedFile);
  //         await uploadTask;
  
  //         // Obtener la URL de descarga
  //         const downloadURL = await getDownloadURL(storageRef);
  //         this.imgUrl = downloadURL;
  //         this.imgName = selectedFile.name;
  
  //         // Almacenar la URL de descarga en Firestore
  //         const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
  //           url: this.imgUrl,
  //           timestamp: new Date(),
  //         });
  //         console.log('Imagen almacenada en Firestore con ID:', docRef.id);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error al seleccionar la imagen:', error);
  //   } finally {
  //     await loading.dismiss();
  //   }
  // }
  
  
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

}
