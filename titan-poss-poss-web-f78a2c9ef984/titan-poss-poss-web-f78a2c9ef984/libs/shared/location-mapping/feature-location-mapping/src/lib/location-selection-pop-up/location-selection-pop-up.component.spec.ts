import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectionPopUpComponent } from './location-selection-pop-up.component';

describe('LocationSelectionPopUpComponent', () => {
  let component: LocationSelectionPopUpComponent;
  let fixture: ComponentFixture<LocationSelectionPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSelectionPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
