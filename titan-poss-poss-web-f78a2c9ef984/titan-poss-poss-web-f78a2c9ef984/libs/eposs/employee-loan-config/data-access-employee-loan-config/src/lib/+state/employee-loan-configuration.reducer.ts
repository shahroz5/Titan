import { createFeatureSelector } from '@ngrx/store';
import { EmployeeLoanConfigurationState } from './employee-loan-configuration.state';
import { empLoanConfigAdapter } from './employee-loan-configuration.entity';
import { EmployeeLoanConfigurationActions, EmployeeLoanConfigurationActionTypes } from './employee-loan-configuration.actions';

export const empLoanConfigurationKey = 'empLoanConfiguration';

export const empLoanConfigurationState = createFeatureSelector<
  EmployeeLoanConfigurationState
>(empLoanConfigurationKey);

export const initialState: EmployeeLoanConfigurationState = {
  fileUploadResponse: null,
  configListUpdated: false,
  empLoanConfigList: empLoanConfigAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  errorLog: null
};

export function EmployeeLoanConfigurationReducer(
  state: EmployeeLoanConfigurationState = initialState,
  action: EmployeeLoanConfigurationActions
): EmployeeLoanConfigurationState {
  switch (action.type) {
    case EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST:
    case EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        configListUpdated: false
      };

    case EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_FAILURE:
    case EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false,
        configListUpdated: false
      };

    case EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        empLoanConfigList: empLoanConfigAdapter.setAll(
          action.payload.configList,
          state.empLoanConfigList
        ),
        totalCount: action.payload.count,
        isLoading: false,
        hasError: null
      };
    case EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG_SUCCESS:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        configListUpdated: true
      };

    case EmployeeLoanConfigurationActionTypes.RESET_RESPONSE:
      return {
        ...state,
        fileUploadResponse: null,
        empLoanConfigList: empLoanConfigAdapter.getInitialState(),
        totalCount: 0,
        configListUpdated: false,
        hasError: null,
        isLoading: false
      };

    default:
      return {
        ...state
      };
  }
}
