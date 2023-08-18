import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedUserMgmtDataAccessUserModule } from './shared-user-mgmt-data-access-user.module';

describe('SharedUserMgmtDataAccessUserModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUserMgmtDataAccessUserModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUserMgmtDataAccessUserModule).toBeDefined();
  });
});
