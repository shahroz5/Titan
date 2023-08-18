import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsSelectionPopUpComponent } from './discounts-selection-pop-up.component';

describe('DiscountsSelectionPopUpComponent', () => {
  let component: DiscountsSelectionPopUpComponent;
  let fixture: ComponentFixture<DiscountsSelectionPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountsSelectionPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsSelectionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
