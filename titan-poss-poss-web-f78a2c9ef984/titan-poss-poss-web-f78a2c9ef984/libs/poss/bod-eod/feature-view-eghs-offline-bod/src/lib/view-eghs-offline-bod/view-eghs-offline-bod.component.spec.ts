import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewEghsOfflineBodComponent } from './view-eghs-offline-bod.component';

describe('ViewEghsOfflineBodComponent', () => {
  let component: ViewEghsOfflineBodComponent;
  let fixture: ComponentFixture<ViewEghsOfflineBodComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ViewEghsOfflineBodComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEghsOfflineBodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
