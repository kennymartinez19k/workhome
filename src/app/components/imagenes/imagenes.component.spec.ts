import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesComponent } from './imagenes.component';

describe('ImagenesComponent', () => {
  let component: ImagenesComponent;
  let fixture: ComponentFixture<ImagenesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagenesComponent]
    });
    fixture = TestBed.createComponent(ImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
