import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossConfigurationHomeFeatureConfigurationHomeModule } from './eposs-configuration-home-feature-configuration-home.module';

describe('EpossConfigurationHomeFeatureConfigurationHomeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossConfigurationHomeFeatureConfigurationHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossConfigurationHomeFeatureConfigurationHomeModule).toBeDefined();
  });
});
