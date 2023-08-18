import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPriceGroupUiPriceGroupListModule } from './shared-price-group-ui-price-group-list.module';

describe('SharedPriceGroupUiPriceGroupListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPriceGroupUiPriceGroupListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPriceGroupUiPriceGroupListModule).toBeDefined();
  });
});
