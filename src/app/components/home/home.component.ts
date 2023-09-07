import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

productos: Product[] = []
usuario: any

  constructor(private router: Router, private firestoreService: FirestoreService){
    this.productos = [{
      nombre: "",
      precio: 0,
      stock: 0,
      // imagenUrl: ''
    }]
  }

  config: SwiperOptions = {
    slidesPerView: 2,
    scrollbar: { draggable: true },
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    },
    
    loop:true
  };

  ngOnInit(): void {
    this.firestoreService.obtenerProducto().subscribe(productos => {
      this.productos = productos
    })
    const dataUsuario = localStorage.getItem("usuario")
    if(dataUsuario) {
      this.usuario = JSON.parse(dataUsuario)
    }
  }
}
