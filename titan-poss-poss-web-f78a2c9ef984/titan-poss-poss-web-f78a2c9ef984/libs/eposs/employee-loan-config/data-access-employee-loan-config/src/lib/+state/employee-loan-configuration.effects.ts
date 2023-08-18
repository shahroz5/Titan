import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors } from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import * as EmployeeLoanConfigurationActions from './employee-loan-configuration.actions';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { EmployeeLoanConfigurationService } from '../employee-loan-configuration.service';
import { EmployeeLoanConfigurationActionTypes } from './employee-loan-configuration.actions';
@Injectable()
export class EmployeeLoanConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public employeeLoanConfigurationService: EmployeeLoanConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  GetEmpLoanConfigList$: Observable<Action> = this.dataPersistence.fetch(
    EmployeeLoanConfigurationActionTypes.GET_EMP_LOAN_CONFIG_LIST,
    {
      run: (action: EmployeeLoanConfigurationActions.GetEmpLoanConfigList) => {
        console.log(action.payload, 'in effects');
        return this.employeeLoanConfigurationService
          .empLoanConfigList(action.payload, action.sortField)
          .pipe(
            map(
              data =>
                new EmployeeLoanConfigurationActions.GetEmpLoanConfigListSuccess(data)
            )
          );
      },
      onError: (
        action: EmployeeLoanConfigurationActions.GetEmpLoanConfigList,
        error: HttpErrorResponse
      ) => {
        return new EmployeeLoanConfigurationActions.GetEmpLoanConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  DeleteEmpLoanConfig$: Observable<Action> = this.dataPersistence.fetch(
    EmployeeLoanConfigurationActionTypes.DELETE_EMP_LOAN_CONFIG,
    {
      run: (action: EmployeeLoanConfigurationActions.DeleteEmpLoanConfig) => {
        return this.employeeLoanConfigurationService
          .deleteEmpLoanConfig(action.payload)
          .pipe(
            map(
              data =>
                new EmployeeLoanConfigurationActions.DeleteEmpLoanConfigSuccess(data)
            )
          );
      },
      onError: (
        action: EmployeeLoanConfigurationActions.DeleteEmpLoanConfig,
        error: HttpErrorResponse
      ) => {
        return new EmployeeLoanConfigurationActions.DeleteEmpLoanConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
