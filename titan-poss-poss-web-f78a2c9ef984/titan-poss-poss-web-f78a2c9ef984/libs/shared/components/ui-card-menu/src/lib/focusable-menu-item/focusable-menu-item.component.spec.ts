import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FocusableMenuItemComponent } from './focusable-menu-item.component';

describe('FocusableMenuItemComponent', () => {
  let component: FocusableMenuItemComponent;
  let fixture: ComponentFixture<FocusableMenuItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FocusableMenuItemComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusableMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
