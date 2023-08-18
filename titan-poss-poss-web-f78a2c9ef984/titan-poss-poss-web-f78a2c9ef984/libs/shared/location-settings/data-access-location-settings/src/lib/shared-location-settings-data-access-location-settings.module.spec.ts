import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from './shared-location-settings-data-access-location-settings.module';

describe('SharedLocationSettingsDataAccessLocationSettingsModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedLocationSettingsDataAccessLocationSettingsModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      SharedLocationSettingsDataAccessLocationSettingsModule
    ).toBeDefined();
  });
});
