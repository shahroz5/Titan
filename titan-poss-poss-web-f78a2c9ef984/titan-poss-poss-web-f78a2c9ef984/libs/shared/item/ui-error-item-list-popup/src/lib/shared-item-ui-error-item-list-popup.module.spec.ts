import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiErrorItemListPopupModule } from './shared-item-ui-error-item-list-popup.module';

describe('SharedItemUiErrorItemListPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiErrorItemListPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiErrorItemListPopupModule).toBeDefined();
  });
});
