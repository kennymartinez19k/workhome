import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { ModalController } from '@ionic/angular';
import SwiperCore, { Zoom } from 'swiper'
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Zoom])

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {
  @Input() imageUrl: string

  constructor(private modalCtrl: ModalController) {
    this.imageUrl = ''
  }

  config: SwiperOptions = {
    zoom: true
  }

  ngOnInit() { }

  zoom(zoomIn) { }

  closeModal() {
    this.modalCtrl.dismiss()
  }
}
