import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedSubRegionUiSubRegionListModule } from './shared-sub-region-ui-sub-region-list.module';

describe('SharedSubRegionUiSubRegionListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedSubRegionUiSubRegionListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedSubRegionUiSubRegionListModule).toBeDefined();
  });
});
