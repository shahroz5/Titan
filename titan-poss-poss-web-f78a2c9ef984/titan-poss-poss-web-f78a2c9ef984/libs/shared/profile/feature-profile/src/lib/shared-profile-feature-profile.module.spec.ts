import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProfileFeatureProfileModule } from './shared-profile-feature-profile.module';

describe('SharedProfileFeatureProfileModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedProfileFeatureProfileModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedProfileFeatureProfileModule).toBeDefined();
  });
});
