import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-success',
  templateUrl: './cart-success.component.html',
  styleUrls: ['./cart-success.component.scss']
})
export class CartSuccessComponent {

  constructor(private router: Router) {}

  ionViewDidEnter() {
    new Audio('assets/sounds/pedido.mp3').play();
  }

  backHome() {
    this.router.navigate(['/home']).then( () => {
      location.reload()
    })
  }
}
