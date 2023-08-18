import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedRoleConfigDataAccessRoleConfigModule } from './shared-role-config-data-access-role-config.module';

describe('SharedRoleConfigDataAccessRoleConfigModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigDataAccessRoleConfigModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigDataAccessRoleConfigModule).toBeDefined();
  });
});
