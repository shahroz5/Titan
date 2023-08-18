import { ABRequests ,CustomErrors} from '@poss-web/shared/models';

import { ABRequestsActionsTypes } from './ab-requests.actions';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as actions from './ab-requests.actions';
import { AbRequestsService } from '../ab-requests.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { AbRequestsState } from './ab-requests.state';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class ABRequestsEffects {
  constructor(
    private dataPersistence: DataPersistence<AbRequestsState>,
    private service: AbRequestsService,
    private loggerService: LoggerService,
    private locationService: LocationDataService
  ) {}
  @Effect() abCancelList$: Observable<Action> = this.dataPersistence.fetch(
    ABRequestsActionsTypes.LOAD_AB__REQUESTS,
    {
      run: (action: actions.LoadABRequests) => {
        return this.service
          .getloadabRequest(action.payload)
          .pipe(
            map((data: ABRequests) => new actions.LoadABRequestsSuccess(data))
          );
      },

      onError: (action: actions.LoadABRequests, error: HttpErrorResponse) => {
        return new actions.LoadABRequestsFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  location$ = this.dataPersistence.fetch(ABRequestsActionsTypes.LOAD_LOCATION, {
    run: (action: actions.LoadLocation) => {
      return this.locationService
        .getLocationSummaryList(null, false, null, null, null)
        .pipe(map((items: any) => new actions.LoadLocationSuccess(items)));
    },
    onError: (action: actions.LoadLocation, error: HttpErrorResponse) => {
      return new actions.LoadLocationFailure(this.errorHandler(error));
    }
  });



  @Effect() approveCancel$: Observable<Action> = this.dataPersistence.fetch(
    ABRequestsActionsTypes.APPROVE_AB__REQUESTS,
    {
      run: (action: actions.ApproveABRequests) => {
        return this.service
          .putab(action.payload)
          .pipe(map((data: any) => new actions.ApproveABRequestsSuccess({
            data:data,docNo:action.payload.docNo})));
      },

      onError: (
        action: actions.ApproveABRequests,
        error: HttpErrorResponse
      ) => {
        return new actions.ApproveABRequestsFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
