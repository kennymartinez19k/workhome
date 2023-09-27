import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss']
})

export class FooterNavComponent implements OnInit {
  user: any = {}

  constructor(private storageService: StorageService) {}
  async ngOnInit() {
    this.user = await this.storageService.get('usuario')
  }
}
