import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleMgmtUiRoleEditFormModule } from './shared-role-mgmt-ui-role-edit-form.module';

describe('SharedRoleMgmtUiRoleEditFormModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleMgmtUiRoleEditFormModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleMgmtUiRoleEditFormModule).toBeDefined();
  });
});
