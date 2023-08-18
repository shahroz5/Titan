import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtShellFeatureShellRoleMgmtModule } from './shared-role-mgmt-shell-feature-shell-role-mgmt.module';

describe('SharedRoleMgmtShellFeatureShellRoleMgmtModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtShellFeatureShellRoleMgmtModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtShellFeatureShellRoleMgmtModule).toBeDefined();
  });
});
