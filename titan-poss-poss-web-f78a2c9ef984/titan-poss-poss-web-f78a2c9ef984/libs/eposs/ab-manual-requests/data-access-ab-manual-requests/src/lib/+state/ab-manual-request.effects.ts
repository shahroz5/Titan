import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { AbManualRequestState } from './ab-manual-request.state';
import { AbManualRequestService } from '../ab-manual-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CashMemoDetailsResponse,
  ApprovalRequest,
  AbManualRequestDetails,
  AbManualRequestList,
  CustomErrors,
  AbManualItemDetails,
  FileUploadLists
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { AbManualRequestActionTypes } from './ab-manual-request.actions';
import * as AbManualRequestActions from './ab-manual-request.actions';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CashMemoService } from '@poss-web/poss/cash-memo/data-access-cash-memo';

@Injectable()
export class AbManualRequestEffects {
  constructor(
    private dataPersistence: DataPersistence<AbManualRequestState>,
    private abmanualRequestService: AbManualRequestService,
    private loggerService: LoggerService,
    private cashMemoService: CashMemoService
  ) {}
  @Effect()
  loadAbManualRequestList$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST,
    {
      run: (action: AbManualRequestActions.LoadAbManualRequestList) => {
        return this.abmanualRequestService
          .getAbManualRequestList(
            action.payload.approvalStatus,
            action.payload.appliedFilters,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.workflowType
          )
          .pipe(
            map((abmanualRequestList: AbManualRequestList[]) => {
              return new AbManualRequestActions.LoadAbManualRequestListSuccess(
                abmanualRequestList
              );
            })
          );
      },
      onError: (
        action: AbManualRequestActions.LoadAbManualRequestList,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.ClearAbManualRequestList();
      }
    }
  );
  @Effect()
  loadAbManualRequestDetails$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS,
    {
      run: (action: AbManualRequestActions.LoadAbManualRequestDetails) => {
        return this.abmanualRequestService
          .getAbManualRequestDetails(
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName,
            action.payload.workFlowType
          )
          .pipe(
            map(
              (abmanualRequestDetails: AbManualRequestDetails) =>
                new AbManualRequestActions.LoadAbManualRequestDetailsSuccess(
                  abmanualRequestDetails
                )
            )
          );
      },
      onError: (
        action: AbManualRequestActions.LoadAbManualRequestDetails,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.LoadAbManualRequestDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadAbManualProductList$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST,
    {
      run: (action: AbManualRequestActions.LoadAbManualProductList) => {
        return this.abmanualRequestService
          .getAbManualProductList(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (abmanualProductList: CashMemoDetailsResponse) =>
                new AbManualRequestActions.LoadAbManualProductListSuccess(
                  abmanualProductList
                )
            )
          );
      },
      onError: (
        action: AbManualRequestActions.LoadAbManualProductList,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.LoadAbManualProductListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadAbManualProductDetails$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS,
    {
      run: (action: AbManualRequestActions.LoadAbManualProductDetails) => {
        return this.abmanualRequestService
          .getAbManualProductDetails(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map(
              (abmanualProductDetails: AbManualItemDetails) =>
                new AbManualRequestActions.LoadAbManualProductDetailsSuccess([
                  abmanualProductDetails
                ])
            )
          );
      },
      onError: (
        action: AbManualRequestActions.LoadAbManualProductDetails,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.LoadAbManualProductDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // TODO: to be checked and removed, added for getting item details in eposs
  @Effect()
  loadProductDetails$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS,
    {
      run: (action: AbManualRequestActions.LoadProductDetails) => {
        return this.abmanualRequestService
          .getProductDetails(action.payload)
          .pipe(
            map(
              (productDetails: any) =>
                new AbManualRequestActions.LoadProductDetailsSuccess([
                  productDetails
                ])
            )
          );
      },
      onError: (
        action: AbManualRequestActions.LoadProductDetails,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.LoadProductDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  abmanualApprovalRequest$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST,
    {
      run: (action: AbManualRequestActions.AbManualApprovalRequest) => {
        return this.abmanualRequestService
          .getAbManualApprovalRequest(
            action.payload.isApprove,
            action.payload.requestBody,
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName
          )
          .pipe(
            map(
              (abmanualApprovalRequest: ApprovalRequest) =>
                new AbManualRequestActions.AbManualApprovalRequestSuccess(
                  abmanualApprovalRequest
                )
            )
          );
      },
      onError: (
        action: AbManualRequestActions.AbManualApprovalRequest,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.AbManualApprovalRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() confirmManualAbManual$: Observable<
    Action
  > = this.dataPersistence.fetch(
    AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual,
    {
      run: (action: AbManualRequestActions.ConfirmManualAbManual) => {
        return this.cashMemoService
          .updateCashMemo(
            action.payload.requestDetails,
            action.payload.id,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoDetailsResponse) => {
              return new AbManualRequestActions.ConfirmManualAbManualSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: AbManualRequestActions.ConfirmManualAbManual,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.ConfirmManualAbManualFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: AbManualRequestActions.FileUploadList) => {
        return this.abmanualRequestService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new AbManualRequestActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: AbManualRequestActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    AbManualRequestActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: AbManualRequestActions.FileDownloadUrl) => {
        return this.abmanualRequestService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) =>
                new AbManualRequestActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: AbManualRequestActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new AbManualRequestActions.FileDownloadUrlFailure(
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
