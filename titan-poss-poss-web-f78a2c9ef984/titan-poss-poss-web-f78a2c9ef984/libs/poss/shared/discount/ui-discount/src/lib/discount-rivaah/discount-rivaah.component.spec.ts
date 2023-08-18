import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountRivaahComponent } from './discount-rivaah.component';

describe('DiscountRivaahComponent', () => {
  let component: DiscountRivaahComponent;
  let fixture: ComponentFixture<DiscountRivaahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountRivaahComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountRivaahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
