import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountDetailsRivaahDiscountComponent } from './discount-details-rivaah-discount.component';

describe('DiscountDetailsRivaahDiscountComponent', () => {
  let component: DiscountDetailsRivaahDiscountComponent;
  let fixture: ComponentFixture<DiscountDetailsRivaahDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountDetailsRivaahDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountDetailsRivaahDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
