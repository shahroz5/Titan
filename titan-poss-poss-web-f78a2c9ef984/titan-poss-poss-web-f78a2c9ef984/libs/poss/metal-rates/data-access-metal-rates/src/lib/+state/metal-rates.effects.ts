import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { MetalRatesState } from './metal-rates.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { MetalRatesActionTypes } from './metal-rates.actions';
import * as MetalRatesActions from './metal-rates.actions';
import { MetalRatesService } from '../metal-rates.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrors } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class MetalRatesEffects {
  constructor(
    private dataPersistence: DataPersistence<MetalRatesState>,
    private metalRatesService: MetalRatesService,
    private loggerService: LoggerService
  ) {}

  @Effect() loadBodBusinessDate$: Observable<
    Action
  > = this.dataPersistence.fetch(MetalRatesActionTypes.LOAD_BOD_BUSINESS_DATE, {
    run: (action: MetalRatesActions.LoadBodBusinessDate) => {
      return this.metalRatesService
        .getBodBusinessDay()
        .pipe(
          map(
            (data: number) =>
              new MetalRatesActions.LoadBodBusinessDateSuccess(data)
          )
        );
    },
    onError: (
      action: MetalRatesActions.LoadBodBusinessDate,
      error: HttpErrorResponse
    ) => {
      return new MetalRatesActions.LoadBodBusinessDateFailure(
        this.errorHandler(error)
      );
    }
  });
  @Effect() loadEodBusinessDate$: Observable<
    Action
  > = this.dataPersistence.fetch(MetalRatesActionTypes.LOAD_EOD_BUSINESS_DATE, {
    run: (action: MetalRatesActions.LoadEodBusinessDate) => {
      return this.metalRatesService
        .getEodBusinessDay()
        .pipe(
          map(
            (data: number) =>
              new MetalRatesActions.LoadEodBusinessDateSuccess(data)
          )
        );
    },
    onError: (
      action: MetalRatesActions.LoadEodBusinessDate,
      error: HttpErrorResponse
    ) => {
      return new MetalRatesActions.LoadEodBusinessDateFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadAvailableMetalRates$: Observable<
    Action
  > = this.dataPersistence.fetch(
    MetalRatesActionTypes.LOAD_AVAILABLE_METAL_RATES,
    {
      run: (action: MetalRatesActions.LoadAvailableMetalRates) => {
        return this.metalRatesService
          .getGoldRateAvailabilityStatus(action.payload)
          .pipe(
            map(
              (data: boolean) =>
                new MetalRatesActions.LoadAvailableMetalRatesSuccess(data)
            )
          );
      },
      onError: (
        action: MetalRatesActions.LoadAvailableMetalRates,
        error: HttpErrorResponse
      ) => {
        return new MetalRatesActions.LoadAvailableMetalRatesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() saveMetalRates$: Observable<Action> = this.dataPersistence.fetch(
    MetalRatesActionTypes.SAVE_METAL_RATES,
    {
      run: (action: MetalRatesActions.SaveMetalRates) => {
        return this.metalRatesService
          .saveMetalRates(action.payload)
          .pipe(
            map(
              (data: any) => new MetalRatesActions.SaveMetalRatesSuccess(data)
            )
          );
      },
      onError: (
        action: MetalRatesActions.SaveMetalRates,
        error: HttpErrorResponse
      ) => {
        return new MetalRatesActions.SaveMetalRatesFailure(
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
