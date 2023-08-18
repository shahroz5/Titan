import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceBookingShellComponent } from './advance-booking-shell.component';

describe('AdvanceBookingShellComponent', () => {
  let component: AdvanceBookingShellComponent;
  let fixture: ComponentFixture<AdvanceBookingShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceBookingShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceBookingShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
