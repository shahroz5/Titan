import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankUiPayeeBankListModule } from './shared-payee-bank-ui-payee-bank-list.module';

describe('SharedPayeeBankUiPayeeBankListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankUiPayeeBankListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankUiPayeeBankListModule).toBeDefined();
  });
});
