import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankDataAccessPayeeBankModule } from './shared-payee-bank-data-access-payee-bank.module';

describe('SharedPayeeBankDataAccessPayeeBankModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankDataAccessPayeeBankModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankDataAccessPayeeBankModule).toBeDefined();
  });
});
