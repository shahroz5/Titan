import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountDetailsGepPurityDiscountComponent } from './discount-details-gep-purity-discount.component';

describe('DiscountDetailsGepPurityDiscountComponent', () => {
  let component: DiscountDetailsGepPurityDiscountComponent;
  let fixture: ComponentFixture<DiscountDetailsGepPurityDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountDetailsGepPurityDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountDetailsGepPurityDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
