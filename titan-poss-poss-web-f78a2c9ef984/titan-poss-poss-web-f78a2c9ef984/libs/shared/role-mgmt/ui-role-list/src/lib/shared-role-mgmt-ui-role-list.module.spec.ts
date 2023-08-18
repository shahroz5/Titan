import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtUiRoleListModule } from './shared-role-mgmt-ui-role-list.module';

describe('SharedRoleMgmtUiRoleListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtUiRoleListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtUiRoleListModule).toBeDefined();
  });
});
