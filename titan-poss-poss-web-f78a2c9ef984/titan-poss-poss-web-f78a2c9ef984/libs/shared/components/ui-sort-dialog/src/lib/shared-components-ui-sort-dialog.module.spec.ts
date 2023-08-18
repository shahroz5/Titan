import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiSortDialogModule } from './shared-components-ui-sort-dialog.module';

describe('SharedComponentsUiSortDialogModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiSortDialogModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiSortDialogModule).toBeDefined();
  });
});
