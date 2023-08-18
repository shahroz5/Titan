import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCustomerDataAccessCustomerModule } from './shared-customer-data-access-customer.module';

describe('SharedCustomerDataAccessCustomerModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomerDataAccessCustomerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomerDataAccessCustomerModule).toBeDefined();
  });
});
