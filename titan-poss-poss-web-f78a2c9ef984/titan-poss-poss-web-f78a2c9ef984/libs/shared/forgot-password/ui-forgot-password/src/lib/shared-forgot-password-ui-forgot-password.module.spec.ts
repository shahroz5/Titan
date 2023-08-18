import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedForgotPasswordUiForgotPasswordModule } from './shared-forgot-password-ui-forgot-password.module';

describe('SharedForgotPasswordUiForgotPasswordModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedForgotPasswordUiForgotPasswordModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedForgotPasswordUiForgotPasswordModule).toBeDefined();
  });
});
