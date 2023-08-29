import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public islog = false;
  constructor(private router: Router){}
  logout(){
    if (confirm("Desea Cerrar Sesión")){
      localStorage.removeItem("islog")
      this.router.navigate(['/login'])
    }
  }

  ngOnInit(): void {
    const estaLogeado = (localStorage.getItem("islog"))
    if(estaLogeado !== null){
      this.islog =JSON.parse(estaLogeado)
    }
  }
}
