import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SortItem,
  EmpLoanConfigListPayload,
  EmployeeLoanSuccessList
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum EmployeeLoanConfigurationActionTypes {
  GET_EMP_LOAN_CONFIG_LIST = '[emp-loan-configuration] Get Employee Loan Config List',
  GET_EMP_LOAN_CONFIG_LIST_SUCCESS = '[emp-loan-configuration] Get Employee Loan Config List Success',
  GET_EMP_LOAN_CONFIG_LIST_FAILURE = '[emp-loan-configuration] Get Employee Loan Config List Failure',

  DELETE_EMP_LOAN_CONFIG = '[emp-loan-configuration] Delete Employee Loan Config',
  DELETE_EMP_LOAN_CONFIG_SUCCESS = '[emp-loan-configuration] Delete Employee Loan Config Success',
  DELETE_EMP_LOAN_CONFIG_FAILURE = '[emp-loan-configuration] Delete Employee Loan Config Failure',

  RESET_RESPONSE = '[emp-loan-configuration] Reset Response'
}

export class GetEmpLoanConfigList implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST;
  constructor(
    public payload: EmpLoanConfigListPayload,
    public sortField?: SortItem,
  ) {}
}
export class GetEmpLoanConfigListSuccess implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_SUCCESS;
  constructor(public payload: EmployeeLoanSuccessList) {}
}
export class GetEmpLoanConfigListFailure implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteEmpLoanConfig implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG;
  constructor(
    public payload: string,
  ) {}
}
export class DeleteEmpLoanConfigSuccess implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_SUCCESS;
  constructor(public payload: EmployeeLoanSuccessList) {}
}
export class DeleteEmpLoanConfigFailure implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = EmployeeLoanConfigurationActionTypes.RESET_RESPONSE;
}

export type EmployeeLoanConfigurationActions =
  | ResetResponse
  | GetEmpLoanConfigList
  | GetEmpLoanConfigListFailure
  | GetEmpLoanConfigListSuccess
  | DeleteEmpLoanConfig
  | DeleteEmpLoanConfigSuccess
  | DeleteEmpLoanConfigFailure;
