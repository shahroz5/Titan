import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorGridPopupComponent } from './error-grid-popup.component';

describe('ErrorGridPopupComponent', () => {
  let component: ErrorGridPopupComponent;
  let fixture: ComponentFixture<ErrorGridPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorGridPopupComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorGridPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
