import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { map } from 'rxjs/operators';
import { OtherChargesState } from './other-charges.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { OtherChargesActionTypes } from './other-charges.actions';
import * as OtherChargesActions from './other-charges.actions';
import { OtherChargesService } from '../other-charges.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  CashMemoDetailsResponse,
  CashMemoTaxDetails,
  Lov
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class OtherChargesEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<OtherChargesState>,
    private OtherChargesService: OtherChargesService,
    private lovDataService: LovDataService
  ) {}

  @Effect() partialUpdateCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    OtherChargesActionTypes.PARTIAL_UPDATE_CASH_MEMO,
    {
      run: (action: OtherChargesActions.PartialUpdateCashMemo) => {
        return this.OtherChargesService.partialUpdateCashMemo(
          action.payload.id,
          action.payload.requestDetails,
          action.payload.txnType,
          action.payload.subTxnType
        ).pipe(
          map((data: CashMemoDetailsResponse) => {
            return new OtherChargesActions.PartialUpdateCashMemoSuccess(data);
          })
        );
      },

      onError: (
        action: OtherChargesActions.PartialUpdateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new OtherChargesActions.PartialUpdateCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadTaxDetails$: Observable<Action> = this.dataPersistence.fetch(
    OtherChargesActionTypes.LOAD_TAX_DETAILS,
    {
      run: (action: OtherChargesActions.LoadTaxDetails) => {
        return this.OtherChargesService.getTaxDetails(
          action.payload.customerId,
          action.payload.itemCode,
          action.payload.txnType
        ).pipe(
          map((data: CashMemoTaxDetails) => {
            return new OtherChargesActions.LoadTaxDetailsSuccess(data);
          })
        );
      },

      onError: (
        action: OtherChargesActions.LoadTaxDetails,
        error: HttpErrorResponse
      ) => {
        return new OtherChargesActions.LoadTaxDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReasons$: Observable<Action> = this.dataPersistence.fetch(
    OtherChargesActionTypes.LOAD_REASONS,
    {
      run: (action: OtherChargesActions.LoadReasons) => {
        return this.lovDataService.getEnginePaymentLovs(action.payload).pipe(
          map((data: Lov[]) => {
            return new OtherChargesActions.LoadReasonsSuccess(data);
          })
        );
      },
      onError: (
        action: OtherChargesActions.LoadReasons,
        error: HttpErrorResponse
      ) => {
        return new OtherChargesActions.LoadReasonsFailure(
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
