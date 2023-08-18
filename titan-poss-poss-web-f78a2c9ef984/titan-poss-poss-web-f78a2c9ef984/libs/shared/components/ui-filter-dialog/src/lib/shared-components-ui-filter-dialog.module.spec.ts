import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiFilterDialogModule } from './shared-components-ui-filter-dialog.module';

describe('SharedComponentsUiFilterDialogModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiFilterDialogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiFilterDialogModule).toBeDefined();
  });
});
