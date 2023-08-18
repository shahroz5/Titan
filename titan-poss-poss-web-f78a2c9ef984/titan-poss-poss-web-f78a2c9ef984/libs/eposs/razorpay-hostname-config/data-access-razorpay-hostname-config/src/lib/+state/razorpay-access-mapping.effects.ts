import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, FileGroupEnum } from '@poss-web/shared/models';
import { RazorpayConfigurationActionTypes } from './razorpay-access-mapping.actions';
import * as RazorpayConfigurationActions from './razorpay-access-mapping.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FileDownloadService } from '@poss-web/shared/util-common';
import { RazorpayConfigurationService } from '../razorpay-config.service';

@Injectable()
export class RazorpayConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public unipayConfigurationService: RazorpayConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  FileUpload$: Observable<Action> = this.dataPersistence.fetch(
    RazorpayConfigurationActionTypes.FILE_UPLOAD,
    {
      run: (action: RazorpayConfigurationActions.FileUpload) => {
        return this.unipayConfigurationService
          .FileUpload(action.payload)
          .pipe(
            map(
              data => new RazorpayConfigurationActions.FileUploadSuccess(data)
            )
          );
      },

      onError: (
        action: RazorpayConfigurationActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new RazorpayConfigurationActions.FileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ErrorLogDownload$: Observable<Action> = this.dataPersistence.fetch(
    RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: RazorpayConfigurationActions.ErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(
            action.payload,
            FileGroupEnum.PAYMENT_HOSTNAME_MAPPING
          )
          .pipe(
            map(
              data =>
                new RazorpayConfigurationActions.ErrorLogDownloadSuccess(data)
            )
          );
      },
      onError: (
        action: RazorpayConfigurationActions.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new RazorpayConfigurationActions.ErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetAccessList$: Observable<Action> = this.dataPersistence.fetch(
    RazorpayConfigurationActionTypes.GET_ACCESS_LIST,
    {
      run: (action: RazorpayConfigurationActions.GetAccessList) => {
        return this.unipayConfigurationService
          .accessList(action.payload, action.sortField, action.locationCode)
          .pipe(
            map(
              data =>
                new RazorpayConfigurationActions.GetAccessListSuccess(data)
            )
          );
      },
      onError: (
        action: RazorpayConfigurationActions.GetAccessList,
        error: HttpErrorResponse
      ) => {
        return new RazorpayConfigurationActions.GetAccessListFailure(
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
