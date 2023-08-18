import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { WalkInsRecordActionTypes } from './walk-ins-record.actions';
import * as WalkInsRecordActions from './walk-ins-record.actions';
import { WalkInsRecordService } from '../walk-ins-record.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  WalkInsCustomerVisitDetails,
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class WalkInsRecordEffects {
  constructor(
    private dataPersistence: DataPersistence<WalkInsRecordEffects>,
    private walkInsRecordService: WalkInsRecordService,
    private loggerService: LoggerService
  ) {}

  @Effect() loadSaveWalkInDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS,
    {
      run: (action: WalkInsRecordActions.LoadSaveWalkInDetails) => {
        return this.walkInsRecordService
          .saveWalkInsDetails(action.payload)
          .pipe(
            map((data: WalkInsDetails) => {
              return new WalkInsRecordActions.LoadSaveWalkInDetailsSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: WalkInsRecordActions.LoadSaveWalkInDetails,
        error: HttpErrorResponse
      ) => {
        return new WalkInsRecordActions.LoadSaveWalkInDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadWalkInConversionCount$: Observable<
    Action
  > = this.dataPersistence.fetch(WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS, {
    run: (action: WalkInsRecordActions.LoadWalkInDetailsForBusinessDay) => {
      return this.walkInsRecordService
        .getWalkInsCustomerVisitDetails(action.payload)
        .pipe(
          map((data: WalkInsCustomerVisitDetails) => {
            return new WalkInsRecordActions.LoadWalkInDetailsForBusinessDaySuccess(
              data
            );
          })
        );
    },

    onError: (
      action: WalkInsRecordActions.LoadWalkInDetailsForBusinessDay,
      error: HttpErrorResponse
    ) => {
      return new WalkInsRecordActions.LoadWalkInDetailsForBusinessDayFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadWalkInsHistoryData$: Observable<
    Action
  > = this.dataPersistence.fetch(
    WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA,
    {
      run: (action: WalkInsRecordActions.LoadWalkInsHistoryData) => {
        return this.walkInsRecordService.loadWalkInsHistoryData().pipe(
          map((data: WalkInsDetailsHistoryResponse[]) => {
            return new WalkInsRecordActions.LoadWalkInsHistoryDataSuccess(data);
          })
        );
      },
      onError: (
        action: WalkInsRecordActions.LoadWalkInsHistoryData,
        error: HttpErrorResponse
      ) => {
        return new WalkInsRecordActions.LoadWalkInsHistoryDataFailure(
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
