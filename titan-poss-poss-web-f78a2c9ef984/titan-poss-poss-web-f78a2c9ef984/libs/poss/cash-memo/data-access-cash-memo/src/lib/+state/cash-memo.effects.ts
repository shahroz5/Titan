import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { CashMemoState } from './cash-memo.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CashMemoActionTypes } from './cash-memo.actions';
import * as CashMemoActions from './cash-memo.actions';
import { CashMemoService } from '../cash-memo.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  CreateCashMemoResponse,
  CashMemoDetailsResponse,
  CashMemoHistoryResponse,
  CashMemoItemDetails,
  MetalRates,
  FileUploadLists,
  TcsDataResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CommonService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class CashMemoEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<CashMemoState>,
    private cashMemoService: CashMemoService,
    private commonService: CommonService
  ) {}

  @Effect() createCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.CREATE_CASH_MEMO,
    {
      run: (action: CashMemoActions.CreateCashMemo) => {
        return this.cashMemoService
          .createCashMemo(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.requestDetails
          )
          .pipe(
            map((data: CreateCashMemoResponse) => {
              return new CashMemoActions.CreateCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: CashMemoActions.CreateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.CreateCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() viewCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.VIEW_CASH_MEMO,
    {
      run: (action: CashMemoActions.ViewCashMemo) => {
        return this.cashMemoService
          .viewCashMemo(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoDetailsResponse) => {
              return new CashMemoActions.ViewCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: CashMemoActions.ViewCashMemo,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.ViewCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO, {
    run: (action: CashMemoActions.PartialUpdateCashMemo) => {
      return this.cashMemoService
        .partialUpdateCashMemo(
          action.payload.id,
          action.payload.requestDetails,
          action.payload.txnType,
          action.payload.subTxnType
        )
        .pipe(
          map((data: CashMemoDetailsResponse) => {
            return new CashMemoActions.PartialUpdateCashMemoSuccess(data);
          })
        );
    },

    onError: (
      action: CashMemoActions.PartialUpdateCashMemo,
      error: HttpErrorResponse
    ) => {
      return new CashMemoActions.PartialUpdateCashMemoFailure({
        error: this.errorHandler(error),
        oldData: action.payload.oldData,
        isIGST: action.payload.requestDetails?.isIGST
      });
    }
  });

  @Effect() updateCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.UPDATE_CASH_MEMO,
    {
      run: (action: CashMemoActions.UpdateCashMemo) => {
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
              return new CashMemoActions.UpdateCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: CashMemoActions.UpdateCashMemo,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.UpdateCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.DELETE_CASH_MEMO,
    {
      run: (action: CashMemoActions.DeleteCashMemo) => {
        return this.cashMemoService
          .deleteCashMemo(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CreateCashMemoResponse) => {
              return new CashMemoActions.DeleteCashMemoSuccess(true);
            })
          );
      },

      onError: (
        action: CashMemoActions.DeleteCashMemo,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.DeleteCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updatePriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(CashMemoActionTypes.UPDATE_PRICE_DETAILS, {
    run: (action: CashMemoActions.UpdatePriceDetails) => {
      return this.cashMemoService
        .updatePriceDetails(
          action.payload.id,
          action.payload.txnType,
          action.payload.subTxnType
        )
        .pipe(
          map((data: CashMemoDetailsResponse) => {
            return new CashMemoActions.UpdatePriceDetailsSuccess({
              data: data,
              requestDetails: action.payload.requestDetails
            });
          })
        );
    },

    onError: (
      action: CashMemoActions.UpdatePriceDetails,
      error: HttpErrorResponse
    ) => {
      return new CashMemoActions.UpdatePriceDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() invokeOrderDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(CashMemoActionTypes.INVOKE_ORDER_DETAILS, {
    run: (action: CashMemoActions.InvokeOrderDetails) => {
      return this.cashMemoService
        .invokeOrderDetails(
          action.payload.txnType,
          action.payload.subTxnType,
          action.payload.requestDetails
        )
        .pipe(
          map((data: CashMemoDetailsResponse) => {
            return new CashMemoActions.InvokeOrderDetailsSuccess(data);
          })
        );
    },

    onError: (
      action: CashMemoActions.InvokeOrderDetails,
      error: HttpErrorResponse
    ) => {
      return new CashMemoActions.InvokeOrderDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadCashMemoHistory$: Observable<
    Action
  > = this.dataPersistence.fetch(CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY, {
    run: (action: CashMemoActions.LoadCashMemoHistory) => {
      return this.cashMemoService
        .loadCashMemoHistory(
          action.payload.txnType,
          action.payload.subTxnType,
          action.payload.page,
          action.payload.size,
          action.payload.sort,
          action.payload.filterOptions
        )
        .pipe(
          map((cashMemoHistoryResponse: CashMemoHistoryResponse) => {
            return new CashMemoActions.LoadCashMemoHistorySuccess(
              cashMemoHistoryResponse
            );
          })
        );
    },

    onError: (
      action: CashMemoActions.LoadCashMemoHistory,
      error: HttpErrorResponse
    ) => {
      return new CashMemoActions.LoadCashMemoHistoryFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadItemFromCashMemoHistory$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY,
    {
      run: (action: CashMemoActions.LoadItemFromCashMemoHistory) => {
        return this.cashMemoService
          .getItemFromCashMemo(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoItemDetails) => {
              return new CashMemoActions.LoadItemFromCashMemoHistorySuccess(
                data
              );
            })
          );
      },

      onError: (
        action: CashMemoActions.LoadItemFromCashMemoHistory,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.LoadItemFromCashMemoHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Manual CM
  @Effect() getMaterialPrices$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.GET_MATERIAL_PRICES,
    {
      run: (action: CashMemoActions.GetMaterialPrices) => {
        return this.commonService
          .getStandardMaterialPriceDetailsHistory(action.payload)
          .pipe(
            map(
              (data: MetalRates[]) =>
                new CashMemoActions.GetMaterialPricesSuccess(data)
            )
          );
      },

      onError: (
        action: CashMemoActions.GetMaterialPrices,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.GetMaterialPricesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.FILE_UPLOAD,
    {
      run: (action: CashMemoActions.FileUpload) => {
        return this.commonService
          .uploadFile(action.payload)
          .pipe(
            map((data: any) => new CashMemoActions.FileUploadSuccess(true))
          );
      },

      onError: (
        action: CashMemoActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: CashMemoActions.FileUploadList) => {
        return this.commonService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new CashMemoActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: CashMemoActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: CashMemoActions.FileDownloadUrl) => {
        return this.commonService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: string) => new CashMemoActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: CashMemoActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.FileDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadTcsDetail$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.LOAD_TCS_DETAIL,
    {
      run: (action: CashMemoActions.LoadTcsDetail) => {
        return this.cashMemoService
          .getTcsAmount(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: TcsDataResponse) => {
              return new CashMemoActions.LoadTcsDetailSuccess(data);
            })
          );
      },

      onError: (
        action: CashMemoActions.LoadTcsDetail,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.LoadTcsDetailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateMetalRate$: Observable<Action> = this.dataPersistence.fetch(
    CashMemoActionTypes.VALIDATE_METAL_RATE,
    {
      run: (action: CashMemoActions.ValidateMetalRate) => {
        return this.cashMemoService
          .validateMetalRate(
            action.payload.id,
            action.payload.status,
            action.payload.metalRates,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: any) => {
              return new CashMemoActions.ValidateMetalRateSuccess(data);
            })
          );
      },

      onError: (
        action: CashMemoActions.ValidateMetalRate,
        error: HttpErrorResponse
      ) => {
        return new CashMemoActions.ValidateMetalRateFailure(
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
