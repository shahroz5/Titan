import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtgsRefundModeComponent } from './rtgs-refund-mode.component';

describe('RtgsRefundModeComponent', () => {
  let component: RtgsRefundModeComponent;
  let fixture: ComponentFixture<RtgsRefundModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtgsRefundModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtgsRefundModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
