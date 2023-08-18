
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import * as ViewTcsActions from './view-tcs.actions';
import { ViewTcsActionTypes } from './view-tcs.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrors, TcsList } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ViewTcsDataService } from '../view-tcs.service';


@Injectable()
export class ViewTcsEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private viewTcsService: ViewTcsDataService
  ) {}

  @Effect()
  loadTcsDetails$ = this.dataPersistence.fetch(
    ViewTcsActionTypes.LOAD_TCS_DETAILS,
    {
      run: (action: ViewTcsActions.LoadTcsDetails) => {
        return this.viewTcsService
          .getTcsDetail(action.payload)
          .pipe(
            map(
              (data: TcsList[]) =>
                new ViewTcsActions.LoadTcsDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: ViewTcsActions.LoadTcsDetails,
        error: HttpErrorResponse
      ) => {
        return new ViewTcsActions.LoadTcsDetailsFailure(
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
