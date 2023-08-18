import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdatePrinterPopupComponent } from './update-printer-popup.component';

describe('UpdatePrinterPopupComponent', () => {
  let component: UpdatePrinterPopupComponent;
  let fixture: ComponentFixture<UpdatePrinterPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePrinterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePrinterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
