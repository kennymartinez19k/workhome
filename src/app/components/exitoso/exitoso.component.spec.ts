import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitosoComponent } from './exitoso.component';

describe('ExitosoComponent', () => {
  let component: ExitosoComponent;
  let fixture: ComponentFixture<ExitosoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExitosoComponent]
    });
    fixture = TestBed.createComponent(ExitosoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
