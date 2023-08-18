import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EghsOfflineEodPopupComponent } from './eghs-offline-eod-popup.component';

describe('EghsOfflineEodPopupComponent', () => {
  let component: EghsOfflineEodPopupComponent;
  let fixture: ComponentFixture<EghsOfflineEodPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EghsOfflineEodPopupComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EghsOfflineEodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
