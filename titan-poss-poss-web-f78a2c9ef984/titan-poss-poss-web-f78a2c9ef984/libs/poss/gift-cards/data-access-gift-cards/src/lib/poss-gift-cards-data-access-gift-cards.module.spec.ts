import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossGiftCardsDataAccessGiftCardsModule } from './poss-gift-cards-data-access-gift-cards.module';

describe('PossGiftCardsDataAccessGiftCardsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossGiftCardsDataAccessGiftCardsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossGiftCardsDataAccessGiftCardsModule).toBeDefined();
  });
});
