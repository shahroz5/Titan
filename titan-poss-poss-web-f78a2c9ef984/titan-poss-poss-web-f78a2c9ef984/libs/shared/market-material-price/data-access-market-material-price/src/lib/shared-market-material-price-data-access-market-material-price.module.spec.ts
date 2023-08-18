import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule } from './shared-market-material-price-data-access-market-material-price.module';

describe('SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule
    ).toBeDefined();
  });
});
