import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUtrDetailsButtonComponent } from './add-utr-details-button.component';

describe('AddUtrDetailsButtonComponent', () => {
  let component: AddUtrDetailsButtonComponent;
  let fixture: ComponentFixture<AddUtrDetailsButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUtrDetailsButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUtrDetailsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
