import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPriceGroupDataAccessPriceGroupModule } from './shared-price-group-data-access-price-group.module';

describe('SharedPriceGroupDataAccessPriceGroupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPriceGroupDataAccessPriceGroupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPriceGroupDataAccessPriceGroupModule).toBeDefined();
  });
});
