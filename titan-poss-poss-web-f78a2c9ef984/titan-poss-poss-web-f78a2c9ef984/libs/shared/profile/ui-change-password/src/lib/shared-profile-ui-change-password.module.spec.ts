import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProfileUiChangePasswordModule } from './shared-profile-ui-change-password.module';

describe('SharedProfileUiChangePasswordModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedProfileUiChangePasswordModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedProfileUiChangePasswordModule).toBeDefined();
  });
});
