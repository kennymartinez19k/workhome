import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Firestore, collection, where, query, getDocs, DocumentData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { Subscription } from 'rxjs';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-history-orders',
  templateUrl: './history-orders.component.html',
  styleUrls: ['./history-orders.component.scss']
})
export class HistoryOrdersComponent implements OnInit {

  orders: DocumentData[] = []
  userId: any
  user: any
  ordersAdmin: any[] = []
  productsSubscription: Subscription | undefined
  constructor(private firestore: Firestore, private auth: AuthService, private cdRef: ChangeDetectorRef,
    private storage: StorageService){}

 async ngOnInit() {

  this.cdRef.detectChanges()

  this.user = await this.storage.get('usuario')
  if(this.user.role == 'admin') {

    const ordersRef = collection(this.firestore, 'pedidos')
    const q = query(ordersRef, where('status_enviado', '==', 'yes'))
    const querySnap = await getDocs(q)
  
    querySnap.forEach((doc) => {
      this.ordersAdmin.push(doc.data())
    })
    console.log(this.ordersAdmin)
  }
  
  this.userId = await this.auth.getUserUid()
  const ordersRef = collection(this.firestore, 'pedidos')
  const q = query(ordersRef, where('userId', '==', this.userId))
  const querySnap = await getDocs(q)

  querySnap.forEach((doc) => {
    this.orders.push(doc.data())
  })
  console.log(this.orders)

 }

 calcularPrecioTotal(order: DocumentData): number {
  let total = 0
  for(const product of order['items']) {
    total += product.qty * product.product.precio
  }
  return total
 }
}
