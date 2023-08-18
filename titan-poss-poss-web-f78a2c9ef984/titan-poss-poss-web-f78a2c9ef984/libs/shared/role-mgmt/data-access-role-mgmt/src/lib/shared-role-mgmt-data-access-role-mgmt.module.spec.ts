import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtDataAccessRoleMgmtModule } from './shared-role-mgmt-data-access-role-mgmt.module';

describe('SharedRoleMgmtDataAccessRoleMgmtModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtDataAccessRoleMgmtModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtDataAccessRoleMgmtModule).toBeDefined();
  });
});
