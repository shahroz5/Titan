import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdvanceBookingComponent } from './view-advance-booking.component';

describe('ViewAdvanceBookingComponent', () => {
  let component: ViewAdvanceBookingComponent;
  let fixture: ComponentFixture<ViewAdvanceBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdvanceBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdvanceBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
