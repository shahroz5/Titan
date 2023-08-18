import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossConversionFeatureConversionHistoryDetailsModule } from './eposs-conversion-feature-conversion-history-details.module';

describe('EpossConversionFeatureConversionHistoryDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossConversionFeatureConversionHistoryDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossConversionFeatureConversionHistoryDetailsModule).toBeDefined();
  });
});
