import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdvanceBookingComponent } from './search-advance-booking.component';

describe('SearchAdvanceBookingComponent', () => {
  let component: SearchAdvanceBookingComponent;
  let fixture: ComponentFixture<SearchAdvanceBookingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdvanceBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdvanceBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
