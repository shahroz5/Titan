import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCustomerUiCustomerSearchModule } from './shared-customer-ui-customer-search.module';

describe('SharedCustomerUiCustomerSearchModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomerUiCustomerSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomerUiCustomerSearchModule).toBeDefined();
  });
});
