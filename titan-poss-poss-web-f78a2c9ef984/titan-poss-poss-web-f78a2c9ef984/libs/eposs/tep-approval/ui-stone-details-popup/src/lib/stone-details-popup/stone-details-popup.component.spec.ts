import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoneDetailsPopupComponent } from './stone-details-popup.component';

describe('StoneDetailsPopupComponent', () => {
  let component: StoneDetailsPopupComponent;
  let fixture: ComponentFixture<StoneDetailsPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoneDetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
