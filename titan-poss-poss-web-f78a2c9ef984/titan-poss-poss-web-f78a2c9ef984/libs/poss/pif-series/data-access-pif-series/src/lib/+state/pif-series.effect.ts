import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { PIFSeriesService } from '../pif-series.service';
import { PIFSeriesActionTypes } from './pif-series.actions';
import * as PIFSeriesActions from './pif-series.actions';
import { map } from 'rxjs/operators';
import { CustomErrors, PIFSeriesResponse } from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class PIFSeriesEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private pifSeriesService: PIFSeriesService
  ) {}
  @Effect()
  loadPIFSeries$: Observable<Action> = this.dataPersistence.fetch(
    PIFSeriesActionTypes.LOAD_PIF_SERIES,
    {
      run: (action: PIFSeriesActions.LoadPIFSeries) => {
        return this.pifSeriesService
          .loadPIFSeries(action.payload)
          .pipe(
            map(
              (pifSeriesResponse: PIFSeriesResponse) =>
                new PIFSeriesActions.LoadPIFSeriesSucceess(pifSeriesResponse)
            )
          );
      },
      onError: (
        action: PIFSeriesActions.LoadPIFSeries,
        error: HttpErrorResponse
      ) => {
        return new PIFSeriesActions.LoadPIFSeriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  savePIFSeries$: Observable<Action> = this.dataPersistence.fetch(
    PIFSeriesActionTypes.SAVE_PIF_SERIES,
    {
      run: (action: PIFSeriesActions.SavePIFSeries) => {
        return this.pifSeriesService
          .savePIFSeries(action.payload)
          .pipe(map(() => new PIFSeriesActions.SavePIFSeriesSuccess()));
      },
      onError: (
        action: PIFSeriesActions.SavePIFSeries,
        error: HttpErrorResponse
      ) => {
        return new PIFSeriesActions.SavePIFSeriesFailure(
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
