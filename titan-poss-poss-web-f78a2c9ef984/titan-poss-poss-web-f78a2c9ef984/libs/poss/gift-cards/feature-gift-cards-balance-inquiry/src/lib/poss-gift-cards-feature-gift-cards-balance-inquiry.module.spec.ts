import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossGiftCardsFeatureGiftCardsBalanceInquiryModule } from './poss-gift-cards-feature-gift-cards-balance-inquiry.module';

describe('PossGiftCardsFeatureGiftCardsBalanceInquiryModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossGiftCardsFeatureGiftCardsBalanceInquiryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossGiftCardsFeatureGiftCardsBalanceInquiryModule).toBeDefined();
  });
});
