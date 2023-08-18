import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedAuthFeatureAuthModule } from './shared-auth-feature-auth.module';

describe('SharedAuthFeatureAuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAuthFeatureAuthModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAuthFeatureAuthModule).toBeDefined();
  });
});
