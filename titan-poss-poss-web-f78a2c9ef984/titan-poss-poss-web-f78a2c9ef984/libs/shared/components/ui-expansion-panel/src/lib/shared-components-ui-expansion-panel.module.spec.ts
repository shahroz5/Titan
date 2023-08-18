import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiExpansionPanelModule } from './shared-components-ui-expansion-panel.module';

describe('SharedComponentsUiExpansionPanelModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiExpansionPanelModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiExpansionPanelModule).toBeDefined();
  });
});
