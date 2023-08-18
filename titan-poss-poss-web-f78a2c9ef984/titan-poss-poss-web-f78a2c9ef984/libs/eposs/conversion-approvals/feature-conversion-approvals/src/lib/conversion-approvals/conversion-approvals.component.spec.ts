import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionApprovalsComponent } from './conversion-approvals.component';

describe('ConversionApprovalsComponent', () => {
  let component: ConversionApprovalsComponent;
  let fixture: ComponentFixture<ConversionApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
