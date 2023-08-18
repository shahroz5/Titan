import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankFeaturePayeeBankListingModule } from './shared-payee-bank-feature-payee-bank-listing.module';

describe('SharedPayeeBankFeaturePayeeBankListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankFeaturePayeeBankListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankFeaturePayeeBankListingModule).toBeDefined();
  });
});
