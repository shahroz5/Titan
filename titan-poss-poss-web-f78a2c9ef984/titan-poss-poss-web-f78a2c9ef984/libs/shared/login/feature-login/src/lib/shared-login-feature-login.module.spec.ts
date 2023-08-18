import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLoginFeatureLoginModule } from './shared-login-feature-login.module';

describe('SharedLoginFeatureLoginModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedLoginFeatureLoginModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedLoginFeatureLoginModule).toBeDefined();
  });
});
