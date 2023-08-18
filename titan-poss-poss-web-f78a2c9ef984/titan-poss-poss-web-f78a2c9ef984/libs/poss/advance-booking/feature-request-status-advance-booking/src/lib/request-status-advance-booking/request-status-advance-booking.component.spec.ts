import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusAdvanceBookingComponent } from './request-status-advance-booking.component';

describe('RequestStatusAdvanceBookingComponent', () => {
  let component: RequestStatusAdvanceBookingComponent;
  let fixture: ComponentFixture<RequestStatusAdvanceBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusAdvanceBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusAdvanceBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
