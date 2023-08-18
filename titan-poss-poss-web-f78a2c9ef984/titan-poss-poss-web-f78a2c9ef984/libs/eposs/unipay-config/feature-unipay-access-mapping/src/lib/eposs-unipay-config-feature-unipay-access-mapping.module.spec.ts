import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossUnipayConfigurationFeatureUnipayAccessMappingModule } from './eposs-unipay-config-feature-unipay-access-mapping.module';

describe('EpossUnipayConfigurationFeatureUnipayAccessMappingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossUnipayConfigurationFeatureUnipayAccessMappingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      EpossUnipayConfigurationFeatureUnipayAccessMappingModule
    ).toBeDefined();
  });
});
