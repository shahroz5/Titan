import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BodProcessComponent } from './bod-process.component';

describe('BodProcessComponent', () => {
  let component: BodProcessComponent;
  let fixture: ComponentFixture<BodProcessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BodProcessComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BodProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
