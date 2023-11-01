import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  constructor(private cdRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.cdRef.detectChanges()
  }  
  config: SwiperOptions = {
    slidesPerView: 1,
    scrollbar: { draggable: true },
    autoplay:{
      delay: 1000,
      disableOnInteraction: false,
    },
    
    loop:true
  };
}
