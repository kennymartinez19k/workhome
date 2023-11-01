import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  email: string = ''
  constructor(private auth: AuthService, private alert: AlertController){}

  async resetPassword() {
    const alert = await this.alert.create({
      header: 'Enviando correo de restablecimiento...',
      message: 'El correo fue enviado exitosamente.',
      buttons: ['OK']
    })

    if(this.email) {
      alert.present()
      await this.auth.resetPassword(this.email).then(()=>{
        console.log('correo enviado con exito')
      }).catch((error) => {console.log('error enviar correo'), error})
    } else {
      console.log('ingree un correo valido')
    }
  }
}
