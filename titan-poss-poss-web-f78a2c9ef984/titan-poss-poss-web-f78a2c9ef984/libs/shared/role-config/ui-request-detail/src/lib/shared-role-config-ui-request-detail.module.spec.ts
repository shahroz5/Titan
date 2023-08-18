import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedRoleConfigUiRequestDetailModule } from './shared-role-config-ui-request-detail.module';

describe('SharedRoleConfigUiRequestDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedRoleConfigUiRequestDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedRoleConfigUiRequestDetailModule).toBeDefined();
  });
});
