import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRegionUiRegionDetailModule } from './shared-region-ui-region-detail.module';

describe('SharedRegionUiRegionDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedRegionUiRegionDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedRegionUiRegionDetailModule).toBeDefined();
  });
});
