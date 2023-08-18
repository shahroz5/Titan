import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import { LoggerService } from '@poss-web/shared/util-logger';
import { AirpayPaymentRequestService } from '../airpay-payment-request.service';
import {
  CustomErrors,
  PaymentRequestDetails,
  CustomerPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as airpayPaymentActions from './airpay-payment-requests.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class AirpayPaymentRequestEffects {
  constructor(
    private dataPersistence: DataPersistence<AirpayPaymentRequestState>,
    private loggerService: LoggerService,
    private airpayPaymentService: AirpayPaymentRequestService
  ) {}

  @Effect()
  searchCustomer$: Observable<Action> = this.dataPersistence.fetch(
    airpayPaymentActions.AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER,
    {
      run: (action: airpayPaymentActions.SearchCustomer) => {
        return this.airpayPaymentService
          .searchCustomer(action.payload)
          .pipe(
            map(
              (details: CustomerPayload) =>
                new airpayPaymentActions.SearchCustomerSuccess(details)
            )
          );
      },
      onError: (
        action: airpayPaymentActions.SearchCustomer,
        error: HttpErrorResponse
      ) => {
        return new airpayPaymentActions.SearchCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPayments$: Observable<Action> = this.dataPersistence.fetch(
    airpayPaymentActions.AirpayPaymentRequestActionTypes
      .LOAD_AIRPAY_PAYMENT_REQUESTS,
    {
      run: (action: airpayPaymentActions.LoadAirpayPaymentRequests) => {
        return this.airpayPaymentService
          .getPaymentDetails(action.payload)
          .pipe(
            map(
              (paymentDetails: {
                payments: PaymentRequestDetails[];
                count: number;
              }) =>
                new airpayPaymentActions.LoadAirpayPaymentRequestsSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: airpayPaymentActions.LoadAirpayPaymentRequests,
        error: HttpErrorResponse
      ) => {
        return new airpayPaymentActions.LoadAirpayPaymentRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentsHistory$: Observable<Action> = this.dataPersistence.fetch(
    airpayPaymentActions.AirpayPaymentRequestActionTypes
      .LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY,
    {
      run: (action: airpayPaymentActions.LoadAirpayPaymentRequestsHistory) => {
        return this.airpayPaymentService
          .getPaymentDetails(action.payload)
          .pipe(
            map(
              (paymentDetails: {
                payments: PaymentRequestDetails[];
                count: number;
              }) =>
                new airpayPaymentActions.LoadAirpayPaymentRequestsHistorySuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: airpayPaymentActions.LoadAirpayPaymentRequestsHistory,
        error: HttpErrorResponse
      ) => {
        return new airpayPaymentActions.LoadAirpayPaymentRequestsHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ValidateAirpayPayment$ = this.dataPersistence.fetch(
    airpayPaymentActions.AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT,
    {
      run: (action: airpayPaymentActions.VerifyAirpayPaymentRequest) => {
        return this.airpayPaymentService
          .validatePayment(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequestDetails) =>
                new airpayPaymentActions.VerifyAirpayPaymentRequestSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: airpayPaymentActions.VerifyAirpayPaymentRequest,
        error: HttpErrorResponse
      ) => {
        return new airpayPaymentActions.VerifyAirpayPaymentRequestFailure({
          paymentId: action.payload,
          error: this.errorHandler(error)
        });
      }
    }
  );

  @Effect()
  generateCn$ = this.dataPersistence.fetch(
    airpayPaymentActions.AirpayPaymentRequestActionTypes
      .GENERATE_CN_FOR_AIRPAY_PAYMENT,
    {
      run: (action: airpayPaymentActions.GenerateCNforAirpayRequest) => {
        return this.airpayPaymentService
          .generateCN(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequestDetails) =>
                new airpayPaymentActions.GenerateCNforAirpayRequestSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: airpayPaymentActions.GenerateCNforAirpayRequest,
        error: HttpErrorResponse
      ) => {
        return new airpayPaymentActions.GenerateCNforAirpayRequestFailure(
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
