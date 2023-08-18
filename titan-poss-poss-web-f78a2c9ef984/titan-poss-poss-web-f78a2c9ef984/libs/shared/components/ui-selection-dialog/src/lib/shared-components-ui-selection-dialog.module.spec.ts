import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiSelectionDialogModule } from './shared-components-ui-selection-dialog.module';

describe('SharedComponentsUiSelectionDialogModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiSelectionDialogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiSelectionDialogModule).toBeDefined();
  });
});
