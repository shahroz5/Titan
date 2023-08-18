import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduledJobsListingComponent } from './scheduled-jobs-listing.component';

describe('ScheduledJobsListingComponent', () => {
  let component: ScheduledJobsListingComponent;
  let fixture: ComponentFixture<ScheduledJobsListingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ScheduledJobsListingComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledJobsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
