import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNavigationFeatureNavigationModule } from './shared-navigation-feature-navigation.module';

describe('SharedNavigationFeatureNavigationModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedNavigationFeatureNavigationModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedNavigationFeatureNavigationModule).toBeDefined();
  });
});
