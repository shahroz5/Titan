import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMasterHomeFeatureMasterHomeModule } from './shared-master-home-feature-master-home.module';

describe('SharedMasterHomeFeatureMasterHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMasterHomeFeatureMasterHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMasterHomeFeatureMasterHomeModule).toBeDefined();
  });
});
