import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUserMgmtUiUserListModule } from './shared-user-mgmt-ui-user-list.module';

describe('SharedUserMgmtUiUserListModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUserMgmtUiUserListModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUserMgmtUiUserListModule).toBeDefined();
  });
});
