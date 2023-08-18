import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionApprovalsFiltersComponent } from './conversion-approvals-filters.component';

describe('ConversionApprovalsFiltersComponent', () => {
  let component: ConversionApprovalsFiltersComponent;
  let fixture: ComponentFixture<ConversionApprovalsFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversionApprovalsFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionApprovalsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
