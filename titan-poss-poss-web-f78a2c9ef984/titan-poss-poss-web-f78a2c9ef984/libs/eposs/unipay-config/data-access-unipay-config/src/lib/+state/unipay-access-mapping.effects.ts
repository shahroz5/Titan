import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, FileGroupEnum } from '@poss-web/shared/models';
import { UnipayConfigurationService } from '../unipay-config.service';
import { UnipayConfigurationActionTypes } from './unipay-access-mapping.actions';
import * as UnipayConfigurationActions from './unipay-access-mapping.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class UnipayConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public unipayConfigurationService: UnipayConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  FileUpload$: Observable<Action> = this.dataPersistence.fetch(
    UnipayConfigurationActionTypes.FILE_UPLOAD,
    {
      run: (action: UnipayConfigurationActions.FileUpload) => {
        return this.unipayConfigurationService
          .FileUpload(action.payload)
          .pipe(
            map(data => new UnipayConfigurationActions.FileUploadSuccess(data))
          );
      },

      onError: (
        action: UnipayConfigurationActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new UnipayConfigurationActions.FileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ErrorLogDownload$: Observable<Action> = this.dataPersistence.fetch(
    UnipayConfigurationActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: UnipayConfigurationActions.ErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(
            action.payload,
            FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
          )
          .pipe(
            map(
              data =>
                new UnipayConfigurationActions.ErrorLogDownloadSuccess(data)
            )
          );
      },
      onError: (
        action: UnipayConfigurationActions.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new UnipayConfigurationActions.ErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );


  @Effect()
  GetAccessList$: Observable<Action> = this.dataPersistence.fetch(
    UnipayConfigurationActionTypes.GET_ACCESS_LIST,
    {
      run: (action: UnipayConfigurationActions.GetAccessList) => {
        return this.unipayConfigurationService
          .accessList(action.payload, action.sortField,action.locationCode)
          .pipe(
            map(
              data => new UnipayConfigurationActions.GetAccessListSuccess(data)
            )
          );
      },
      onError: (
        action: UnipayConfigurationActions.GetAccessList,
        error: HttpErrorResponse
      ) => {
        return new UnipayConfigurationActions.GetAccessListFailure(
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
