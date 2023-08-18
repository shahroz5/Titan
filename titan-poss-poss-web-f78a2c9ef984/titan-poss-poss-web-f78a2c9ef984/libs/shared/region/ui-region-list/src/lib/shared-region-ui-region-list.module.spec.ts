import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRegionUiRegionListModule } from './shared-region-ui-region-list.module';

describe('SharedRegionUiRegionListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedRegionUiRegionListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedRegionUiRegionListModule).toBeDefined();
  });
});
