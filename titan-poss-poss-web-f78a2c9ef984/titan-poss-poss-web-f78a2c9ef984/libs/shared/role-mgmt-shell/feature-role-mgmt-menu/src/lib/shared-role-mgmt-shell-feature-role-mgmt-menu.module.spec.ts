import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtShellFeatureRoleMgmtMenuModule } from './shared-role-mgmt-shell-feature-role-mgmt-menu.module';

describe('SharedRoleMgmtShellFeatureRoleMgmtMenuModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtShellFeatureRoleMgmtMenuModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtShellFeatureRoleMgmtMenuModule).toBeDefined();
  });
});
