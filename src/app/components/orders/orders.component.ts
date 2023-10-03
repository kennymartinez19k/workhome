import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: any[] = []
  productsSubscription: Subscription | undefined

  constructor(private orderService: OrdersService, private alert: ToastController,
    private loading: LoadingController, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cdRef.detectChanges()
    
    this.productsSubscription = this.orderService.getOrder().subscribe((data) => {
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
      this.orderService.sentOrder(orderId).then(() => {
        console.log('Colección despachada con éxito');
        location.reload()
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
