import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossSharedUiCourierDetailsPopupModule } from './eposs-shared-ui-courier-details-popup.module';

describe('EpossSharedUiCourierDetailsPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossSharedUiCourierDetailsPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossSharedUiCourierDetailsPopupModule).toBeDefined();
  });
});
