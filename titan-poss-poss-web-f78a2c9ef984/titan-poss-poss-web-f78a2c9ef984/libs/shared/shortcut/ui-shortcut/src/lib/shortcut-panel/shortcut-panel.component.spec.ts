import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutPanelComponent } from './shortcut-panel.component';

describe('ShortcutPanelComponent', () => {
  let component: ShortcutPanelComponent;
  let fixture: ComponentFixture<ShortcutPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
