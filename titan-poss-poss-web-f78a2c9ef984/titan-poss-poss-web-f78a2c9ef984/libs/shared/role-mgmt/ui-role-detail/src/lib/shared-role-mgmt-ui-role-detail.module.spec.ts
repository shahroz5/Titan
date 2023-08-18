import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtUiRoleDetailModule } from './shared-role-mgmt-ui-role-detail.module';

describe('SharedRoleMgmtUiRoleDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtUiRoleDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtUiRoleDetailModule).toBeDefined();
  });
});
