import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataSyncStatisticsComponent } from './data-sync-statistics.component';

describe('DataSyncStatisticsComponent', () => {
  let component: DataSyncStatisticsComponent;
  let fixture: ComponentFixture<DataSyncStatisticsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DataSyncStatisticsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSyncStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
