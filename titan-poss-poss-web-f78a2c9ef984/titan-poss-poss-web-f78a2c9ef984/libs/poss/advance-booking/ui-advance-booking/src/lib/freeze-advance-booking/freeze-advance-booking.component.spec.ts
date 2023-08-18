import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeAdvanceBookingComponent } from './freeze-advance-booking.component';

describe('FreezeAdvanceBookingComponent', () => {
  let component: FreezeAdvanceBookingComponent;
  let fixture: ComponentFixture<FreezeAdvanceBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeAdvanceBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeAdvanceBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
