import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProfileUiVerifyMobileModule } from './shared-profile-ui-verify-mobile.module';

describe('SharedProfileUiVerifyMobileModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedProfileUiVerifyMobileModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedProfileUiVerifyMobileModule).toBeDefined();
  });
});
