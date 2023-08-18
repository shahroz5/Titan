import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedAppsettingFeatureAppsettingModule } from './shared-appsetting-feature-appsetting.module';

describe('SharedAppsettingFeatureAppsettingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAppsettingFeatureAppsettingModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAppsettingFeatureAppsettingModule).toBeDefined();
  });
});
