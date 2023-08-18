import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankUiPayeeBankDetailModule } from './shared-payee-bank-ui-payee-bank-detail.module';

describe('SharedPayeeBankUiPayeeBankDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankUiPayeeBankDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankUiPayeeBankDetailModule).toBeDefined();
  });
});
