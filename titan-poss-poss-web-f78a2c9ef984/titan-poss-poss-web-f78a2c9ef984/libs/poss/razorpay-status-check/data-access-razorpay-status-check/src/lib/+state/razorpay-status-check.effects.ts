import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';

import {
  CustomErrors,
  PaymentRequestDetails,
  CustomerPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as razorPayPaymentStatusCheckActions from './razorpay-status-check.actions';
import { map } from 'rxjs/operators';
import { RazorpayStatusCheckService } from '../razorpay-status-check.service';
import { RazorpayStatusCheckState } from './razorpay-status-check.state';

@Injectable()
export class RazorpayPaymentRequestEffects {
  constructor(
    private dataPersistence: DataPersistence<RazorpayStatusCheckState>,
    private loggerService: LoggerService,
    private razorpayStatusCheckService: RazorpayStatusCheckService
  ) {}

  @Effect()
  searchCustomer$: Observable<Action> = this.dataPersistence.fetch(
    razorPayPaymentStatusCheckActions.RazorpayStatusCheckActionTypes
      .SEARCH_CUSTOMER,
    {
      run: (action: razorPayPaymentStatusCheckActions.SearchCustomer) => {
        return this.razorpayStatusCheckService
          .searchCustomer(action.payload)
          .pipe(
            map(
              (details: CustomerPayload) =>
                new razorPayPaymentStatusCheckActions.SearchCustomerSuccess(
                  details
                )
            )
          );
      },
      onError: (
        action: razorPayPaymentStatusCheckActions.SearchCustomer,
        error: HttpErrorResponse
      ) => {
        return new razorPayPaymentStatusCheckActions.SearchCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPayments$: Observable<Action> = this.dataPersistence.fetch(
    razorPayPaymentStatusCheckActions.RazorpayStatusCheckActionTypes
      .LOAD_RAZORPAY_PAYMENT_REQUESTS,
    {
      run: (
        action: razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequests
      ) => {
        return this.razorpayStatusCheckService
          .getPaymentDetails(action.payload)
          .pipe(
            map(
              (paymentDetails: {
                payments: PaymentRequestDetails[];
                count: number;
              }) =>
                new razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequests,
        error: HttpErrorResponse
      ) => {
        return new razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentsHistory$: Observable<Action> = this.dataPersistence.fetch(
    razorPayPaymentStatusCheckActions.RazorpayStatusCheckActionTypes
      .LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY,
    {
      run: (
        action: razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsHistory
      ) => {
        return this.razorpayStatusCheckService
          .getPaymentDetails(action.payload)
          .pipe(
            map(
              (paymentDetails: {
                payments: PaymentRequestDetails[];
                count: number;
              }) =>
                new razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsHistorySuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsHistory,
        error: HttpErrorResponse
      ) => {
        return new razorPayPaymentStatusCheckActions.LoadRazorpayPaymentRequestsHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ValidateRazorpayPayment$ = this.dataPersistence.fetch(
    razorPayPaymentStatusCheckActions.RazorpayStatusCheckActionTypes
      .VERIFY_RAZORPAY_PAYMENT,
    {
      run: (
        action: razorPayPaymentStatusCheckActions.VerifyRazorpayPaymentRequest
      ) => {
        return this.razorpayStatusCheckService
          .validatePayment(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequestDetails) =>
                new razorPayPaymentStatusCheckActions.VerifyRazorpayPaymentRequestSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: razorPayPaymentStatusCheckActions.VerifyRazorpayPaymentRequest,
        error: HttpErrorResponse
      ) => {
        return new razorPayPaymentStatusCheckActions.VerifyRazorpayPaymentRequestFailure(
          {
            paymentId: action.payload,
            error: this.errorHandler(error)
          }
        );
      }
    }
  );

  @Effect()
  generateCn$ = this.dataPersistence.fetch(
    razorPayPaymentStatusCheckActions.RazorpayStatusCheckActionTypes
      .GENERATE_CN_FOR_RAZORPAY_PAYMENT,
    {
      run: (
        action: razorPayPaymentStatusCheckActions.GenerateCNforRazorpayRequest
      ) => {
        return this.razorpayStatusCheckService
          .generateCN(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequestDetails) =>
                new razorPayPaymentStatusCheckActions.GenerateCNforRazorpayRequestSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: razorPayPaymentStatusCheckActions.GenerateCNforRazorpayRequest,
        error: HttpErrorResponse
      ) => {
        return new razorPayPaymentStatusCheckActions.GenerateCNforRazorpayRequestFailure(
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
