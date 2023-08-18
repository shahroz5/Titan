import {
  CustomErrors,
  EmployeeLoanConfigList
} from '@poss-web/shared/models';
import { initialState } from './employee-loan-configuration.reducer';
import * as selectors from './employee-loan-configuration.selectors';
import * as moment from 'moment';
import { EmployeeLoanConfigurationState } from './employee-loan-configuration.state';
import { EmployeeLoanConfigEntity } from './employee-loan-configuration.entity';

describe('Employee Loan Selector Testing Suite', () => {

  const empLoanConfig1: EmployeeLoanConfigList = {
    id: 'a',
    empName: 'emp1',
    empCode: '1234',
    empMobileNum: '1234567899',
    eligibleAmount: 20000,
    approvalDate: moment(1623456),
    validityDate: moment(1623456),
    applicableCFACodes: '54,72',
    applicableLocationCodes: 'TBO,CPD',
    marginPercentage: 2,
    validationOTP: 1,
    partialRedeemableAmt: 50
  };

  const empLoanConfig2: EmployeeLoanConfigList = {
    id: 'a',
    empName: 'emp1',
    empCode: '1234',
    empMobileNum: '1234567899',
    eligibleAmount: 20000,
    approvalDate: moment(1623456),
    validityDate: moment(1623456),
    applicableCFACodes: '54,72',
    applicableLocationCodes: 'TBO,CPD',
    marginPercentage: 2,
    validationOTP: 1,
    partialRedeemableAmt: 50
  };

  const empLoanConfigListArray = [empLoanConfig1, empLoanConfig2];

  const addAccessListToEntities = <T extends EmployeeLoanConfigList>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const accessElemets: EmployeeLoanConfigEntity = {
    ids: [empLoanConfig1.id, empLoanConfig2.id],
    entities: addAccessListToEntities(empLoanConfigListArray)
  };

  describe('Testing Employee Loan Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: EmployeeLoanConfigurationState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.EmployeeLoanConfigurationSelectors.selectHasError.projector(
          state
        )
      ).toEqual(error);
    });
    it('Should return selectAccessList', () => {
      expect(
        selectors.EmployeeLoanConfigurationSelectors.selectEmpLoanConfigList.projector(
          accessElemets
        )
      ).toEqual(empLoanConfigListArray);
    });

    it('Should return selectTotalElements', () => {
      const state: EmployeeLoanConfigurationState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.EmployeeLoanConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return isLoading selector', () => {
      const state: EmployeeLoanConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.EmployeeLoanConfigurationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
