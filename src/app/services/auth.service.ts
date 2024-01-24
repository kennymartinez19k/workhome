import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, deleteUser
} from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where, doc, deleteDoc } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isWeb = false
  firebase: any
  constructor(private auth: Auth, private firestore: Firestore) {
    this.firebase = initializeApp(environment.firebase)
  }

  async register({ email, password }: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login({ email, password }: any) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }


  logout() {
    return signOut(this.auth);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email)
      console.log('restablecimiento enviado por correo')
    } catch {
      console.log('error al enviar correo de restablecimiento')
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async getUserUid() {
    const user = await this.auth.currentUser
    if (user) {
      return user.uid
    } else {
      return null
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const user = await this.auth.currentUser;

      if (user) {

        await this.deleteUserDocuments(user.uid);
        await deleteUser(user);
        console.log('Cuenta eliminada con éxito');
      }
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
    }
  }

  private async deleteUserDocuments(uid: string): Promise<void> {
    const collectionsToDelete = ['usuarios', 'carrito', 'pedidos'];

    for (const collectionName of collectionsToDelete) {
      const currentCollection = collection(this.firestore, collectionName);

      try {
        const q = query(currentCollection, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log(`Documento eliminado de ${collectionName}: ${doc.id}`);
        });
      } catch (error) {
        console.error(`Error al eliminar documentos de ${collectionName} en Firestore:`, error);
      }
    }
  }

}
