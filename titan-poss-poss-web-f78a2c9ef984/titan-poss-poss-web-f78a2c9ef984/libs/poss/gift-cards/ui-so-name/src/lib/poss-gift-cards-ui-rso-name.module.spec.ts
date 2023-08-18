import { waitForAsync, TestBed } from '@angular/core/testing';
import { PossGiftCardsUiRsoNameModule } from './poss-gift-cards-ui-rso-name.module';

describe('PossGiftCardsUiRSoNameModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PossGiftCardsUiRsoNameModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PossGiftCardsUiRsoNameModule).toBeDefined();
  });
});
