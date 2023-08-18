import {
  CustomErrors,
  EmpLoanConfigListPayload,
  EmployeeLoanSuccessList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { DeleteEmpLoanConfig, DeleteEmpLoanConfigFailure, DeleteEmpLoanConfigSuccess, EmployeeLoanConfigurationActionTypes, GetEmpLoanConfigList, GetEmpLoanConfigListFailure, GetEmpLoanConfigListSuccess, ResetResponse } from './employee-loan-configuration.actions';
import * as moment from 'moment';


const configListingPayload: EmpLoanConfigListPayload = {
  pageIndex: 0,
  pageSize: 10
};

const empLoanConfigurationList: EmployeeLoanSuccessList = {
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

describe('Emp Loan Action Testing Suite', () => {
  describe('GetEmpLoanConfigList Action Test Cases', () => {
    it('should check correct type is used for  GetEmpLoanConfigList action ', () => {
      const action = new GetEmpLoanConfigList(configListingPayload);

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST
      );

      expect(action.payload).toEqual(configListingPayload);
    });

    it('should check correct type is used for GetEmpLoanConfigListSuccess action ', () => {
      const action = new GetEmpLoanConfigListSuccess(empLoanConfigurationList);

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_SUCCESS
      );
      expect(action.payload).toEqual(empLoanConfigurationList);
    });
    it('should check correct type is used for GetEmpLoanConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetEmpLoanConfigListFailure(payload);

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('DeleteEmpLoanConfig Action Test Cases', () => {
    it('should check correct type is used for  DeleteEmpLoanConfig action ', () => {
      const action = new DeleteEmpLoanConfig('123');

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG
      );

      expect(action.payload).toEqual('123');
    });

    it('should check correct type is used for DeleteEmpLoanConfigSuccess action ', () => {
      const action = new DeleteEmpLoanConfigSuccess(empLoanConfigurationList);

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_SUCCESS
      );
      expect(action.payload).toEqual(empLoanConfigurationList);
    });
    it('should check correct type is used for DeleteEmpLoanConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteEmpLoanConfigFailure(payload);

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetResponse Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new ResetResponse();

      expect(action.type).toEqual(
        EmployeeLoanConfigurationActionTypes.RESET_RESPONSE
      );
    });
  });
});
