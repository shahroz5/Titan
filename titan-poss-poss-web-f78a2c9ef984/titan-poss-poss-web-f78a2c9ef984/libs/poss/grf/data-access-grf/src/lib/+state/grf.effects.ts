import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CtGrfActionTypes } from './grf.actions';
import * as CtGrfActions from './grf.actions';
import { CtGrfService } from '../grf.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AdvanceHistoryResponse,
  CreditNote,
  CustomErrors,
  FileUploadLists,
  FrozenCNs,
  InitiateAdvanceResponse,
  MergeCNResponse,
  RsoNameObject,
  StoreUser,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class CtGrfEffects {
  constructor(
    private dataPersistence: DataPersistence<CtGrfEffects>,
    private ctGrfService: CtGrfService,
    private loggerService: LoggerService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect() loadRSODetails$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.LOAD_RSO_DETAILS,
    {
      run: (action: CtGrfActions.LoadRsoDetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, null, null, [action.payload])
          .pipe(
            map((data: StoreUser[]) => {
              const employeeCodes: RsoNameObject[] = [];
              for (const employee of data) {
                const empObj: RsoNameObject = {
                  value: employee.employeeCode,
                  description: employee.empName
                };
                employeeCodes.push(empObj);
              }
              return new CtGrfActions.LoadRsoDetailsSuccess(employeeCodes);
            })
          );
      },

      onError: (
        action: CtGrfActions.LoadRsoDetails,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.LoadRsoDetailsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() initiateGrf$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.INITIATE_GRF,
    {
      run: (action: CtGrfActions.InitiateGrf) => {
        return this.ctGrfService
          .initiateGrfTransaction(action.subTransactionType, action.requestBody)
          .pipe(
            map(
              (data: InitiateAdvanceResponse) =>
                new CtGrfActions.InitiateGrfSuccess(data)
            )
          );
      },
      onError: (action: CtGrfActions.InitiateGrf, error: HttpErrorResponse) => {
        return new CtGrfActions.InitiateGrfFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() updateGrf$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.UPDATE_GRF,
    {
      run: (action: CtGrfActions.UpdateGrf) => {
        return this.ctGrfService
          .updateGrfTransaction(
            action.subTransactionType,
            action.id,
            action.requestPayload
          )
          .pipe(
            map(
              (data: UpdateAdvanceTransactionResponse) =>
                new CtGrfActions.UpdateGrfSuccess(data)
            )
          );
      },
      onError: (action: CtGrfActions.UpdateGrf, error: HttpErrorResponse) => {
        return new CtGrfActions.UpdateGrfFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() partiallyUpdateGrf$: Observable<
    Action
  > = this.dataPersistence.fetch(CtGrfActionTypes.PARTIALLY_UPDATE_GRF, {
    run: (action: CtGrfActions.PartiallyUpdateGrf) => {
      return this.ctGrfService
        .partiallyUpdateGrfTransaction(
          action.subTransactionType,
          action.id,
          action.requestPayload
        )
        .pipe(
          map(
            (data: any) =>
              new CtGrfActions.PartiallyUpdateGrfSuccess(
                new Date().toLocaleTimeString()
              )
          )
        );
    },
    onError: (
      action: CtGrfActions.PartiallyUpdateGrf,
      error: HttpErrorResponse
    ) => {
      return new CtGrfActions.PartiallyUpdateGrfFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() viewGrf$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.VIEW_GRF,
    {
      run: (action: CtGrfActions.ViewGrf) => {
        return this.ctGrfService
          .getGrfTransactionDetails(action.subTransactionType, action.payload)
          .pipe(map((data: any) => new CtGrfActions.ViewGrfSuccess(data)));
      },
      onError: (action: CtGrfActions.ViewGrf, error: HttpErrorResponse) => {
        return new CtGrfActions.ViewGrfFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadFrozenCNs$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.LOAD_FROZEN_CNS,
    {
      run: (action: CtGrfActions.LoadFrozenCNs) => {
        return this.ctGrfService
          .loadFrozenCNs(action.payload)
          .pipe(
            map(
              (data: FrozenCNs[]) => new CtGrfActions.LoadFrozenCNsSuccess(data)
            )
          );
      },
      onError: (
        action: CtGrfActions.LoadFrozenCNs,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.LoadFrozenCNsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() searchGRF$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.SEARCH_GRF,
    {
      run: (action: CtGrfActions.SearchGRF) => {
        return this.ctGrfService
          .searchGRF(action.payload)
          .pipe(
            map((data: CreditNote) => new CtGrfActions.SearchGRFSuccess(data))
          );
      },
      onError: (action: CtGrfActions.SearchGRF, error: HttpErrorResponse) => {
        return new CtGrfActions.SearchGRFFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() mergeCNs$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.MERGE_CNS,
    {
      run: (action: CtGrfActions.MergeCNs) => {
        return this.ctGrfService
          .mergeCNs(action.payload)
          .pipe(
            map(
              (data: MergeCNResponse) => new CtGrfActions.MergeCNsSuccess(data)
            )
          );
      },
      onError: (action: CtGrfActions.MergeCNs, error: HttpErrorResponse) => {
        return new CtGrfActions.MergeCNsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() generateOTP$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.GENERATE_OTP,
    {
      run: (action: CtGrfActions.GenerateOTP) => {
        return this.ctGrfService
          .generateOTP(action.payload)
          .pipe(map(() => new CtGrfActions.GenerateOTPSuccess()));
      },
      onError: (action: CtGrfActions.GenerateOTP, error: HttpErrorResponse) => {
        return new CtGrfActions.GenerateOTPFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() validateOTP$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.VALIDATE_OTP,
    {
      run: (action: CtGrfActions.ValidateOTP) => {
        return this.ctGrfService
          .validateOTP(action.payload)
          .pipe(map(() => new CtGrfActions.ValidateOTPSuccess()));
      },
      onError: (action: CtGrfActions.ValidateOTP, error: HttpErrorResponse) => {
        return new CtGrfActions.ValidateOTPFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() grfHistory$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.LOAD_GRF_HISTORY,
    {
      run: (action: CtGrfActions.LoadGrfHistory) => {
        return this.ctGrfService
          .getAdvanceHistoryItems(
            action.subTransactionType,
            action.payload,
            action.searchField,
            action.searchType,
            action.status,
            action.page,
            action.size
          )
          .pipe(
            map(
              (data: AdvanceHistoryResponse) =>
                new CtGrfActions.LoadGrfHistorySuccess(data)
            )
          );
      },
      onError: (
        action: CtGrfActions.LoadGrfHistory,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.LoadGrfHistoryFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadCNValidation$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.LOAD_CN_VALIDATION_DETAILS,
    {
      run: (action: CtGrfActions.LoadCNValidation) => {
        return this.ctGrfService
          .getCNValidationDetails(action.payload)
          .pipe(
            map((data: any) => new CtGrfActions.LoadCNValidationSuccess(data))
          );
      },
      onError: (
        action: CtGrfActions.LoadCNValidation,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.LoadCNValidationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.FILE_UPLOAD,
    {
      run: (action: CtGrfActions.FileUpload) => {
        return this.ctGrfService
          .uploadFile(action.payload)
          .pipe(map((data: any) => new CtGrfActions.FileUploadSuccess(true)));
      },

      onError: (action: CtGrfActions.FileUpload, error: HttpErrorResponse) => {
        return new CtGrfActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: CtGrfActions.FileUploadList) => {
        return this.ctGrfService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new CtGrfActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: CtGrfActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.FileUploadListFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    CtGrfActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: CtGrfActions.FileDownloadUrl) => {
        return this.ctGrfService
          .downloadFile(action.payload)
          .pipe(
            map((data: string) => new CtGrfActions.FileDownloadUrlSuccess(data))
          );
      },

      onError: (
        action: CtGrfActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new CtGrfActions.FileDownloadUrlFailure(
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
