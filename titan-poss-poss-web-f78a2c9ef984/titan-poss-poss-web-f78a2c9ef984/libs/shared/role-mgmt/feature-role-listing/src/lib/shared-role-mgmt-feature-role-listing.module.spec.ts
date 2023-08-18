import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtFeatureRoleListingModule } from './shared-role-mgmt-feature-role-listing.module';

describe('SharedRoleMgmtFeatureRoleListingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtFeatureRoleListingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtFeatureRoleListingModule).toBeDefined();
  });
});
