import { Component, OnInit } from '@angular/core';
import { Firestore, collection, where, query, getDocs, DocumentData } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-history-orders',
  templateUrl: './history-orders.component.html',
  styleUrls: ['./history-orders.component.scss']
})
export class HistoryOrdersComponent implements OnInit {

  orders: DocumentData[] = []
  userId: any

  constructor(private firestore: Firestore, private auth: AuthService){}

 async ngOnInit() {
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
