import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRegionDataAccessRegionModule } from './shared-region-data-access-region.module';

describe('SharedRegionDataAccessRegionModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedRegionDataAccessRegionModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedRegionDataAccessRegionModule).toBeDefined();
  });
});
