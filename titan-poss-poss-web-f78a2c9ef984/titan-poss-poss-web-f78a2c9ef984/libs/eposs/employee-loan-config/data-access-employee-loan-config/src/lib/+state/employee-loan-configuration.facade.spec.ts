import { TestBed } from '@angular/core/testing';
import { EmployeeLoanConfigurationFacade } from './employee-loan-configuration.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { EmployeeLoanConfigurationState } from './employee-loan-configuration.state';
import { empLoanConfigAdapter } from './employee-loan-configuration.entity';

describe('Employee Loan Config facade Testing Suite action', () => {
  const initialState: EmployeeLoanConfigurationState = {
    fileUploadResponse: null,
    configListUpdated: false,
    empLoanConfigList: empLoanConfigAdapter.getInitialState(),
    hasError: null,
    isLoading: false,
    totalCount: 0,
    errorLog: null
  };

  let empLoanConfigurationFacade: EmployeeLoanConfigurationFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        EmployeeLoanConfigurationFacade
      ]
    });

    empLoanConfigurationFacade = TestBed.inject(
      EmployeeLoanConfigurationFacade
    );
  });

  describe('Access Selector action', () => {
    it('should get getTotalElements data', () => {
      expect(empLoanConfigurationFacade.getTotalElements()).toBeTruthy();
    });
    it('should get getHasError data', () => {
      expect(empLoanConfigurationFacade.getError()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(empLoanConfigurationFacade.getIsLoading()).toBeTruthy();
    });
    it('should get empLoanConfig data', () => {
      expect(empLoanConfigurationFacade.GetEmpLoanConfigList()).toBeTruthy();
    });
    it('should get deleteEmpLoanConfig data', () => {
      expect(empLoanConfigurationFacade.deleteEmpLoanConfig('123')).toBeUndefined();
    });
  });
});
