import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcRefundModeComponent } from './cc-refund-mode.component';

describe('CcRefundModeComponent', () => {
  let component: CcRefundModeComponent;
  let fixture: ComponentFixture<CcRefundModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcRefundModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcRefundModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
