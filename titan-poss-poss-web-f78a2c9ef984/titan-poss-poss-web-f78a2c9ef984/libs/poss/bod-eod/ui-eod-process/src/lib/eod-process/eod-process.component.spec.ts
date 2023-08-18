import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EodProcessComponent } from './eod-process.component';

describe('EodProcessComponent', () => {
  let component: EodProcessComponent;
  let fixture: ComponentFixture<EodProcessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EodProcessComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EodProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
