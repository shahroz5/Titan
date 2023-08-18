import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { RangeActionTypes } from './range.actions';
import * as RangeActions from './range.actions';
import { RangeService } from '../range.service';
import { map } from 'rxjs/operators';
import {
  ConfigurationRanges,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class RangeEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private rangeService: RangeService,
    private lovDataService: LovDataService
  ) {}
  @Effect()
  loadRanges$: Observable<Action> = this.dataPersistence.fetch(
    RangeActionTypes.LOAD_RANGES,
    {
      run: (action: RangeActions.LoadRanges) => {
        return this.rangeService
          .loadRanges(action.payload)
          .pipe(
            map(
              (rangeResponse: ConfigurationRanges[]) =>
                new RangeActions.LoadRangesSuccess(rangeResponse)
            )
          );
      },
      onError: (action: RangeActions.LoadRanges, error: HttpErrorResponse) => {
        return new RangeActions.LoadRangesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  saveRanges$: Observable<Action> = this.dataPersistence.fetch(
    RangeActionTypes.SAVE_RANGES,
    {
      run: (action: RangeActions.SaveRanges) => {
        return this.rangeService
          .saveRanges(action.payload)
          .pipe(map(() => new RangeActions.SaveRangesSuccess()));
      },
      onError: (action: RangeActions.SaveRanges, error: HttpErrorResponse) => {
        return new RangeActions.SaveRangesFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadRangeTypes$: Observable<Action> = this.dataPersistence.fetch(
    RangeActionTypes.LOAD_RANGE_TYPES,
    {
      run: (action: RangeActions.LoadRangeTypes) => {
        return this.lovDataService
          .getLov(action.payload)
          .pipe(
            map(
              (rangeTypes: Lov[]) =>
                new RangeActions.LoadRangeTypesSuccess(rangeTypes)
            )
          );
      },
      onError: (
        action: RangeActions.LoadRangeTypes,
        error: HttpErrorResponse
      ) => {
        return new RangeActions.LoadRangeTypesFailure(this.errorHandler(error));
      }
    }
  );
  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
