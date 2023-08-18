import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgEghsOfflineBodPasswordGridComponent } from './ag-eghs-offline-bod-password-grid.component';

describe('AgEghsOfflineBodPasswordGridComponent', () => {
  let component: AgEghsOfflineBodPasswordGridComponent;
  let fixture: ComponentFixture<AgEghsOfflineBodPasswordGridComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AgEghsOfflineBodPasswordGridComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AgEghsOfflineBodPasswordGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
