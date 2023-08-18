import { RevenueActionTypes } from './revenue.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import * as RevenueActions from './revenue.actions';
import {
  CustomErrors,
  RevenueResponse,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import { RevenueService } from '../revenue.service';
import { RevenueState } from './revenue.state';

@Injectable()
export class RevenueEffect {
  constructor(
    private service: RevenueService,
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<RevenueState>
  ) {}

  @Effect() loadDayWiseRevenueList$ = this.dataPersistence.fetch(
    RevenueActionTypes.LOAD_REVENUE_LIST,
    {
      run: (action: RevenueActions.LoadRevenueList) => {
        return this.service
          .loadDayWiseRevenue(action.paginatePayload, action.payload)
          .pipe(
            map(
              (data: RevenueResponse) =>
                new RevenueActions.LoadRevenueListSuccess(data)
            )
          );
      },

      onError: (
        action: RevenueActions.LoadRevenueList,
        error: HttpErrorResponse
      ) => {
        return new RevenueActions.LoadRevenueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadTodayRevenueList$ = this.dataPersistence.fetch(
    RevenueActionTypes.GET_TODAY_REVENUE_LIST,
    {
      run: (action: RevenueActions.GetTodayRevenueList) => {
        return this.service
          .getTodayRevenue(action.payload)
          .pipe(
            map(
              (data: TodayRevenueResponse) =>
                new RevenueActions.GetTodayRevenueListSuccess(data)
            )
          );
      },

      onError: (
        action: RevenueActions.GetTodayRevenueList,
        error: HttpErrorResponse
      ) => {
        return new RevenueActions.GetTodayRevenueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGhsRevenueList$ = this.dataPersistence.fetch(
    RevenueActionTypes.GET_GHS_REVENUE_LIST,
    {
      run: (action: RevenueActions.GetGhsRevenueList) => {
        return this.service
          .getGhsRevenue(action.payload)
          .pipe(
            map(
              (data: TodayRevenueResponse) =>
                new RevenueActions.GetGhsRevenueListSuccess(data)
            )
          );
      },

      onError: (
        action: RevenueActions.GetGhsRevenueList,
        error: HttpErrorResponse
      ) => {
        return new RevenueActions.GetGhsRevenueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadServiceRevenueList$ = this.dataPersistence.fetch(
    RevenueActionTypes.GET_SERVICE_REVENUE_LIST,
    {
      run: (action: RevenueActions.GetServiceRevenueList) => {
        return this.service
          .getServiceRevenue(action.payload)
          .pipe(
            map(
              (data: TodayRevenueResponse) =>
                new RevenueActions.GetServiceRevenueListSuccess(data)
            )
          );
      },

      onError: (
        action: RevenueActions.GetServiceRevenueList,
        error: HttpErrorResponse
      ) => {
        return new RevenueActions.GetServiceRevenueListFailure(
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
