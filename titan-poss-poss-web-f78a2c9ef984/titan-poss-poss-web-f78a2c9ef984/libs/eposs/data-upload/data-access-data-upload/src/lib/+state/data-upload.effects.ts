import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors } from '@poss-web/shared/models';
import { DataUploadService } from '../data-upload.service';
import { DataUploadActionTypes } from './data-upload.actions';
import * as DataUploadActions from './data-upload.actions';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class DataUploadEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public dataUploadService: DataUploadService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  FIRFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    DataUploadActionTypes.FIR_FILE_UPLOAD,
    {
      run: (action: DataUploadActions.FIRFileUpload) => {
        return this.dataUploadService
          .FIRFileUpload(action.payload)
          .pipe(map(data => new DataUploadActions.FIRFileUploadSuccess(data)));
      },
      onError: (
        action: DataUploadActions.FIRFileUpload,
        error: HttpErrorResponse
      ) => {
        return new DataUploadActions.FIRFileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  MERFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    DataUploadActionTypes.MER_FILE_UPLOAD,
    {
      run: (action: DataUploadActions.MERFileUpload) => {
        return this.dataUploadService
          .MERFileUpload(action.payload)
          .pipe(map(data => new DataUploadActions.MERFileUploadSuccess(data)));
      },
      onError: (
        action: DataUploadActions.MERFileUpload,
        error: HttpErrorResponse
      ) => {
        return new DataUploadActions.MERFileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  InvoiceUpload$: Observable<Action> = this.dataPersistence.fetch(
    DataUploadActionTypes.INVOICE_UPLOAD,
    {
      run: (action: DataUploadActions.InvoiceUpload) => {
        return this.dataUploadService
          .InvoiceUpload()
          .pipe(map(data => new DataUploadActions.InvoiceUploadSuccess(true)));
      },
      onError: (
        action: DataUploadActions.InvoiceUpload,
        error: HttpErrorResponse
      ) => {
        return new DataUploadActions.InvoiceUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  STNUpload$: Observable<Action> = this.dataPersistence.fetch(
    DataUploadActionTypes.STN_UPLOAD,
    {
      run: (action: DataUploadActions.STNUpload) => {
        return this.dataUploadService
          .STNUpload()
          .pipe(map(data => new DataUploadActions.STNUploadSuccess(true)));
      },
      onError: (
        action: DataUploadActions.STNUpload,
        error: HttpErrorResponse
      ) => {
        return new DataUploadActions.STNUploadFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
