import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {App as CapacitorApp} from '@capacitor/app'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'bodega-la-fe';
  
  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

ngOnInit() {
  this.cdRef.detectChanges()
  
  const currentRoute = this.router.url
    CapacitorApp.addListener('backButton', ({canGoBack}) =>  {
      if(!canGoBack || currentRoute === '/login') {
        CapacitorApp.exitApp()
      }else {
        window.history.back()
      }
    })
  }
}

