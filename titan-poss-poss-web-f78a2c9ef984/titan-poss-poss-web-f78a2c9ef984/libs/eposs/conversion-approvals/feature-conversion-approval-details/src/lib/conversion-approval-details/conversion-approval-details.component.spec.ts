import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionApprovalDetailsComponent } from './conversion-approval-details.component';

describe('ConversionApprovalDetailsComponent', () => {
  let component: ConversionApprovalDetailsComponent;
  let fixture: ComponentFixture<ConversionApprovalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionApprovalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
