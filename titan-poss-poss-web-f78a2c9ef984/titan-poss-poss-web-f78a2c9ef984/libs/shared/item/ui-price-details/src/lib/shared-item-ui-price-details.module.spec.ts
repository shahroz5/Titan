import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemUiPriceDetailsModule } from './shared-item-ui-price-details.module';

describe('SharedItemUiPriceDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemUiPriceDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemUiPriceDetailsModule).toBeDefined();
  });
});
