import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigUiRoleConfigListModule } from './shared-role-config-ui-role-config-list.module';

describe('SharedRoleConfigUiRoleConfigListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigUiRoleConfigListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigUiRoleConfigListModule).toBeDefined();
  });
});
