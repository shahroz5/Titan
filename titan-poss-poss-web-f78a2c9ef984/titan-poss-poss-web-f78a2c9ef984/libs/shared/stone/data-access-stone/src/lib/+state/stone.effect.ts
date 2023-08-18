import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  LoadStoneListingSuccessPayload
} from '@poss-web/shared/models';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as StoneActions from './stone.actions';
import { StoneService } from '../stone.service';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class StoneEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private stoneService: StoneService
  ) {}

  @Effect()
  filterStoneDetails$ = this.dataPersistence.fetch(
    StoneActions.StoneActionTypes.FILTER_STONE_DETAILS,
    {
      run: (action: StoneActions.FilterStone) => {
        return this.stoneService
          .getFilteredStoneList(action.payload)
          .pipe(
            map(
              (SearchResult: LoadStoneListingSuccessPayload) =>
                new StoneActions.FilterStoneSuccess(SearchResult)
            )
          );
      },
      onError: (action: StoneActions.FilterStone, error: HttpErrorResponse) => {
        return new StoneActions.FilterStoneFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
