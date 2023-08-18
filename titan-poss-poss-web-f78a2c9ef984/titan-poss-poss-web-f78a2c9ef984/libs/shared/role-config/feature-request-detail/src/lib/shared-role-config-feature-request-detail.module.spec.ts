import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigFeatureRequestDetailModule } from './shared-role-config-feature-request-detail.module';

describe('SharedRoleConfigFeatureRequestDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigFeatureRequestDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigFeatureRequestDetailModule).toBeDefined();
  });
});
