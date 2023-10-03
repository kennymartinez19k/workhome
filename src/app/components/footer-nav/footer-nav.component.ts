import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})

export class FooterNavComponent implements OnInit {
  user: any = {}

  constructor(private storageService: StorageService, private router: Router,
    private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    this.cdRef.detectChanges()
    this.user = await this.storageService.get('usuario') || {role: 'invitado'}
  }

  isRouteActive(route: string): boolean {
    return this.router.isActive(route, true)
  }
}
