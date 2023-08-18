import {
  EmpLoanConfigListPayload,
  EmployeeLoanSuccessList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import * as moment from 'moment';
import { DeleteEmpLoanConfig, DeleteEmpLoanConfigFailure, DeleteEmpLoanConfigSuccess, GetEmpLoanConfigList, GetEmpLoanConfigListFailure, GetEmpLoanConfigListSuccess, ResetResponse } from './employee-loan-configuration.actions';
import { EmployeeLoanConfigurationState } from './employee-loan-configuration.state';
import { EmployeeLoanConfigurationReducer, initialState } from './employee-loan-configuration.reducer';

describe('Unipay Access Mapping Reducer Testing Suite', () => {

  const configListingPayload: EmpLoanConfigListPayload = {
    pageIndex: 0,
    pageSize: 10
  };

  const empLoanConfigurationList1: EmployeeLoanSuccessList = {
    configList: [
      {
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
      }
    ],
    count: 1
  };

  const empLoanConfigurationList2: EmployeeLoanSuccessList = {
    configList: [
      {
        id: 'a',
        empName: 'emp1',
        empCode: '5678',
        empMobileNum: '1234567899',
        eligibleAmount: 20000,
        approvalDate: moment(1623456),
        validityDate: moment(1623456),
        applicableCFACodes: '54,72',
        applicableLocationCodes: 'TBO,CPD',
        marginPercentage: 2,
        validationOTP: 1,
        partialRedeemableAmt: 50
      }
    ],
    count: 1
  };

  const accesslistartArray = [
    empLoanConfigurationList1,
    empLoanConfigurationList2
  ];

  describe('Testing empLoanConfigList Functionality', () => {
    it('empLoanConfigList should be called', () => {
      const action = new GetEmpLoanConfigList(configListingPayload);
      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetEmpLoanConfigListSuccess should be called', () => {
      const action = new GetEmpLoanConfigListSuccess(empLoanConfigurationList1);
      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.empLoanConfigList).toBeTruthy();
    });
    it('GetEmpLoanConfigListFailure should be called', () => {
      const action = new GetEmpLoanConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing deleteEmpLoanConfig Functionality', () => {
    it('deleteEmpLoanConfig should be called', () => {
      const action = new DeleteEmpLoanConfig('123');
      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('deleteEmpLoanConfigSuccess should be called', () => {
      const action = new DeleteEmpLoanConfigSuccess(empLoanConfigurationList1);
      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.empLoanConfigList).toBeTruthy();
    });
    it('DeleteEmpLoanConfigFailure should be called', () => {
      const action = new DeleteEmpLoanConfigFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ResetResponse Functionality', () => {
    it('GetEmpLoanConfigList should be called', () => {
      const action = new ResetResponse();
      const result: EmployeeLoanConfigurationState = EmployeeLoanConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });
});
