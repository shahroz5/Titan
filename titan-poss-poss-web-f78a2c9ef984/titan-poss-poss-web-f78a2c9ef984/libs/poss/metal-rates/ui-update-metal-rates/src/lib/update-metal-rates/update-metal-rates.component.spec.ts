import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateMetalRatesComponent } from './update-metal-rates.component';

describe('UpdateMetalRatesComponent', () => {
  let component: UpdateMetalRatesComponent;
  let fixture: ComponentFixture<UpdateMetalRatesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UpdateMetalRatesComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMetalRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
