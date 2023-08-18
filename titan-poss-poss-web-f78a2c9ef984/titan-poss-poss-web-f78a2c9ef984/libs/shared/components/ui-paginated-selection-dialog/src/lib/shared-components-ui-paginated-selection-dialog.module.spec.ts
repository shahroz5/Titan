import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiPaginatedSelectionDialognModule } from './shared-components-ui-paginated-selection-dialog.module';

describe('SharedComponentsUiPaginatedSelectionDialognModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiPaginatedSelectionDialognModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiPaginatedSelectionDialognModule).toBeDefined();
  });
});
