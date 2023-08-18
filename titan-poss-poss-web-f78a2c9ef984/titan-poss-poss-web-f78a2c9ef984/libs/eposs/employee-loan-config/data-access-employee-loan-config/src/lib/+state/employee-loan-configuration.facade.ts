import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as EmployeeLoanConfigurationActions from './employee-loan-configuration.actions';
import {
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';
import { EmployeeLoanConfigurationState } from './employee-loan-configuration.state';
import { EmployeeLoanConfigurationSelectors } from './employee-loan-configuration.selectors';

@Injectable()
export class EmployeeLoanConfigurationFacade {
  constructor(private store: Store<EmployeeLoanConfigurationState>) {}

  private empLoanConfigList$ = this.store.select(
    EmployeeLoanConfigurationSelectors.selectEmpLoanConfigList
  );
  private totalElements$ = this.store.select(
    EmployeeLoanConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    EmployeeLoanConfigurationSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    EmployeeLoanConfigurationSelectors.selectIsLoading
  );

  private configListUpdated$ = this.store.select(
    EmployeeLoanConfigurationSelectors.selectconfigListUpdated
  );

  /**
   * Access for state selectors
   */

  loadEmpLoanConfigList(
    payload: ListingPayload,
    sortField?: SortItem,
  ) {
    this.store.dispatch(
      new EmployeeLoanConfigurationActions.GetEmpLoanConfigList(
        payload,
        sortField
      )
    );
  }

  deleteEmpLoanConfig(id: string) {
    this.store.dispatch(
      new EmployeeLoanConfigurationActions.DeleteEmpLoanConfig(
        id
      )
    );
  }
  getTotalElements() {
    return this.totalElements$;
  }

  GetEmpLoanConfigList() {
    return this.empLoanConfigList$;
  }

  getConfigListUpdated() {
    return this.configListUpdated$;
  }
  clearResponse() {
    this.store.dispatch(new EmployeeLoanConfigurationActions.ResetResponse());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
}
