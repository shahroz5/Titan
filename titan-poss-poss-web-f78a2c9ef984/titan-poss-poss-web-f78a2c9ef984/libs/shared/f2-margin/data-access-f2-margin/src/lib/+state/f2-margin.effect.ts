import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';

import * as F2MarginActions from './f2-margin.action';
import { F2MarginService } from '../f2-margin.service';
import { F2MarginActionTypes } from './f2-margin.action';
import { CustomErrors, F2MarginListResponse } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';

@Injectable()
export class F2MarginEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private f2MarginService: F2MarginService
  ) {}

  @Effect()
  loadF2MarginList$: Observable<Action> = this.dataPersistence.fetch(
    F2MarginActionTypes.LOAD_F2_MARGIN_LIST,
    {
      run: (action: F2MarginActions.LoadF2MarginList) => {
        return this.f2MarginService
          .getF2MarginList(action.payload)
          .pipe(
            map(
              (f2MarginListResponse: F2MarginListResponse) =>
                new F2MarginActions.LoadF2MarginListSuccess(
                  f2MarginListResponse
                )
            )
          );
      },
      onError: (
        action: F2MarginActions.LoadF2MarginList,
        error: HttpErrorResponse
      ) => {
        return new F2MarginActions.LoadF2MarginListFailure(
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
