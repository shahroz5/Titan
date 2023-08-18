import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsSelectionGridComponent } from './discounts-selection-grid.component';

describe('DiscountsSelectionGridComponent', () => {
  let component: DiscountsSelectionGridComponent;
  let fixture: ComponentFixture<DiscountsSelectionGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountsSelectionGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsSelectionGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
