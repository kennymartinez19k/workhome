import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardFactoryService {
  constructor(private auth: AuthService, private alert: AlertController, private router: Router) {}

  createGuard(): CanActivateFn {
    return (route, state) => this.canActivate(route, state)
  }

  private async canActivate(route: any, state: any): Promise<boolean> {
    if(this.auth.getCurrentUser()){
      return true;
    }else {
      const alert = await this.alert.create({
        header: 'Acceso denegado',
        message: 'Inicie sesión para acceder a esta área.',
        buttons: ['OK']
      })
      await alert.present()
      await alert.onDidDismiss()
      this.router.navigate(['/login'])
      return false
    }
  }
}
