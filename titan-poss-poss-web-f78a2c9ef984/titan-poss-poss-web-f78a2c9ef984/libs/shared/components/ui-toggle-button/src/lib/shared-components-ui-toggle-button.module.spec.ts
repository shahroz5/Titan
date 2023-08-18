import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiToggleButtonModule } from './shared-components-ui-toggle-button.module';

describe('SharedComponentsUiToggleButtonModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiToggleButtonModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiToggleButtonModule).toBeDefined();
  });
});
