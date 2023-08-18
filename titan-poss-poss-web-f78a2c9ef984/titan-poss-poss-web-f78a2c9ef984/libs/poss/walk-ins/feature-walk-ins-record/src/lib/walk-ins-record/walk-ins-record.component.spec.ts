import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WalkInsRecordComponent } from './walk-ins-record.component';

describe('WalkInsRecordComponent', () => {
  let component: WalkInsRecordComponent;
  let fixture: ComponentFixture<WalkInsRecordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalkInsRecordComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkInsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
