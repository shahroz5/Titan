import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCustomerUiCustomerCreateModule } from './shared-customer-ui-customer-create.module';

describe('SharedCustomerUiCustomerCreateModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomerUiCustomerCreateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomerUiCustomerCreateModule).toBeDefined();
  });
});
