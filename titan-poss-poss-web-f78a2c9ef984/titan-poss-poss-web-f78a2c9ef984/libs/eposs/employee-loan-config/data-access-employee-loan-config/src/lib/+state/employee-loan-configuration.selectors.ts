import { createSelector } from '@ngrx/store';
import { empLoanConfigSelector } from './employee-loan-configuration.entity';
import { empLoanConfigurationState } from './employee-loan-configuration.reducer';

const empLoanConfigList = createSelector(
  empLoanConfigurationState,
  state => state.empLoanConfigList
);
const selectEmpLoanConfigList = createSelector(
  empLoanConfigList,
  empLoanConfigSelector.selectAll
);

const selectTotalElements = createSelector(
  empLoanConfigurationState,
  state => state.totalCount
);

const selectconfigListUpdated = createSelector(
  empLoanConfigurationState,
  state => state.configListUpdated
);

const selectHasError = createSelector(
  empLoanConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  empLoanConfigurationState,
  state => state.isLoading
);
export const EmployeeLoanConfigurationSelectors = {
  selectHasError,
  selectIsLoading,
  selectEmpLoanConfigList,
  selectTotalElements,
  selectconfigListUpdated
};
