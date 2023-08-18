import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { UploadeGHSService } from '../upload-eghs.service';
import { UploadEGHSActionTypes } from './upload-eghs.actions';
import * as UploadeGHSActions from './upload-eghs.actions';
import { map } from 'rxjs/operators';
import { CustomErrors, FileResponse } from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class UploadeGHSEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private uploadeGHSService: UploadeGHSService
  ) {}
  @Effect()
  uploadeGHSBankDeposit$: Observable<Action> = this.dataPersistence.fetch(
    UploadEGHSActionTypes.UPLOAD_EGHS_BANK_DEPOSIT,
    {
      run: (action: UploadeGHSActions.UploadeGHSBankDeposit) => {
        return this.uploadeGHSService
          .uploadeGHSFile(action.payload)
          .pipe(
            map(
              (fileResponse: FileResponse) =>
                new UploadeGHSActions.UploadeGHSBankDepositSuccess(fileResponse)
            )
          );
      },
      onError: (
        action: UploadeGHSActions.UploadeGHSBankDeposit,
        error: HttpErrorResponse
      ) => {
        return new UploadeGHSActions.UploadeGHSBankDepositFailure(
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
