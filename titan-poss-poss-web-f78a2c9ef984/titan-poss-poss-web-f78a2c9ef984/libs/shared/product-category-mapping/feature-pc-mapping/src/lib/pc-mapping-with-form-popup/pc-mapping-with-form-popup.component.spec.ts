import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcMappingWithFormPopupComponent } from './pc-mapping-with-form-popup.component';

describe('PcMappingWithFormPopupComponent', () => {
  let component: PcMappingWithFormPopupComponent;
  let fixture: ComponentFixture<PcMappingWithFormPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcMappingWithFormPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcMappingWithFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
