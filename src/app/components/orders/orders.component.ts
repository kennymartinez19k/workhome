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
  subscription!: Subscription;

  constructor(private orderService: OrdersService, private alert: ToastController,
    private loading: LoadingController, private cdRef: ChangeDetectorRef) {}

    handleRefresh(event) {
      setTimeout(() => {
        // Any calls to load data go here
        this.refreshOrders()
        event.target.complete();
      }, 2000);
    }

  ngOnInit(): void {
    this.cdRef.detectChanges()

    this.orderService.refresh$.subscribe(()=>{
      this.orderService.getOrder().subscribe((data) => {
        this.orders = data
      })
    })
    
    this.orderService.getOrder().subscribe((data) => {
      this.orders = data
    })
  }

  refreshOrders() {
    this.orderService.getOrder().subscribe((data) => {
      this.orders = data
    })
  }

  async sentOrder(orderId: any) {
    const loading = await this.loading.create({
      message: 'Despachando pedido...'
    })
    await loading.present()
    
    if (orderId) {
      this.orderService.sentOrder(orderId).then(() => {
        console.log('Colección despachada con éxito');
        // location.reload()
      }).catch((error) => {
        console.error('Error al despachar la colección:', error);
      });
    } else {
      console.log('El orderId es inválido o está indefinido.');
    }

    loading.dismiss()
    
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
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
