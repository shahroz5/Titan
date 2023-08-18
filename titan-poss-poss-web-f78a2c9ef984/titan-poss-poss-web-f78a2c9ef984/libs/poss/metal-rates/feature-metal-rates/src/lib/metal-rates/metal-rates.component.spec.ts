import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MetalRatesComponent } from './metal-rates.component';

describe('MetalRatesComponent', () => {
  let component: MetalRatesComponent;
  let fixture: ComponentFixture<MetalRatesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MetalRatesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
