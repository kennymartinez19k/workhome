import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.cdRef.detectChanges()
  }

}
