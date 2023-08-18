import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUamHomeFeatureUamHomeModule } from './shared-uam-home-feature-uam-home.module';

describe('SharedUamHomeFeatureUamHomeModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedUamHomeFeatureUamHomeModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedUamHomeFeatureUamHomeModule).toBeDefined();
  });
});
