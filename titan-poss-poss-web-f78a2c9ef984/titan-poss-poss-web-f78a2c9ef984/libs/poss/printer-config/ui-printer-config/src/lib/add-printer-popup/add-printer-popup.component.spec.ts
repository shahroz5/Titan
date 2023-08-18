import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPrinterPopupComponent } from './add-printer-popup.component';

describe('AddPrinterPopupComponent', () => {
  let component: AddPrinterPopupComponent;
  let fixture: ComponentFixture<AddPrinterPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPrinterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrinterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
