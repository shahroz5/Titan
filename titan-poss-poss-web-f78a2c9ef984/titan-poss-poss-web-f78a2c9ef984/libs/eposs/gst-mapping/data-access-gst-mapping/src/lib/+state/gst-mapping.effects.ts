import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { Injectable } from '@angular/core';

import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { GSTMappingService } from '../gst-mapping.service';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { GSTMappingActionTypes } from './gst-mapping.action';
import * as GSTMappingActions from './gst-mapping.action';
import { map } from 'rxjs/operators';
import {
  CustomErrors,
  GSTMappingResponse,
  Tax,
  GSTMappingDetails,
  Lov,
  TAXTRANSACTIONTYPE
} from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class GSTMappingEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private gstMappingService: GSTMappingService,
    private lovDataService: LovDataService
  ) {}

  @Effect()
  loadGSTMappingList$: Observable<Action> = this.dataPersistence.fetch(
    GSTMappingActionTypes.LOAD_GST_MAPPING_LIST,
    {
      run: (action: GSTMappingActions.LoadGSTMappingList) => {
        return this.gstMappingService
          .loadGSTMappingList(action.payload)
          .pipe(
            map(
              (response: GSTMappingResponse) =>
                new GSTMappingActions.LoadGSTMappingListSuccess(response)
            )
          );
      },
      onError: (
        action: GSTMappingActions.LoadGSTMappingList,
        error: HttpErrorResponse
      ) => {
        return new GSTMappingActions.LoadGSTMappingListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addGSTMapping$: Observable<Action> = this.dataPersistence.fetch(
    GSTMappingActionTypes.ADD_GST_MAPPING,
    {
      run: (action: GSTMappingActions.AddGSTMapping) => {
        return this.gstMappingService
          .addGSTMapping(action.payload)
          .pipe(
            map(
              (gstMappingDetails: GSTMappingDetails) =>
                new GSTMappingActions.AddGSTMappingSuccess(gstMappingDetails)
            )
          );
      },
      onError: (
        action: GSTMappingActions.AddGSTMapping,
        error: HttpErrorResponse
      ) => {
        return new GSTMappingActions.AddGSTMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editGSTMapping$: Observable<Action> = this.dataPersistence.fetch(
    GSTMappingActionTypes.EDIT_GST_MAPPING,
    {
      run: (action: GSTMappingActions.EditGSTMapping) => {
        return this.gstMappingService
          .editGSTMapping(action.payload.configId, action.payload.data)
          .pipe(
            map(
              (gstMappingDetails: GSTMappingDetails) =>
                new GSTMappingActions.EditGSTMappingSuccess(gstMappingDetails)
            )
          );
      },
      onError: (
        action: GSTMappingActions.EditGSTMapping,
        error: HttpErrorResponse
      ) => {
        return new GSTMappingActions.EditGSTMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTaxes$: Observable<Action> = this.dataPersistence.fetch(
    GSTMappingActionTypes.LOAD_TAXES,
    {
      run: (action: GSTMappingActions.LoadTaxes) => {
        return this.gstMappingService
          .loadTaxDetails()
          .pipe(
            map((taxes: Tax[]) => new GSTMappingActions.LoadTaxesSuccess(taxes))
          );
      },
      onError: (
        action: GSTMappingActions.LoadTaxes,
        error: HttpErrorResponse
      ) => {
        return new GSTMappingActions.LoadTaxesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadTxnTypes$ = this.dataPersistence.fetch(
    GSTMappingActionTypes.LOAD_TRANSACTION_TYPES,
    {
      run: () => {
        return this.lovDataService
          .getLocationLovs(TAXTRANSACTIONTYPE)

          .pipe(
            map(
              (txnTypes: Lov[]) =>
                new GSTMappingActions.LoadTransactionTypesSuccess(txnTypes)
            )
          );
      },

      onError: (
        action: GSTMappingActions.LoadTransactionTypes,
        error: HttpErrorResponse
      ) => {
        return new GSTMappingActions.LoadTransactionTypesFailure(
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
