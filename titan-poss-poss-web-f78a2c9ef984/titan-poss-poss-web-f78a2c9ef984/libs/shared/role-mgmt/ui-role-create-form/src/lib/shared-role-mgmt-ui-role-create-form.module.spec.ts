import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtUiRoleCreateFormModule } from './shared-role-mgmt-ui-role-create-form.module';

describe('SharedRoleMgmtUiRoleCreateFormModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtUiRoleCreateFormModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtUiRoleCreateFormModule).toBeDefined();
  });
});
