import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Effect } from '@ngrx/effects';
import { PayerBankActionTypes } from './payer-bank.actions';
import * as PayerBankActions from './payer-bank.actions';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  PayerBankDetails,
  PayerBankMasterResponse,
  FileResponse,
  FileGroupEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';
import { PayerBankService } from '../payer-bank.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class PayerBankEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private payerBankService: PayerBankService,
    public fileDownloadService: FileDownloadService
  ) {}
  @Effect()
  fileUpload$: Observable<Action> = this.dataPersistence.fetch(
    PayerBankActionTypes.FILE_UPLOAD,
    {
      run: (action: PayerBankActions.FileUpload) => {
        return this.payerBankService
          .fileUpload(action.payload)
          .pipe(
            map(
              (fileResponse: FileResponse) =>
                new PayerBankActions.FileUploadSuccess(fileResponse)
            )
          );
      },
      onError: (
        action: PayerBankActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new PayerBankActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadPayerBanks$: Observable<Action> = this.dataPersistence.fetch(
    PayerBankActionTypes.LOAD_PAYER_BANKS,
    {
      run: (action: PayerBankActions.LoadPayerBanks) => {
        return this.payerBankService
          .loadPayerBanks(action.payload)
          .pipe(
            map(
              (payerBanks: PayerBankMasterResponse) =>
                new PayerBankActions.LoadPayerBanksSuccess(payerBanks)
            )
          );
      },
      onError: (
        action: PayerBankActions.LoadPayerBanks,
        error: HttpErrorResponse
      ) => {
        return new PayerBankActions.LoadPayerBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchPayerBank$: Observable<Action> = this.dataPersistence.fetch(
    PayerBankActionTypes.SEARCH_PAYER_BANK,
    {
      run: (action: PayerBankActions.SearchPayerBank) => {
        return this.payerBankService
          .searchPayerBanks(action.payload)
          .pipe(
            map(
              (searchResponse: PayerBankDetails[]) =>
                new PayerBankActions.SearchPayerBankSuccess(searchResponse)
            )
          );
      },
      onError: (
        action: PayerBankActions.SearchPayerBank,
        error: HttpErrorResponse
      ) => {
        return new PayerBankActions.SearchPayerBankFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  errorLogDownload$: Observable<Action> = this.dataPersistence.fetch(
    PayerBankActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: PayerBankActions.ErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(action.payload, FileGroupEnum.PAYER_BANK)
          .pipe(
            map(data => new PayerBankActions.ErrorLogDownloadSuccess(data))
          );
      },
      onError: (
        action: PayerBankActions.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new PayerBankActions.ErrorLogDownloadFailure(
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
