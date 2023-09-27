import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: any[] = []
  productsSubscription: Subscription | undefined
  // totalPrice: number[] = []

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.productsSubscription = this.firestoreService.getOrder().subscribe((data) => {
      this.orders = data
      console.log(this.orders)

    })
  }

  orderSent(orderId: any): void {
    if (orderId) {
      this.firestoreService.orderSent(orderId).then(() => {
        console.log('Colección despachada con éxito');
      }).catch((error) => {
        console.error('Error al despachar la colección:', error);
      });
    } else {
      console.log('El orderId es inválido o está indefinido.');
    }
  }

  calculateTotalPrice(orderData: any[]): number {
    return orderData.reduce((total, product) => {
      return total + (product.precio * product.qty);
    }, 0);
  }

  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe()
    }
  }
}
