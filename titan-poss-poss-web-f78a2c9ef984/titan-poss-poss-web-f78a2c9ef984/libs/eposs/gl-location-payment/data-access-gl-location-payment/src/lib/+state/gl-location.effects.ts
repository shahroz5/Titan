import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  CustomErrors,
  GLLocationPaymentList,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';
import * as GlLocationPaymentActions from './gl-location.actions';
import { GlLocationPaymentService } from '../gl-location-payment.service';
@Injectable()
export class GlLocationPaymentEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationDataService: LocationDataService,
    private glLocationPaymentService: GlLocationPaymentService
  ) {}

  @Effect()
  loadGlLocationPaymentDetails$ = this.dataPersistence.fetch(
    GlLocationPaymentActions.GlLocationPaymentActionTypes
      .LOAD_GL_LOCATION_PAYMENT_LIST,
    {
      run: (action: GlLocationPaymentActions.LoadGlLocationPaymentList) => {
        return this.glLocationPaymentService
          .getGlLocationPaymentList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.locationCode
          )
          .pipe(
            map(
              (glLocationPaymentList: GLLocationPaymentSuccessList) =>
                new GlLocationPaymentActions.LoadGlLocationPaymentListSuccess(
                  glLocationPaymentList
                )
            )
          );
      },
      onError: (
        action: GlLocationPaymentActions.LoadGlLocationPaymentList,
        error: HttpErrorResponse
      ) => {
        return new GlLocationPaymentActions.LoadGlLocationPaymentListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGlLocationPaymentDetails$ = this.dataPersistence.fetch(
    GlLocationPaymentActions.GlLocationPaymentActionTypes
      .SAVE_GL_LOCATION_PAYMENT_DETAILS,
    {
      run: (action: GlLocationPaymentActions.SaveGlLocationPayment) => {
        return this.glLocationPaymentService
          .saveGlLocationPayment(action.payload)
          .pipe(
            map(
              (glLocationPaymentList: GLLocationPaymentList) =>
                new GlLocationPaymentActions.SaveGlLocationPaymentSuccess(
                  glLocationPaymentList
                )
            )
          );
      },
      onError: (
        action: GlLocationPaymentActions.SaveGlLocationPayment,
        error: HttpErrorResponse
      ) => {
        return new GlLocationPaymentActions.SaveGlLocationPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentCodes$ = this.dataPersistence.fetch(
    GlLocationPaymentActions.GlLocationPaymentActionTypes.LOAD_PAYMENT_CODES,
    {
      run: (action: GlLocationPaymentActions.LoadPaymentCodes) => {
        return this.glLocationPaymentService
          .getPaymentCodes()
          .pipe(
            map(
              (paymentCodes: PaymentCodes[]) =>
                new GlLocationPaymentActions.LoadPaymentCodesSuccess(
                  paymentCodes
                )
            )
          );
      },
      onError: (
        action: GlLocationPaymentActions.LoadPaymentCodes,
        error: HttpErrorResponse
      ) => {
        return new GlLocationPaymentActions.LoadPaymentCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationCodes$ = this.dataPersistence.fetch(
    GlLocationPaymentActions.GlLocationPaymentActionTypes.GET_LOCATIONS,
    {
      run: (action: GlLocationPaymentActions.GetLocationCodes) => {
        return this.locationDataService
          .getLocationSummaryList(null, false, null, null, ['locationCode,ASC'])
          .pipe(
            map(
              (locationCodes: LocationCodeDetails[]) =>
                new GlLocationPaymentActions.GetLocationCodesSuccess(
                  locationCodes
                )
            )
          );
      },
      onError: (
        action: GlLocationPaymentActions.GetLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new GlLocationPaymentActions.GetLocationCodesFailure(
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
