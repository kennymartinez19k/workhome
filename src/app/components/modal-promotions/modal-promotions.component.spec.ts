import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPromotionsComponent } from './modal-promotions.component';

describe('ModalPromotionsComponent', () => {
  let component: ModalPromotionsComponent;
  let fixture: ComponentFixture<ModalPromotionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPromotionsComponent]
    });
    fixture = TestBed.createComponent(ModalPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
