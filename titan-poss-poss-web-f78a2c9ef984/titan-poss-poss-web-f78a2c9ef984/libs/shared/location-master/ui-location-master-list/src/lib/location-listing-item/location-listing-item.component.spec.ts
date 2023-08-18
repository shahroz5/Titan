import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListingItemComponent } from './location-listing-item.component';

describe('LocationListingItemComponent', () => {
  let component: LocationListingItemComponent;
  let fixture: ComponentFixture<LocationListingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationListingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
