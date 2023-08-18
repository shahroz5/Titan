import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { OrderConfirmationState } from './order-confirmation.state';

import { OrderConfirmationActionTypes } from './order-confirmation.actions';
import * as OrderConfirmationActions from './order-confirmation.actions';
import { OrderConfirmationService } from '../order-confirmation.service';

import { CashMemoDetailsResponse, CustomErrors } from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class OrderConfirmationEffects {
  constructor(
    private dataPersistence: DataPersistence<OrderConfirmationState>,
    private orderConfirmationService: OrderConfirmationService,

    private loggerService: LoggerService,

  ) {}

  @Effect()
  ConfirmCashMemo$ = this.dataPersistence.fetch(
    OrderConfirmationActionTypes.CONFIRM_CASH_MEMO,
    {
      run: (action: OrderConfirmationActions.ConfirmCashMemo) => {
        return this.orderConfirmationService
          .updateOrder(action.payload)
          .pipe(
            map(
              (paymentDetails: CashMemoDetailsResponse) =>
                new OrderConfirmationActions.ConfirmCashMemoSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: OrderConfirmationActions.ConfirmCashMemo,
        error: HttpErrorResponse
      ) => {
        return new OrderConfirmationActions.ConfirmCashMemoFailure(
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
