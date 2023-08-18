import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUserMgmtFeatureUserDetailModule } from './shared-user-mgmt-feature-user-detail.module';

describe('SharedUserMgmtFeatureUserDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUserMgmtFeatureUserDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUserMgmtFeatureUserDetailModule).toBeDefined();
  });
});
