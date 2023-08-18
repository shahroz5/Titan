import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TepValidationListingComponent } from './tep-validation-listing.component';

describe('TepValidationListingComponent', () => {
  let component: TepValidationListingComponent;
  let fixture: ComponentFixture<TepValidationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TepValidationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TepValidationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
