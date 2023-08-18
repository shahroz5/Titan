import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedActivateUserFeatureActivateUserModule } from './shared-activate-user-feature-activate-user.module';

describe('SharedActivateUserFeatureActivateUserModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedActivateUserFeatureActivateUserModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedActivateUserFeatureActivateUserModule).toBeDefined();
  });
});
