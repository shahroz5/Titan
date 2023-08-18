import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentMasterActionTypes } from './payment-master.actions';
import * as PaymentMasterActions from './payment-master.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import {
  CustomErrors,
  PaymentMasterList,
  PaymentMaster
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { PaymentMasterService } from '../payment-master.service';

@Injectable()
export class PaymentMasterEffects {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public paymentMasterService: PaymentMasterService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadPaymentMasterList$ = this.dataPersistence.fetch(
    PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_LISTING,
    {
      run: (action: PaymentMasterActions.LoadPaymentMasterList) => {
        return this.paymentMasterService
          .getPaymentMasterList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (paymentMasterList: PaymentMasterList) =>
                new PaymentMasterActions.LoadPaymentMasterListSuccess(
                  paymentMasterList
                )
            )
          );
      },
      onError: (
        action: PaymentMasterActions.LoadPaymentMasterList,
        error: HttpErrorResponse
      ) => {
        return new PaymentMasterActions.LoadPaymentMasterListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  savePaymentMaster$ = this.dataPersistence.fetch(
    PaymentMasterActionTypes.SAVE_PAYMENT_MASTER,
    {
      run: (action: PaymentMasterActions.SavePaymentMaster) => {
        return this.paymentMasterService
          .savePaymentMaster(action.payload.paymentGroup, action.payload.data)
          .pipe(map(() => new PaymentMasterActions.SavePaymentMasterSuccess()));
      },
      onError: (
        action: PaymentMasterActions.SavePaymentMaster,
        error: HttpErrorResponse
      ) => {
        return new PaymentMasterActions.SavePaymentMasterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updatePaymentMaster$ = this.dataPersistence.fetch(
    PaymentMasterActionTypes.UPDATE_PAYMENT_MASTER,
    {
      run: (action: PaymentMasterActions.UpdatePaymentMaster) => {
        return this.paymentMasterService
          .updatePaymentMaster(
            action.payload.paymentCode,
            action.payload.paymentGroup,
            action.payload.data
          )
          .pipe(
            map(() => new PaymentMasterActions.UpdatePaymentMasterSuccess())
          );
      },
      onError: (
        action: PaymentMasterActions.UpdatePaymentMaster,
        error: HttpErrorResponse
      ) => {
        return new PaymentMasterActions.UpdatePaymentMasterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentMasterByPaymentCode$ = this.dataPersistence.fetch(
    PaymentMasterActionTypes.LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE,
    {
      run: (action: PaymentMasterActions.LoadPaymentMasterByPaymentCode) => {
        return this.paymentMasterService
          .loadPaymentMasterByPaymentCode(action.payload)
          .pipe(
            map(
              (paymentMaster: PaymentMaster) =>
                new PaymentMasterActions.LoadPaymentMasterByPaymentCodeSuccess(
                  paymentMaster
                )
            )
          );
      },
      onError: (
        action: PaymentMasterActions.LoadPaymentMasterByPaymentCode,
        error: HttpErrorResponse
      ) => {
        return new PaymentMasterActions.LoadPaymentMasterByPaymentCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPaymentMaster$ = this.dataPersistence.fetch(
    PaymentMasterActionTypes.SEARCH_PAYMENT_MASTER,
    {
      run: (action: PaymentMasterActions.SearchPaymentMaster) => {
        return this.paymentMasterService
          .searchPaymentMaster(action.payload)
          .pipe(
            map(
              (paymentMasterList: PaymentMasterList) =>
                new PaymentMasterActions.SearchPaymentMasterSuccess(
                  paymentMasterList
                )
            )
          );
      },
      onError: (
        action: PaymentMasterActions.SearchPaymentMaster,
        error: HttpErrorResponse
      ) => {
        return new PaymentMasterActions.SearchPaymentMasterFailure(
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
