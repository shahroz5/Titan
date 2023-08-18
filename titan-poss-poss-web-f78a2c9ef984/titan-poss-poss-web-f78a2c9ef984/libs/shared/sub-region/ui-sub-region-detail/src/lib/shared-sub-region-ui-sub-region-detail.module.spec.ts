import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedSubRegionUiSubRegionDetailModule } from './shared-sub-region-ui-sub-region-detail.module';

describe('SharedSubRegionUiSubRegionDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedSubRegionUiSubRegionDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedSubRegionUiSubRegionDetailModule).toBeDefined();
  });
});
