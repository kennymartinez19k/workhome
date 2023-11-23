import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-promotions',
  templateUrl: './modal-promotions.component.html',
  styleUrls: ['./modal-promotions.component.scss']
})
export class ModalPromotionsComponent {
  data: any
  

  constructor(private modalController: ModalController, private navParams: NavParams, private router: Router) {
    this.data = this.navParams.get('data')
  }

  closeModal() {
    this.modalController.dismiss()
  }

  goToPromotion(){
    this.router.navigate(['category/Ofertas'])
    this.closeModal()
  }

}
