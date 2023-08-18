import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import {
  ClosedBodResponse,
  CustomErrors,
  MetalRatesAndGoldAvailabilityResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BodEodService } from '../bod-eod.service';
import * as BodEodActions from './bod-eod.actions';
import { BodEodActionTypes } from './bod-eod.actions';
import { BodEodState } from './bod-eod.state';

@Injectable()
export class BodEodEffects {
  constructor(
    private dataPersistence: DataPersistence<BodEodState>,
    private bodEodService: BodEodService,
    private loggerService: LoggerService
  ) {}

  @Effect() currentDayBod$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.OPEN_BUSINESS_DATE,
    {
      run: (action: BodEodActions.LoadOpenBusinessDate) => {
        return this.bodEodService
          .getOpenBusinessDate()
          .pipe(
            map(
              (data: number) =>
                new BodEodActions.LoadOpenBusinessDateSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.LoadOpenBusinessDate,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LoadOpenBusinessDateFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadMetalRatesForBusinessDay$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY,
    {
      run: (action: BodEodActions.LoadMetalRatesForBusinessDay) => {
        return this.bodEodService
          .getMetalRatesAndGoldRateAvailabityForBusinessDay(action.payload)
          .pipe(
            map(
              (data: MetalRatesAndGoldAvailabilityResponse) =>
                new BodEodActions.LoadMetalRatesForBusinessDaySuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.LoadMetalRatesForBusinessDay,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LoadMetalRatesForBusinessDayFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadEodBusinessDate$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.LOAD_EOD_BUSINESS_DATE, {
    run: (action: BodEodActions.LoadEodBusinessDate) => {
      return this.bodEodService
        .getEodBusinessDate()
        .pipe(
          map(
            (data: number) => new BodEodActions.LoadEodBusinessDateSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.LoadEodBusinessDate,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.LoadEodBusinessDateFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() latestBusinessDay$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.LATEST_BUSINESS_DAY,
    {
      run: (action: BodEodActions.LatestBusinessDay) => {
        return this.bodEodService
          .getLatestBusinessDay()
          .pipe(
            map(
              (data: ClosedBodResponse) =>
                new BodEodActions.LatestBusinessDaySuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.LatestBusinessDay,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LatestBusinessDayFailure(
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
