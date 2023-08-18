import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FocusableSubMenuItemComponent } from './focusable-sub-menu-item.component';

describe('FocusableSubMenuItemComponent', () => {
  let component: FocusableSubMenuItemComponent;
  let fixture: ComponentFixture<FocusableSubMenuItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FocusableSubMenuItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusableSubMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
