import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotNumberSelectionPopupComponent } from './lot-number-selection-popup.component';

describe('LotNumberSelectionPopupComponent', () => {
  let component: LotNumberSelectionPopupComponent;
  let fixture: ComponentFixture<LotNumberSelectionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotNumberSelectionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotNumberSelectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
