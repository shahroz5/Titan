import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCustomerFeatureCustomerSummaryModule } from './shared-customer-feature-customer-summary.module';

describe('SharedCustomerFeatureCustomerSummaryModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomerFeatureCustomerSummaryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomerFeatureCustomerSummaryModule).toBeDefined();
  });
});
