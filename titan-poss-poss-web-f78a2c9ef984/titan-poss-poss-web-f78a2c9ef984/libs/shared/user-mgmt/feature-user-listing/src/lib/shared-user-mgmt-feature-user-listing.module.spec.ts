import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUserMgmtFeatureUserListingModule } from './shared-user-mgmt-feature-user-listing.module';

describe('SharedUserMgmtFeatureUserListingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUserMgmtFeatureUserListingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUserMgmtFeatureUserListingModule).toBeDefined();
  });
});
