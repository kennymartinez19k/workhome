import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})

export class FooterNavComponent implements OnInit, OnDestroy {
  user: any = {}
  subscription
  @Input() qtyOrders: any = []
  constructor(private storageService: StorageService, private router: Router, private cartService: ShoppingCartService, private auth: AuthService,
    private cdRef: ChangeDetectorRef) {}
    numberOfOrder = 0

  async ngOnInit() {
    this.cdRef.detectChanges()

    this.subscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
      ).subscribe(async () => {
        this.user = await this.storageService.get('usuario') || {role: 'invitado'}
      })
    
   
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : null;
      
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true)
  }
}
