import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigFeatureRoleConfigListingModule } from './shared-role-config-feature-role-config-listing.module';

describe('SharedRoleConfigFeatureRoleConfigListingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigFeatureRoleConfigListingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigFeatureRoleConfigListingModule).toBeDefined();
  });
});
