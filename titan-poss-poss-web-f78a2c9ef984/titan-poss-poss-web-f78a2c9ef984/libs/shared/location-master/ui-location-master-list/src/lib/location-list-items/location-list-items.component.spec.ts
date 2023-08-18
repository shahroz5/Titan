import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListItemsComponent } from './location-list-items.component';

describe('LocationListItemsComponent', () => {
  let component: LocationListItemsComponent;
  let fixture: ComponentFixture<LocationListItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationListItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
