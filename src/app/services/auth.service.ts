import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, getRedirectResult, UserCredential,
signInWithRedirect } from '@angular/fire/auth';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private loading: LoadingController, private alert: AlertController) { }

  async register({email, password}: any) {
    await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login({ email, password }: any) {
    const loading = await this.loading.create({
      message: 'Iniciando sesión...',
    });
  
    await loading.present();
  
    try {
      await signInWithEmailAndPassword(this.auth, email, password);

    } catch (error) {
      console.error(error);
  
      await loading.dismiss();
  
      const alert = await this.alert.create({
        header: 'Error',
        message: 'Las credenciales son incorrectas. Por favor, inténtalo de nuevo.',
        buttons: ['OK'],
      });
  
      await alert.present();
    } 
  }


  async loginWithGoogle(): Promise<UserCredential | any>{
    const provider = new GoogleAuthProvider()
    try {
      await signInWithRedirect(this.auth, provider)
      const result = await getRedirectResult(this.auth)
      return result
    } catch(error) {
      console.log('error')
      throw error
    }
  }

  async logout() {
    return await signOut(this.auth);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email)
      console.log('restablecimiento enviado por correo')
    } catch {
      console.log('error al enviar correo de restablecimiento')
    }
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

 async getUserUid() {
  const user = await this.auth.currentUser
  if(user) {
    return user.uid
  }else {
    return null
  }
 }
 

}
