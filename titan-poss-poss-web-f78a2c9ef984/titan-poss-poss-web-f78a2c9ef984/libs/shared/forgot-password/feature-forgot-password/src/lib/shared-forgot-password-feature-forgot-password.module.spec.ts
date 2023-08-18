import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedForgotPasswordFeatureForgotPasswordModule } from './shared-forgot-password-feature-forgot-password.module';

describe('SharedForgotPasswordFeatureForgotPasswordModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedForgotPasswordFeatureForgotPasswordModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedForgotPasswordFeatureForgotPasswordModule).toBeDefined();
  });
});
