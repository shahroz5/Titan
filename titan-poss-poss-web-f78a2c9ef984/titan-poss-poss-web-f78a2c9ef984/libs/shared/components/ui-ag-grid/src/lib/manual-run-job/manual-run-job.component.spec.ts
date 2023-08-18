import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManualRunJobComponent } from './manual-run-job.component';

describe('ManualRunJobComponent', () => {
  let component: ManualRunJobComponent;
  let fixture: ComponentFixture<ManualRunJobComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManualRunJobComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualRunJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
