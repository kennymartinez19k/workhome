import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit{

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
      this.islog = JSON.parse(estaLogeado)
    }
  }

}