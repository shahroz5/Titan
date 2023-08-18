import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossGiftCardsFeatureGiftCardsSaleModule } from './poss-gift-cards-feature-gift-cards-sale.module';

describe('PossGiftCardsFeatureGiftCardsSaleModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossGiftCardsFeatureGiftCardsSaleModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossGiftCardsFeatureGiftCardsSaleModule).toBeDefined();
  });
});
