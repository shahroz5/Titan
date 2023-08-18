import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUserMgmtUiUserDetailModule } from './shared-user-mgmt-ui-user-detail.module';

describe('SharedUserMgmtUiUserDetailModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUserMgmtUiUserDetailModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUserMgmtUiUserDetailModule).toBeDefined();
  });
});
