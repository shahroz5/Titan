import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankFeaturePayeeBankDetailModule } from './shared-payee-bank-feature-payee-bank-detail.module';

describe('SharedPayeeBankFeaturePayeeBankDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankFeaturePayeeBankDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankFeaturePayeeBankDetailModule).toBeDefined();
  });
});
