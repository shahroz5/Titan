import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigUiRequestListModule } from './shared-role-config-ui-request-list.module';

describe('SharedRoleConfigUiRequestListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigUiRequestListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigUiRequestListModule).toBeDefined();
  });
});
