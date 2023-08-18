import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateSchedulerTimeComponent } from './update-scheduler-time.component';

describe('UpdateSchedulerTimeComponent', () => {
  let component: UpdateSchedulerTimeComponent;
  let fixture: ComponentFixture<UpdateSchedulerTimeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UpdateSchedulerTimeComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSchedulerTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
