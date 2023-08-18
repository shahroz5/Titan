import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLocationSettingsFeatureLocationSettingsModule } from './shared-location-settings-feature-location-settings.module';

describe('SharedLocationSettingsFeatureLocationSettingsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedLocationSettingsFeatureLocationSettingsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedLocationSettingsFeatureLocationSettingsModule).toBeDefined();
  });
});
