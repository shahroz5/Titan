import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { PrinterService } from '@poss-web/shared/util-common';
import { map } from 'rxjs/operators';
import { AdvanceBookingState } from './advance-booking.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { AdvanceBookingActionTypes } from './advance-booking.actions';
import * as AdvanceBookingActions from './advance-booking.actions';
import { AdvanceBookingService } from '../advance-booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  CreateCashMemoResponse,
  ABSearchResponse,
  AdvanceBookingDetailsResponse,
  FileUploadLists
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
@Injectable()
export class AdvanceBookingEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<AdvanceBookingState>,
    private advanceBookingService: AdvanceBookingService,
    private printerService: PrinterService
  ) {}

  @Effect() createCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.CREATE_CASH_MEMO,
    {
      run: (action: AdvanceBookingActions.CreateCashMemo) => {
        return this.advanceBookingService
          .createCashMemo(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.requestDetails
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.CreateCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.CreateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.CreateCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() viewCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.VIEW_CASH_MEMO,
    {
      run: (action: AdvanceBookingActions.ViewCashMemo) => {
        return this.advanceBookingService
          .viewCashMemo(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.ViewCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.ViewCashMemo,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.ViewCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchAB$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.SEARCH_AB,
    {
      run: (action: AdvanceBookingActions.SearchAB) => {
        return this.advanceBookingService.searchAB(action.payload).pipe(
          map((data: ABSearchResponse) => {
            return new AdvanceBookingActions.SearchABSuccess(data);
          })
        );
      },

      onError: (
        action: AdvanceBookingActions.SearchAB,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.SearchABFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO,
    {
      run: (action: AdvanceBookingActions.PartialUpdateCashMemo) => {
        return this.advanceBookingService
          .partialUpdateCashMemo(
            action.payload.id,
            action.payload.requestDetails,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.actionType
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.PartialUpdateCashMemoSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.PartialUpdateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.PartialUpdateCashMemoFailure({
          error: this.errorHandler(error),
          oldData: action.payload.oldData
        });
      }
    }
  );

  @Effect() freezeRate$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING,
    {
      run: (action: AdvanceBookingActions.FreezeAdvanceBooking) => {
        return this.advanceBookingService
          .updateABActions(
            action.payload.id,
            action.payload.requestDetails,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.actionType,
            action.payload.acknowledge
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.FreezeAdvanceBookingSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.FreezeAdvanceBooking,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.FreezeAdvanceBookingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.UPDATE_CASH_MEMO,
    {
      run: (action: AdvanceBookingActions.UpdateCashMemo) => {
        return this.advanceBookingService
          .updateCashMemo(
            action.payload.requestDetails,
            action.payload.id,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.UpdateCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.UpdateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.UpdateCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.DELETE_CASH_MEMO,
    {
      run: (action: AdvanceBookingActions.DeleteCashMemo) => {
        return this.advanceBookingService
          .deleteCashMemo(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CreateCashMemoResponse) => {
              return new AdvanceBookingActions.DeleteCashMemoSuccess(true);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.DeleteCashMemo,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.DeleteCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updatePriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS,
    {
      run: (action: AdvanceBookingActions.UpdatePriceDetails) => {
        return this.advanceBookingService
          .updatePriceDetails(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.action
          )
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.UpdatePriceDetailsSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.UpdatePriceDetails,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.UpdatePriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadWorkflowDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.LOAD_WORKFLOW_DETAILS,
    {
      run: (action: AdvanceBookingActions.LoadWorkflowDeatils) => {
        return this.advanceBookingService
          .loadWorkflowDeatils(action.payload)
          .pipe(
            map((data: AdvanceBookingDetailsResponse) => {
              return new AdvanceBookingActions.LoadWorkflowDeatilsSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.LoadWorkflowDeatils,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.LoadWorkflowDeatilsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() billCancelList$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.LOAD_REQUESTS,
    {
      run: (action: AdvanceBookingActions.LoadRequests) => {
        return this.advanceBookingService
          .getloadRequest(action.payload)
          .pipe(
            map(
              (data: any) => new AdvanceBookingActions.LoadRequestsSuccess(data)
            )
          );
      },

      onError: (
        action: AdvanceBookingActions.LoadRequests,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.LoadRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.FILE_UPLOAD,
    {
      run: (action: AdvanceBookingActions.FileUpload) => {
        return this.advanceBookingService
          .uploadFile(action.payload)
          .pipe(
            map(
              (data: any) => new AdvanceBookingActions.FileUploadSuccess(true)
            )
          );
      },

      onError: (
        action: AdvanceBookingActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.FileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: AdvanceBookingActions.FileUploadList) => {
        return this.advanceBookingService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new AdvanceBookingActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: AdvanceBookingActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: AdvanceBookingActions.FileDownloadUrl) => {
        return this.advanceBookingService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) =>
                new AdvanceBookingActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: AdvanceBookingActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.FileDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateMetalRate$: Observable<Action> = this.dataPersistence.fetch(
    AdvanceBookingActionTypes.VALIDATE_METAL_RATE,
    {
      run: (action: AdvanceBookingActions.ValidateMetalRate) => {
        return this.advanceBookingService
          .validateMetalRate(
            action.payload.id,
            action.payload.status,
            action.payload.metalRates,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: any) => {
              return new AdvanceBookingActions.ValidateMetalRateSuccess(data);
            })
          );
      },

      onError: (
        action: AdvanceBookingActions.ValidateMetalRate,
        error: HttpErrorResponse
      ) => {
        return new AdvanceBookingActions.ValidateMetalRateFailure(
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
