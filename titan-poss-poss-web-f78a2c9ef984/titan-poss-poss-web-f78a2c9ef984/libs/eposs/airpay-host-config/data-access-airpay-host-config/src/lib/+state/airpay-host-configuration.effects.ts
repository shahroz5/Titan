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
import { AirpayHostConfigurationActionTypes } from './airpay-host-configuration.actions';
import * as AirpayHostConfigurationActions from './airpay-host-configuration.actions';
import { AirpayHostConfigurationService } from '../airpay-host-configuration.service';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class AirpayHostConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public airpayHostConfigurationService: AirpayHostConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  GetHostList$: Observable<Action> = this.dataPersistence.fetch(
    AirpayHostConfigurationActionTypes.GET_HOSTNAME_LIST,
    {
      run: (action: AirpayHostConfigurationActions.GetHostNameList) => {
        console.log(action.payload, 'in effects');
        return this.airpayHostConfigurationService
          .hostnameList(action.payload, action.sortField, action.locationCode)
          .pipe(
            map(
              data =>
                new AirpayHostConfigurationActions.GetHostNameListSuccess(data)
            )
          );
      },
      onError: (
        action: AirpayHostConfigurationActions.GetHostNameList,
        error: HttpErrorResponse
      ) => {
        return new AirpayHostConfigurationActions.GetHostNameListFailure(
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
