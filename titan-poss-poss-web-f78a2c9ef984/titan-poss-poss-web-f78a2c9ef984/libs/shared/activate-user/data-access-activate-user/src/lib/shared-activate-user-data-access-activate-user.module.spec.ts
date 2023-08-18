import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedActivateUserDataAccessActivateUserModule } from './shared-activate-user-data-access-activate-user.module';

describe('SharedActivateUserDataAccessActivateUserModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedActivateUserDataAccessActivateUserModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedActivateUserDataAccessActivateUserModule).toBeDefined();
  });
});
