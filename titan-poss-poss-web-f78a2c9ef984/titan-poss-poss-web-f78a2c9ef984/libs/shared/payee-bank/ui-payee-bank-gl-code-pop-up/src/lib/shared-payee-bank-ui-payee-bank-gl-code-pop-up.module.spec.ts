import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPayeeBankUiPayeeBankGlCodePopUpModule } from './shared-payee-bank-ui-payee-bank-gl-code-pop-up.module';

describe('SharedPayeeBankUiPayeeBankGlCodePopUpModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedPayeeBankUiPayeeBankGlCodePopUpModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPayeeBankUiPayeeBankGlCodePopUpModule).toBeDefined();
  });
});
