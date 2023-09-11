import { Component } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss']
})
export class ImagenesComponent {  
  
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  constructor(private storage: Storage, private firestore: Firestore) {}

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Cambia a CameraSource.Photos para seleccionar desde la galería
      });

      if (image && image.dataUrl) {
        this.selectedFile = this.dataURLtoFile(
          image.dataUrl,
          'photo.jpg' // Nombre del archivo
        );

        // Subir la imagen a Firebase Storage
        const path = 'imagenes/' + this.selectedFile.name;
        const storageRef = ref(this.storage, path);
        const uploadTask = uploadBytes(storageRef, this.selectedFile);
        await uploadTask;

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        this.imageUrl = downloadURL;

        // Almacenar la URL de descarga en Firestore
        const docRef = await addDoc(collection(this.firestore, 'imagenes'), {
          url: this.imageUrl,
          timestamp: new Date(),
        });
        console.log('Imagen almacenada en Firestore con ID:', docRef.id);
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
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
}