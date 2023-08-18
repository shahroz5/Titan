import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanFormVerifyComponent } from './pan-form-verify.component';

describe('PanFormVerifyComponent', () => {
  let component: PanFormVerifyComponent;
  let fixture: ComponentFixture<PanFormVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanFormVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanFormVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
