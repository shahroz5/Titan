import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EghsOfflineBodPopupComponent } from './eghs-offline-bod-popup.component';

describe('EghsOfflineBodPopupComponent', () => {
  let component: EghsOfflineBodPopupComponent;
  let fixture: ComponentFixture<EghsOfflineBodPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EghsOfflineBodPopupComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EghsOfflineBodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
