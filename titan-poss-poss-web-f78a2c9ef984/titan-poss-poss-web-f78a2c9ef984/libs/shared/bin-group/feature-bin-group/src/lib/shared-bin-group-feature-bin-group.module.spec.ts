import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBinGroupFeatureBinGroupModule } from './shared-bin-group-feature-bin-group.module';

describe('SharedBinGroupFeatureBinGroupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBinGroupFeatureBinGroupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBinGroupFeatureBinGroupModule).toBeDefined();
  });
});
