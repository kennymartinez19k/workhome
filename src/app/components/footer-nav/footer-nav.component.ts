import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})

export class FooterNavComponent implements OnInit, OnDestroy {
  user: any = {}
  subscription
  @Input() qtyOrders: any = []
  constructor(private storageService: StorageService, private router: Router,
    private cdRef: ChangeDetectorRef, private alert: AlertController) {}
    numberOfOrder = 0

  async ngOnInit() {
    this.cdRef.detectChanges()

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
      ).subscribe(async () => {
        this.user = await this.storageService.get('usuario') || {role: 'invitado'}
      })
      
      // const userExists = await this.storageService.get('usuario')
      // if(!userExists) {
      //   const alert = await this.alert.create({
      //     header: 'ERROR',
      //     message: 'Inicie sesión para ver el carrito.',
      //     buttons: ['OK']
      //   })
      //   await alert.present()
      //   this.router.navigate(['/home'])
      // }
   
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
      
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true)
  }
}
