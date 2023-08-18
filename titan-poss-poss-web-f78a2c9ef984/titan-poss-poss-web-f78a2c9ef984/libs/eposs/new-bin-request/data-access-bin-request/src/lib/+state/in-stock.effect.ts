
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DataPersistence } from '@nrwl/angular';
import { InStockService } from '../in-stock.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';
import {
  InStockActionTypes,
  LoadBinCodes,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  LoadCount,
  LoadCountSuccess,
  LoadCountFailure,
  RequestedBin,
  RequestedBinSuccess,
  RequestedBinFailure,
  LoadBinHistory,
  LoadBinHistorySuccess
} from './in-stock.action';
import { BinCodes, CustomErrors,LoadBinHistoryResponse } from '@poss-web/shared/models';
import { InStockState } from './in-stock.state';

@Injectable()
export class InStockEffects {
  @Effect() loadBinCodes$: Observable<Action> = this.dataPersistence.fetch(
    InStockActionTypes.LOAD_BINCODES,
    {
      run: (action: LoadBinCodes) => {
        return this.service
          .getBinCodes()
          .pipe(
            map((binCodes: BinCodes[]) => new LoadBinCodesSuccess(binCodes))
          );
      },

      onError: (action: LoadBinCodes, error: HttpErrorResponse) => {
        return new LoadBinCodesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadBinHistory$: Observable<Action> = this.dataPersistence.fetch(
    InStockActionTypes.LOAD_BIN_HISTORY,
    {
      run: (action: LoadBinHistory) => {
        return this.service
          .getBinHistory(
            action.payload.historyRequestBinDto,
            action.payload.page,
            action.payload.size
          )
          .pipe(
            map(
              (binHistory: LoadBinHistoryResponse) =>
                new LoadBinHistorySuccess(binHistory)
            )
          );
      },

      onError: (action: LoadBinHistory, error: HttpErrorResponse) => {
        return new LoadBinHistorySuccess({
          count: 0,
          items: []
        });
      }
    }
  );

  @Effect() binCodeCount$ = this.dataPersistence.fetch(
    InStockActionTypes.LOAD_COUNT,
    {
      // provides an action and the current state of the store
      run: (action: LoadCount) => {
        return this.service
          .getBinCodes()
          .pipe(map((data: any) => new LoadCountSuccess(data)));
      },

      onError: (action: LoadCount, error: HttpErrorResponse) => {
        return new LoadCountFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  requestBin$ = this.dataPersistence.pessimisticUpdate(
    InStockActionTypes.REQUESTED_BIN,
    {
      run: (action: RequestedBin) => {
        return this.service
          .requestBin(action.payload)
          .pipe(map((data: any) => new RequestedBinSuccess(data)));
      },

      onError: (action: RequestedBin, error: HttpErrorResponse) => {
        return new RequestedBinFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }

  constructor(
    private service: InStockService,
    private dataPersistence: DataPersistence<InStockState>,
    private loggerService: LoggerService
  ) {}
}
