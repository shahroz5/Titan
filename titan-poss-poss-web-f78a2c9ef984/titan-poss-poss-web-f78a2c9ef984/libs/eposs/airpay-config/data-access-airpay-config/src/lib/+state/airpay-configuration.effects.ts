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
import { AirpayConfigurationActionTypes } from './airpay-configuration.actions';
import * as AirpayConfigurationActions from './airpay-configuration.actions';
import { AirpayConfigurationService } from '../airpay-configuration.service';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class AirpayConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public airpayHostConfigurationService: AirpayConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  GetVendorList$: Observable<Action> = this.dataPersistence.fetch(
    AirpayConfigurationActionTypes.GET_AIRPAY_VENDOR_LIST,
    {
      run: (action: AirpayConfigurationActions.GetAirpayVendorList) => {
        return this.airpayHostConfigurationService
          .vendorList(action.payload, action.sortField, action.locationCode)
          .pipe(
            map(
              data =>
                new AirpayConfigurationActions.GetAirpayVendorListSuccess(data)
            )
          );
      },
      onError: (
        action: AirpayConfigurationActions.GetAirpayVendorList,
        error: HttpErrorResponse
      ) => {
        return new AirpayConfigurationActions.GetAirpayVendorListFailure(
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
