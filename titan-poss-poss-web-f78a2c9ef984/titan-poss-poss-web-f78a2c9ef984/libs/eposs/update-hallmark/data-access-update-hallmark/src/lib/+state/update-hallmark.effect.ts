
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';
import {
  UpdateItemHallmarkDetails,
  UpdateItemHallmarkDetailsSuccess,
  UpdateItemHallmarkDetailsFailure,
  UpdateHallmarkActionTypes
} from './update-hallmark.action';
import { BinCodes, CustomErrors, LoadBinHistoryResponse } from '@poss-web/shared/models';
import { UpdateHallmarkState } from './update-hallmark.state';
import { UpdateItemHallmarkDetailsService } from '../update-item-hallmark-details.service';

@Injectable()
export class UpdateHallmarkEffects {
  @Effect() updateHallmarkDetails$: Observable<Action> = this.dataPersistence.fetch(
    UpdateHallmarkActionTypes.UPDATE_ITEM_HALLMARK_DETAILS,
    {
      run: (action: UpdateItemHallmarkDetails) => {
        return this.service
          .updateHallmarkDetails(action.payload)
          .pipe(
            map((res: boolean) => new UpdateItemHallmarkDetailsSuccess(true))
          );
      },

      onError: (action: UpdateItemHallmarkDetails, error: HttpErrorResponse) => {
        return new UpdateItemHallmarkDetailsFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }

  constructor(
    private service: UpdateItemHallmarkDetailsService,
    private dataPersistence: DataPersistence<UpdateHallmarkState>,
    private loggerService: LoggerService
  ) {}
}
