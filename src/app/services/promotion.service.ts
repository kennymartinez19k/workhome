import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc, query, getDocs, deleteDoc } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { Promotion } from '../interfaces/promotion';
import { Observable, map, from, Subject } from 'rxjs'
import { Storage, deleteObject, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private _refresh$ = new Subject<void>()

  constructor(private firestore: Firestore, private loading: LoadingController,
    private storage: Storage) { }

  get refresh$() {
    return this._refresh$
  }

  async addPromotion(promotion: Promotion) {
    const loading = await this.loading.create({
      message: 'Agregando promoción...'
    })
    const productRef = collection(this.firestore, 'promocion');
    await loading.present()
    const docRef = await addDoc(productRef, promotion)
    await loading.dismiss()
    this._refresh$.next()
    return docRef.id
  }

  async updatePromotion(promotionId: string, promotion: Promotion): Promise <void> {
    const promotionRef = doc(this.firestore, 'promocion', promotionId)
    return setDoc(promotionRef, promotion, {merge: true})
  }

  getPromotion(): Observable<Promotion[]> {
    const q = query(collection(this.firestore, 'promocion'));

    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const productos: Promotion[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Promotion;
          productos.push(data);
        });
        return productos;
      })
    );
  }

  async deletePromotion(promotionId: string | undefined, imageName: string | undefined): Promise<void> {
    if(promotionId && imageName) {
      const productRef = doc(this.firestore, 'promocion', promotionId)
      await deleteDoc(productRef)

      const storageRef = ref(this.storage, 'imagenes/' + imageName)
      await deleteObject(storageRef)
      console.log('eliminado con exito:',storageRef.name)
    } else {
      console.log('ERROR al eliminar Promocion')
    }
  }

}
