import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, FileGroupEnum } from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FileDownloadService } from '@poss-web/shared/util-common';
import * as RazorpayConfigurationActions from './razorpay-vendor-mapping.actions';
import { RazorpayVendorMappingActionTypes } from './razorpay-vendor-mapping.actions';
import { RazorpayVendorConfigurationService } from '../razorpay-vendor-config.service';

@Injectable()
export class RazorpayVendorConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public razorpayVendorConfigurationService: RazorpayVendorConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  FileUpload$: Observable<Action> = this.dataPersistence.fetch(
    RazorpayVendorMappingActionTypes.FILE_UPLOAD,
    {
      run: (action: RazorpayConfigurationActions.FileUpload) => {
        return this.razorpayVendorConfigurationService
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
    RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD,
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
  GetVendorList$: Observable<Action> = this.dataPersistence.fetch(
    RazorpayVendorMappingActionTypes.GET_VENDOR_LIST,
    {
      run: (action: RazorpayConfigurationActions.GetVendorList) => {
        return this.razorpayVendorConfigurationService
          .vendorList(action.payload, action.sortField, action.locationCode)
          .pipe(
            map(
              data =>
                new RazorpayConfigurationActions.GetVendorListSuccess(data)
            )
          );
      },
      onError: (
        action: RazorpayConfigurationActions.GetVendorList,
        error: HttpErrorResponse
      ) => {
        return new RazorpayConfigurationActions.GetVendorListFailure(
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
