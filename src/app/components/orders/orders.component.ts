import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subscription } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: any[] = []
  productsSubscription: Subscription | undefined

  constructor(private firestoreService: FirestoreService, private alert: ToastController,
    private loading: LoadingController) {}

  ngOnInit(): void {
    this.productsSubscription = this.firestoreService.getOrder().subscribe((data) => {
      this.orders = data
      console.log(this.orders)

    })
  }

  async orderSent(orderId: any) {
    const loading = await this.loading.create({
      message: 'Despachando pedido...'
    })
    await loading.present()
    
    if (orderId) {
      this.firestoreService.orderSent(orderId).then(() => {
        location.reload()
        console.log('Colección despachada con éxito');
      }).catch((error) => {
        console.error('Error al despachar la colección:', error);
      });
    } else {
      console.log('El orderId es inválido o está indefinido.');
    }

    loading.dismiss()
  }

  ngOnDestroy(): void {
    if(this.productsSubscription) {
      this.productsSubscription.unsubscribe()
    }
  }

  async copyToClipboard(url: string): Promise<void> {
    await Clipboard.write({
      string: url
    })

    const alert = await this.alert.create({
      message: 'Copiado con éxito',
      duration: 1000,
      position: 'middle'
    })

    await alert.present()

  }

  calculateOrderTotal(order: any): number {
    let total = 0;
    for (const product of order.items) {
      total += product.qty * product.product.precio;
    }
    return total;
  }
  
}
