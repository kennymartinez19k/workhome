import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { ModalPromotionsComponent } from '../modal-promotions/modal-promotions.component';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;
  userdata: User[] = []
  promotion: any

constructor( private authService: AuthService, private router: Router, 
  private userService: UserService, private cdRef: ChangeDetectorRef,
  private alert: AlertController, private storage: StorageService,
  private loading: LoadingController, private modal: ModalController,
  private promotionService: PromotionService){
  this.formReg = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    tel: new FormControl('', Validators.required)
  })
}

ngOnInit(): void{
  this.cdRef.detectChanges()

  this.promotionService.refresh$.subscribe(()=> {
    this.refreshPromotion()
  })

  this.promotionService.getPromotion().subscribe(promotion => {
    this.promotion = promotion
  })
}

async register() {

  if(this.formReg.valid) {
    const userData = {
      username: this.formReg.value.username,
      email: this.formReg.value.email,
      tel: this.formReg.value.tel
    }

    const loading = await this.loading.create({
      message: 'Registrando usuario...'
    })
    
    await loading.present()
  this.authService.register(this.formReg.value).then( () => {
    this.userService.addUser(userData)
    this.userService.getUser().subscribe(async userdata => {
      this.userdata = userdata
      const username = userdata.map(x => x.username)
      const email = userdata.map(x => x.email)
      const role = userdata.map(x => x.role)
      const tel = userdata.map(x => x.tel)
      const usuario = {username, email, role, tel}
      await this.storage.set('usuario', usuario)
      await loading.dismiss()
      this.router.navigate(['home']).then(()=>{
        this.presentCustomModal()
      })
    })

  }).catch(async (error) => {
    console.log(error)
    await loading.dismiss()

    const alert = await this.alert.create({
      header: 'Error',
      message: 'Posiblemente el correo electrónico ya esté en uso.',
      buttons: ['OK'],
    });

    await alert.present();
  })
  } else {
    const alert = await this.alert.create({
      header: 'Error',
      message: 'Ingrese sus datos correctamente o una contraseña más segura.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}

refreshPromotion() {
  this.promotionService.getPromotion().subscribe(promotion => {
    this.promotion = promotion
  })
}

async presentCustomModal() {
  const modal = await this.modal.create({
    component: ModalPromotionsComponent,
    cssClass: 'alert-modal',
    componentProps: {
      data: {
        img: this.promotion[0].img,
        title: this.promotion[0].title,
        description: this.promotion[0].description
      }
    }
  });

  return await modal.present();
}

}
