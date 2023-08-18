import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpossUnipayConfigurationDataAccessUnipayConfigurationModule } from './eposs-unipay-config-data-access-unipay-config.module';

describe('EpossUnipayConfigurationDataAccessUnipayConfigurationModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossUnipayConfigurationDataAccessUnipayConfigurationModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(
      EpossUnipayConfigurationDataAccessUnipayConfigurationModule
    ).toBeDefined();
  });
});
