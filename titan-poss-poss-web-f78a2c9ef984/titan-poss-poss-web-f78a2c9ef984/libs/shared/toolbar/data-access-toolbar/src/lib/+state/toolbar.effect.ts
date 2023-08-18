import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  TransactionDetails,
  TransactionCount,
  MetalPrice
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { ToolbarActionTypes } from './toolbar.actions';
import * as ToolbarActions from './toolbar.actions';
import { ToolbarService } from '../toolbar.service';
import { ToolbarState } from './toolbar.state';

@Injectable()
export class ToolbarEffect {
  constructor(
    public dataPersistence: DataPersistence<ToolbarState>,
    public toolbarService: ToolbarService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadMetalPriceDetails$ = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS,
    {
      run: (action: ToolbarActions.LoadMetalPriceDetails) => {
        return this.toolbarService
          .getMaterialPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: MetalPrice[]) =>
                new ToolbarActions.LoadMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.LoadMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  openOrders$: Observable<Action> = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_OPENORDERS,
    {
      run: (action: ToolbarActions.LoadOpenOrders) => {
        return this.toolbarService
          .loadTransactionList(
            action.payload.searchValue,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload
          )
          .pipe(
            map(
              (data: TransactionDetails[]) =>
                new ToolbarActions.LoadOpenOrdersSuccess(data)
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadOpenOrders,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.ResetOpenOrders();
      }
    }
  );

  @Effect()
  openOrdersCount$: Observable<Action> = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_OPENORDERS_COUNT,
    {
      run: (action: ToolbarActions.LoadOpenOrdersCount) => {
        return this.toolbarService
          .loadTransactionListCount(
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (data: TransactionCount[]) =>
                new ToolbarActions.LoadOpenOrdersCountSuccess(data)
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadOpenOrdersCount,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.LoadOpenOrdersCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  onHold$: Observable<Action> = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_ONHOLD,
    {
      run: (action: ToolbarActions.LoadOnHold) => {
        return this.toolbarService
          .loadTransactionList(
            action.payload.searchValue,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload
          )
          .pipe(
            map(
              (data: TransactionDetails[]) =>
                new ToolbarActions.LoadOnHoldSuccess(data)
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadOnHold,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.ResetOnHold();
      }
    }
  );

  @Effect()
  onHoldCount$: Observable<Action> = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_ONHOLD_COUNT,
    {
      run: (action: ToolbarActions.LoadOnHoldCount) => {
        return this.toolbarService
          .loadTransactionListCount(
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (data: TransactionCount[]) =>
                new ToolbarActions.LoadOnHoldCountSuccess(data)
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadOnHoldCount,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.LoadOnHoldCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmOrders$: Observable<Action> = this.dataPersistence.fetch(
    ToolbarActionTypes.LOAD_CONFIRMORDERS,
    {
      run: (action: ToolbarActions.LoadConfirmOrders) => {
        return this.toolbarService
          .loadTransactionList(
            action.payload.searchValue,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload
          )
          .pipe(
            map(
              (data: TransactionDetails[]) =>
                new ToolbarActions.LoadConfirmOrdersSuccess(data)
            )
          );
      },
      onError: (
        action: ToolbarActions.LoadConfirmOrders,
        error: HttpErrorResponse
      ) => {
        return new ToolbarActions.ResetConfirmOrders();
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
