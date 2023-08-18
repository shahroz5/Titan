import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CatchmentDetailsComponent } from './catchment-details.component';

describe('CatchmentDetailsComponent', () => {
  let component: CatchmentDetailsComponent;
  let fixture: ComponentFixture<CatchmentDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CatchmentDetailsComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CatchmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
