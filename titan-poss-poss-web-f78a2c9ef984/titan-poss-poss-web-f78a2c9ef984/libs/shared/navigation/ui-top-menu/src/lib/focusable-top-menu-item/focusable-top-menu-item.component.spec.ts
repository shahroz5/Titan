import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FocusableTopMenuItemComponent } from './focusable-top-menu-item.component';

describe('FocusableTopMenuItemComponent', () => {
  let component: FocusableTopMenuItemComponent;
  let fixture: ComponentFixture<FocusableTopMenuItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FocusableTopMenuItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusableTopMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
