import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {App as CapacitorApp} from '@capacitor/app'
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bodega-la-fe';
  
  constructor(private router: Router, private cdRef: ChangeDetectorRef, private storage: StorageService) {}

async ngOnInit() {
  this.cdRef.detectChanges()
  
  const currentRoute = this.router.url
    CapacitorApp.addListener('backButton', ({canGoBack}) =>  {
      if(!canGoBack || currentRoute === '/login') {
        CapacitorApp.exitApp()
      }else {
        window.history.back()
      }
    })

    const user = await this.storage.get('usuario')
    if(user) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['/login'])
    }
  }

}

