import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigFeatureRequestListingModule } from './shared-role-config-feature-request-listing.module';

describe('SharedRoleConfigFeatureRequestListingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigFeatureRequestListingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigFeatureRequestListingModule).toBeDefined();
  });
});
