import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbFocPopupComponent } from './ab-foc-popup.component';

describe('AbFocPopupComponent', () => {
  let component: AbFocPopupComponent;
  let fixture: ComponentFixture<AbFocPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbFocPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbFocPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
