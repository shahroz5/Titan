import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors } from '@poss-web/shared/models';
import { GvStatusUpdateService } from '../gv-status-update.service';
import { GVStatusUpdateActionTypes } from './gv-status-update.actions';
import * as GVStatusUpdateActions from './gv-status-update.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class GVStatusUpdateEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public gvStatusUpdateService: GvStatusUpdateService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  FileUpload$: Observable<Action> = this.dataPersistence.fetch(
    GVStatusUpdateActionTypes.FILE_UPLOAD,
    {
      run: (action: GVStatusUpdateActions.FileUpload) => {
        return this.gvStatusUpdateService
          .FileUpload(action.payload, action.uploadType)
          .pipe(map(data => new GVStatusUpdateActions.FileUploadSuccess(data)));
      },

      onError: (
        action: GVStatusUpdateActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new GVStatusUpdateActions.FileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ErrorLogDownload$: Observable<Action> = this.dataPersistence.fetch(
    GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: GVStatusUpdateActions.ErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(action.payload, action.uploadType)
          .pipe(
            map(data => new GVStatusUpdateActions.ErrorLogDownloadSuccess(data))
          );
      },
      onError: (
        action: GVStatusUpdateActions.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new GVStatusUpdateActions.ErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetAccessList$: Observable<Action> = this.dataPersistence.fetch(
    GVStatusUpdateActionTypes.GET_GV_STATUS_LIST,
    {
      run: (action: GVStatusUpdateActions.GetGVStatusList) => {
        return this.gvStatusUpdateService
          .gvStatusList(action.payload, action.sortField)
          .pipe(
            map(data => new GVStatusUpdateActions.GetGVStatusListSuccess(data))
          );
      },
      onError: (
        action: GVStatusUpdateActions.GetGVStatusList,
        error: HttpErrorResponse
      ) => {
        return new GVStatusUpdateActions.GetGVStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ExtendGVStatus$: Observable<Action> = this.dataPersistence.fetch(
    GVStatusUpdateActionTypes.EXTEND_GV_STATUS,
    {
      run: (action: GVStatusUpdateActions.ExtendGVStatus) => {
        return this.gvStatusUpdateService
          .extendValidity(action.payload)
          .pipe(
            map(data => new GVStatusUpdateActions.ExtendGVStatusSuccess(data))
          );
      },
      onError: (
        action: GVStatusUpdateActions.ExtendGVStatus,
        error: HttpErrorResponse
      ) => {
        return new GVStatusUpdateActions.ExtendGVStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ChangeGVStatus$: Observable<Action> = this.dataPersistence.fetch(
    GVStatusUpdateActionTypes.CHANGE_GV_STATUS,
    {
      run: (action: GVStatusUpdateActions.ChangeGVStatus) => {
        return this.gvStatusUpdateService
          .changeStatus(action.payload)
          .pipe(
            map(data => new GVStatusUpdateActions.ChangeGVStatusSuccess(data))
          );
      },
      onError: (
        action: GVStatusUpdateActions.ChangeGVStatus,
        error: HttpErrorResponse
      ) => {
        return new GVStatusUpdateActions.ChangeGVStatusFailure(
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
