import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManualTriggerDataSyncComponent } from './manual-trigger-data-sync.component';

describe('ManualTriggerDataSyncComponent', () => {
  let component: ManualTriggerDataSyncComponent;
  let fixture: ComponentFixture<ManualTriggerDataSyncComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ManualTriggerDataSyncComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualTriggerDataSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
