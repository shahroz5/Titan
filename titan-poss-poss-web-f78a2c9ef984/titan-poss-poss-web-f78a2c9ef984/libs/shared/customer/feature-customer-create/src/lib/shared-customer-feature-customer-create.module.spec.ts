import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCustomerFeatureCustomerCreateModule } from './shared-customer-feature-customer-create.module';

describe('SharedCustomerFeatureCustomerCreateModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomerFeatureCustomerCreateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomerFeatureCustomerCreateModule).toBeDefined();
  });
});
