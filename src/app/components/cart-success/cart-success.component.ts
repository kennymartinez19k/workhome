import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-success',
  templateUrl: './cart-success.component.html',
  styleUrls: ['./cart-success.component.scss']
})
export class CartSuccessComponent {

  ionViewDidEnter() {
    new Audio('assets/sounds/pedido.mp3').play();
  }
}
