import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TepExceptionPopupComponent } from './tep-exception-popup.component';

describe('TepExceptionPopupComponent', () => {
  let component: TepExceptionPopupComponent;
  let fixture: ComponentFixture<TepExceptionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TepExceptionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TepExceptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
