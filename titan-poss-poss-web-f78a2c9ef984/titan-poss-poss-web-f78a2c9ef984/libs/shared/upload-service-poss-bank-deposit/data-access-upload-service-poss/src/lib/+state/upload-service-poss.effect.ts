import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { UploadServicePossService } from '../upload-service-poss.service';
import { UploadServicePossActionTypes } from './upload-service-poss.actions';
import * as UploadServicePossActions from './upload-service-poss.actions';
import { map } from 'rxjs/operators';
import { CustomErrors, FileResponse } from '@poss-web/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class UploadServicePossEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private uploadServicePossService: UploadServicePossService
  ) {}
  @Effect()
  uploadServicePossBankDeposit$: Observable<Action> = this.dataPersistence.fetch(
    UploadServicePossActionTypes.UPLOAD_SERVICE_POSS_BANK_DEPOSIT,
    {
      run: (action: UploadServicePossActions.UploadServicePossBankDeposit) => {
        return this.uploadServicePossService
          .uploadServicePossFile(action.payload)
          .pipe(
            map(
              (fileResponse: FileResponse) =>
                new UploadServicePossActions.UploadServicePossBankDepositSuccess(fileResponse)
            )
          );
      },
      onError: (
        action: UploadServicePossActions.UploadServicePossBankDeposit,
        error: HttpErrorResponse
      ) => {
        return new UploadServicePossActions.UploadServicePossBankDepositFailure(
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