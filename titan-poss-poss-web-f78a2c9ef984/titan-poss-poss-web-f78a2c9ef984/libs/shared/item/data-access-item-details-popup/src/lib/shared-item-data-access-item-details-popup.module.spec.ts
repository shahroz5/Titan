import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemDataAccessItemDetailsPopupModule } from './shared-item-data-access-item-details-popup.module';

describe('SharedItemDataAccessItemDetailsPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemDataAccessItemDetailsPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemDataAccessItemDetailsPopupModule).toBeDefined();
  });
});
