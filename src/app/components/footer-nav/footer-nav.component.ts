import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})

export class FooterNavComponent implements OnInit {
  user: any = {}

  constructor(private storageService: StorageService, private router: Router) {}
  async ngOnInit() {
    this.user = await this.storageService.get('usuario')
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true)
  }
}
