import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CustomErrors,
  CnListRes
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as CnDirectActions from './cn-direct.action';
import { CNDirectActionTypes } from './cn-direct.action';

import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { CnDirectService } from '../cn-direct.service';
@Injectable()
export class CnDirectEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cnDirectService: CnDirectService
  ) {}

  @Effect()
  searchCnList$ = this.dataPersistence.fetch(
    CNDirectActionTypes.SEARCH_CN_DIRECT_LIST,
    {
      run: (action: CnDirectActions.SearchCnDirectList) => {
        return this.cnDirectService
          .searchCn(action.payload)
          .pipe(
            map(
              (cnListRes: CnListRes) =>
                new CnDirectActions.SearchCnDirectListSuccess(cnListRes)
            )
          );
      },
      onError: (
        action: CnDirectActions.SearchCnDirectList,
        error: HttpErrorResponse
      ) => {
        return new CnDirectActions.SearchCnDirectListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  uploadCn$ = this.dataPersistence.fetch(CNDirectActionTypes.UPLOAD_CN, {
    run: (action: CnDirectActions.UploadCn) => {
      return this.cnDirectService
        .uploadCnSearch(action.payload)
        .pipe(
          map(
            (cnListRes: CnListRes) =>
              new CnDirectActions.UploadCnSuccess(cnListRes)
          )
        );
    },
    onError: (action: CnDirectActions.UploadCn, error: HttpErrorResponse) => {
      return new CnDirectActions.UploadCnFailure(this.errorHandler(error));
    }
  });

  @Effect()
  saveCnApprovals$ = this.dataPersistence.fetch(
    CNDirectActionTypes.SAVE_CN_DIRECT_ACTION,
    {
      run: (action: CnDirectActions.SaveCnDirectAction) => {
        return this.cnDirectService
          .saveCnAction(action.payload)
          .pipe(
            map(
              (approvedIds: string[]) =>
                new CnDirectActions.SaveCnDirectActionSuccess(approvedIds)
            )
          );
      },
      onError: (
        action: CnDirectActions.SaveCnDirectAction,
        error: HttpErrorResponse
      ) => {
        return new CnDirectActions.SaveCnDirectActionFailure(
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
