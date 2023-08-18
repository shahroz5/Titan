import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  AddOrUpdateTepItemResponse,
  AdvanceBookingDetailsResponse,
  CancelResponse,
  CancelTEPResponse,
  ConfirmTepItemResponse,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  CustomErrors,
  CustomerTownEnum,
  CUSTOMER_TYPE_ENUM,
  DeleteTepItemResponse,
  DiscountsList,
  GetTepCashMemoResponse,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsResponse,
  GoldPlusLocation,
  RsoNameObject,
  StoreUser,
  TepItemResponse,
  TepTransactionResponse,
  TepTypes
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TepService } from '../direct-tep.service';
import * as TepActions from './direct-tep.actions';
import { TepActionTypes } from './direct-tep.actions';

@Injectable()
export class TepEffects {
  constructor(
    private dataPersistence: DataPersistence<TepEffects>,
    private tepService: TepService,
    private loggerService: LoggerService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect() loadRsoList$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.LOAD_RSO_LIST,
    {
      run: (action: TepActions.LoadRsoList) => {
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
              return new TepActions.LoadRsoListSuccess(employeeCodes);
            })
          );
      },

      onError: (action: TepActions.LoadRsoList, error: HttpErrorResponse) => {
        return new TepActions.LoadRsoListFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadStuddedProducts$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_STUDDED_PRODUCT_DETAILS, {
    run: (action: TepActions.LoadStuddedProductDetails) => {
      return this.tepService
        .loadProductGroupCodes(action.productType, action.transactionType)
        .pipe(
          map((data: string[]) => {
            return new TepActions.LoadStuddedProductDetailsSuccess(data);
          })
        );
    },
    onError: (
      action: TepActions.LoadStuddedProductDetails,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadStuddedProductDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() initiateTepOpenTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.CREATE_OPEN_TEP_TRANSACTION, {
    run: (action: TepActions.CreateOpenTepTransaction) => {
      return this.tepService
        .initiateTepOpenTransaction(
          action.subTransactionType,
          action.requestPayload
        )
        .pipe(
          map(
            (data: CreateOpenTepTransactionResponse) =>
              new TepActions.CreateOpenTepTransactionSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.CreateOpenTepTransaction,
      error: HttpErrorResponse
    ) => {
      return new TepActions.CreateOpenTepTransactionFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() updateTepOpenTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.UPDATE_OPEN_TEP_TRANSACTION, {
    run: (action: TepActions.UpdateOpenTepTransaction) => {
      return this.tepService
        .updateTepOpenTransaction(
          action.id,
          action.subTransactionType,
          action.requestPayload
        )
        .pipe(
          map(
            (data: CreateOpenTepTransactionResponse) =>
              new TepActions.UpdateOpenTepTransactionSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.UpdateOpenTepTransaction,
      error: HttpErrorResponse
    ) => {
      return new TepActions.UpdateOpenTepTransactionFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getTepItemConfiguration$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.GET_TEP_ITEM_CONFIGURATION, {
    run: (action: TepActions.GetTepItemConfiguration) => {
      return this.tepService
        .getTepItemConfiguration(
          action.itemCode,
          action.tepType,
          action.isDummy,
          action.customerMobileNo
        )
        .pipe(
          map(
            (data: GetTepItemConfiguratonResponse) =>
              new TepActions.GetTepItemConfigurationSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.GetTepItemConfiguration,
      error: HttpErrorResponse
    ) => {
      return new TepActions.GetTepItemConfigurationFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getTepItemExceptionConfiguration$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.GET_TEP_ITEM_EXCEPTION_CONFIGURATION,
    {
      run: (action: TepActions.GetTepItemExceptionConfiguration) => {
        return this.tepService
          .getTepItemConfiguration(
            action.itemCode,
            action.tepType,
            action.isDummy,
            action.customerMobileNo
          )
          .pipe(
            map(
              (data: GetTepItemConfiguratonResponse) =>
                new TepActions.GetTepItemExceptionConfigurationSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.GetTepItemExceptionConfiguration,
        error: HttpErrorResponse
      ) => {
        return new TepActions.GetTepItemExceptionConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() refundCashLimit$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.LOAD_REFUND_CASH_LIMIT,
    {
      run: (action: TepActions.LoadRefundCashLimit) => {
        return this.tepService
          .getRefundCashLimit(
            action.customerId,
            action.refundAmt,
            action.txnType
          )
          .pipe(
            map((data: any) => new TepActions.LoadRefundCashLimitSuccess(data))
          );
      },

      onError: (
        action: TepActions.LoadRefundCashLimit,
        error: HttpErrorResponse
      ) => {
        return new TepActions.LoadRefundCashLimitFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getCmListItemTepConfiguration$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.LOAD_CM_LIST_ITEM_TEP_CONFIGURATION,
    {
      run: (action: TepActions.LoadCmListItemTepConfiguration) => {
        return this.tepService
          .getTepItemConfiguration(
            action.itemCode,
            action.tepType,
            action.isDummy,
            action.customerMobileNo
          )
          .pipe(
            map(
              (data: GetTepItemConfiguratonResponse) =>
                new TepActions.LoadCmListItemTepConfigurationSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.LoadCmListItemTepConfiguration,
        error: HttpErrorResponse
      ) => {
        return new TepActions.LoadCmListItemTepConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadWorkflowDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_WORKFLOW_DETAILS, {
    run: (action: TepActions.LoadWorkflowDeatils) => {
      return this.tepService.loadWorkflowDeatils(action.payload).pipe(
        map((data: AdvanceBookingDetailsResponse) => {
          return new TepActions.LoadWorkflowDeatilsSuccess(data);
        })
      );
    },

    onError: (
      action: TepActions.LoadWorkflowDeatils,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadWorkflowDeatilsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getTepCashMemoItemsList$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.GET_TEP_CASH_MEMO_ITEM_LIST, {
    run: (action: TepActions.GetTepCashMemoItemList) => {
      return this.tepService
        .getTepCashMemoItemsList(
          action.locationCode,
          action.refDocNo,
          action.refFiscalYear,
          action.subTransactionType,
          action.mobileNumber
        )
        .pipe(
          map((data: GetTepCashMemoResponse) => {
            return new TepActions.GetTepCashMemoItemListSuccess(data);
          })
        );
    },
    onError: (
      action: TepActions.GetTepCashMemoItemList,
      error: HttpErrorResponse
    ) => {
      return new TepActions.GetTepCashMemoItemListFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() addTepItem$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.ADD_TEP_ITEM,
    {
      run: (action: TepActions.AddTepItem) => {
        return this.tepService
          .addTepItem(
            action.id,
            action.subTransactionType,
            action.requestPayload
          )
          .pipe(
            map(
              (data: AddOrUpdateTepItemResponse) =>
                new TepActions.AddTepItemSuccess(data)
            )
          );
      },
      onError: (action: TepActions.AddTepItem, error: HttpErrorResponse) => {
        return new TepActions.AddTepItemFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getTepItemPriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_TEP_ITEM_PRICE_DETAILS, {
    run: (action: TepActions.LoadTepItemPriceDetails) => {
      return this.tepService
        .getTepItemPriceDetails(
          action.requestPayload,
          action.locationCode,
          action.customerId,
          action.isFullValueTep
        )
        .pipe(
          map((data: GetTepPriceDetailsResponse) => {
            if (
              action.customerType !== CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
              action.tepType !== CreateTepTypesEnum.FULL_VALUE_TEP &&
              action.tepType !== CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP
            ) {
              data.taxDetails = null;
            }
            return new TepActions.LoadTepItemPriceDetailsSuccess(data);
          })
        );
    },
    onError: (
      action: TepActions.LoadTepItemPriceDetails,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadTepItemPriceDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() updateTepItemPriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.UPDATE_TEP_ITEM_PRICE_DETAILS, {
    run: (action: TepActions.UpdateTepItemPriceDetails) => {
      return this.tepService
        .getTepItemPriceDetails(action.requestPayload)
        .pipe(
          map(
            (data: GetTepPriceDetailsResponse) =>
              new TepActions.UpdateTepItemPriceDetailsSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.UpdateTepItemPriceDetails,
      error: HttpErrorResponse
    ) => {
      return new TepActions.UpdateTepItemPriceDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() updateTepItemInGrid$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.UPDATE_TEP_ITEM, {
    run: (action: TepActions.UpdateTepItem) => {
      return this.tepService
        .updateTepItemInGrid(
          action.id,
          action.itemId,
          action.subTransactionType,
          action.requestPayload
        )
        .pipe(
          map(
            (data: AddOrUpdateTepItemResponse) =>
              new TepActions.UpdateTepItemSuccess(data)
          )
        );
    },
    onError: (action: TepActions.UpdateTepItem, error: HttpErrorResponse) => {
      return new TepActions.UpdateTepItemFailure(this.errorHandler(error));
    }
  });

  @Effect() confirmOrHoldTep$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.CONFIRM_TEP,
    {
      run: (action: TepActions.ConfirmTep) => {
        return this.tepService
          .confirmOrHoldTep(
            action.id,
            action.status,
            action.subTransactionType,
            action.requestPayload
          )
          .pipe(
            map(
              (data: ConfirmTepItemResponse) =>
                new TepActions.ConfirmTepSuccess(data)
            )
          );
      },
      onError: (action: TepActions.ConfirmTep, error: HttpErrorResponse) => {
        return new TepActions.ConfirmTepFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() confirmRequestTep$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.CONFIRM_TEP_REQUEST,
    {
      run: (action: TepActions.ConfirmTepRequest) => {
        return this.tepService
          .confirmRequestTep(
            action.id,
            action.status,
            action.subTransactionType,
            action.workflowType,
            action.requestPayload
          )
          .pipe(
            map(
              (data: ConfirmTepItemResponse) =>
                new TepActions.ConfirmTepRequestSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.ConfirmTepRequest,
        error: HttpErrorResponse
      ) => {
        return new TepActions.ConfirmTepRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() cancel$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.CANCEL,
    {
      run: (action: TepActions.CancelRequest) => {
        return this.tepService
          .cancel(action.processID, action.workflow)
          .pipe(
            map(
              (data: CancelTEPResponse) =>
                new TepActions.CancelRequestSuccess(data)
            )
          );
      },

      onError: (action: TepActions.CancelRequest, error: HttpErrorResponse) => {
        return new TepActions.CancelRequestFailure(this.errorHandler(error));
      }
    }
  );
  @Effect() cancelTEP$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.CANCEL_TEP,
    {
      run: (action: TepActions.CancelTEPRequest) => {
        return this.tepService
          .cancelTEP(action.paylaod)
          .pipe(
            map(
              (data: CancelResponse) =>
                new TepActions.CancelTEPRequestSuccess(data)
            )
          );
      },

      onError: (
        action: TepActions.CancelTEPRequest,
        error: HttpErrorResponse
      ) => {
        return new TepActions.CancelTEPRequestFailure(this.errorHandler(error));
      }
    }
  );
  @Effect() deleteTepItem$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.DELETE_TEP_ITEM,
    {
      run: (action: TepActions.DeleteTepItem) => {
        return this.tepService
          .deleteTepItem(action.id, action.itemId, action.subTransactionType)
          .pipe(
            map(
              (data: DeleteTepItemResponse) =>
                new TepActions.DeleteTepItemSuccess(data)
            )
          );
      },
      onError: (action: TepActions.DeleteTepItem, error: HttpErrorResponse) => {
        return new TepActions.DeleteTepItemFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getTepItemCodeDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_TEP_ITEM_CODE_DETAILS, {
    run: (action: TepActions.LoadTepItemCodeDetails) => {
      return this.tepService
        .getTepItemCodeDetails(action.itemCode)
        .pipe(
          map(
            (data: string) => new TepActions.LoadTepItemCodeDetailsSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.LoadTepItemCodeDetails,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadTepItemCodeDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getTepItemDetails$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.LOAD_TEP_ITEM_DETAILS,
    {
      run: (action: TepActions.LoadTepItemDetails) => {
        return this.tepService
          .getTepItemDetails(
            action.id,
            action.itemId,
            action.subTransactionType,
            action.tepType,
            action.mobileNumber
          )
          .pipe(
            map(
              (data: TepItemResponse) =>
                new TepActions.LoadTepItemDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.LoadTepItemDetails,
        error: HttpErrorResponse
      ) => {
        return new TepActions.LoadTepItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getTepTransactionDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_TEP_TRANSACTION_DETAILS, {
    run: (action: TepActions.LoadTepTransactionDetails) => {
      return this.tepService
        .getTepTransactionDetails(
          action.id,
          action.subTransactionType,
          action.recalculate,
          action.isTepException
        )
        .pipe(
          map(
            (data: TepTransactionResponse) =>
              new TepActions.LoadTepTransactionDetailsSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.LoadTepTransactionDetails,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadTepTransactionDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() deleteTepTransactionDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.DELETE_TEP_TRANSACTION_DETAILS,
    {
      run: (action: TepActions.DeleteTepTransactionDetails) => {
        return this.tepService
          .deleteTepTransactionDetails(action.id, action.subTransactionType)
          .pipe(
            map(
              (data: TepTransactionResponse) =>
                new TepActions.DeleteTepTransactionDetailsSuccess('Success')
            )
          );
      },
      onError: (
        action: TepActions.DeleteTepTransactionDetails,
        error: HttpErrorResponse
      ) => {
        return new TepActions.DeleteTepTransactionDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGoldPlusLocations$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_GOLD_PLUS_LOCATIONS, {
    run: (action: TepActions.LoadGoldPlusLocations) => {
      return this.tepService
        .getGoldPlusLocationDetails(action.payload)
        .pipe(
          map(
            (data: GoldPlusLocation[]) =>
              new TepActions.LoadGoldPlusLocationsSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.LoadGoldPlusLocations,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadGoldPlusLocationsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.FILE_UPLOAD,
    {
      run: (action: TepActions.FileUpload) => {
        return this.tepService
          .uploadFile(action.payload)
          .pipe(map((data: any) => new TepActions.FileUploadSuccess(true)));
      },

      onError: (action: TepActions.FileUpload, error: HttpErrorResponse) => {
        return new TepActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileIdProofDownload$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.FILE_ID_PROOF_DOWNLOAD_URL, {
    run: (action: TepActions.FileIdProofDownloadUrl) => {
      return this.tepService
        .downloadFile(action.payload)
        .pipe(
          map((data: any) => new TepActions.FileIdProofDownloadUrlSuccess(data))
        );
    },

    onError: (
      action: TepActions.FileIdProofDownloadUrl,
      error: HttpErrorResponse
    ) => {
      return new TepActions.FileIdProofDownloadUrlFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() getFileCancelledChequeDownload$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.FILE_CANCELLED_CHEQUE_DOWNLOAD_URL,
    {
      run: (action: TepActions.FileCancelledChequeDownloadUrl) => {
        return this.tepService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) =>
                new TepActions.FileCancelledChequeDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: TepActions.FileCancelledChequeDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new TepActions.FileCancelledChequeDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileApprovalMailDownload$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.FILE_APPROVAL_MAIL_DOWNLOAD_URL,
    {
      run: (action: TepActions.FileApprovalMailDownloadUrl) => {
        return this.tepService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: any) =>
                new TepActions.FileApprovalMailDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: TepActions.FileApprovalMailDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new TepActions.FileApprovalMailDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFtepReasons$: Observable<Action> = this.dataPersistence.fetch(
    TepActionTypes.LOAD_FTEP_REASONS,
    {
      run: (action: TepActions.LoadFtepReasons) => {
        return this.tepService
          .getFullValueTepReasons()
          .pipe(
            map((data: string[]) => new TepActions.LoadFtepReasonsSuccess(data))
          );
      },
      onError: (
        action: TepActions.LoadFtepReasons,
        error: HttpErrorResponse
      ) => {
        return new TepActions.LoadFtepReasonsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() updateTepTransactionPriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.UPDATE_TEP_TRANSACTION_PRICE_DETAILS,
    {
      run: (action: TepActions.UpdateTepTransactionPriceDetails) => {
        return this.tepService
          .updateTepTransactionPriceDetails(action.id, action.subTxnType)
          .pipe(
            map(
              (data: any) =>
                new TepActions.UpdateTepTransactionPriceDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.UpdateTepTransactionPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new TepActions.UpdateTepTransactionPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() createOpenCutPieceTepTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.CREATE_OPEN_CUT_PIECE_TEP_TRANSACTION,
    {
      run: (action: TepActions.CreateOpenCutPieceTepTransaction) => {
        return this.tepService
          .createOpenCutPieceTepTransaction()
          .pipe(
            map(
              (data: any) =>
                new TepActions.CreateOpenCutPieceTepTransactionSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.CreateOpenCutPieceTepTransaction,
        error: HttpErrorResponse
      ) => {
        return new TepActions.CreateOpenCutPieceTepTransactionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() patchCutPieceTepTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.PATCH_CUT_PIECE_TEP_TRANSACTION,
    {
      run: (action: TepActions.PatchCutPieceTepTransaction) => {
        return this.tepService
          .patchCutPieceTepTransaction(action.id, action.payload)
          .pipe(
            map(
              (data: any) =>
                new TepActions.PatchCutPieceTepTransactionSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.PatchCutPieceTepTransaction,
        error: HttpErrorResponse
      ) => {
        return new TepActions.PatchCutPieceTepTransactionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() addCutPieceTepItemInTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.ADD_CUT_PIECE_TEP_ITEM, {
    run: (action: TepActions.AddCutPieceTepItem) => {
      return this.tepService
        .addCutPieceTepTransactionItem(action.id, action.payload)
        .pipe(
          map((data: any) => new TepActions.AddCutPieceTepItemSuccess(data))
        );
    },
    onError: (
      action: TepActions.AddCutPieceTepItem,
      error: HttpErrorResponse
    ) => {
      return new TepActions.AddCutPieceTepItemFailure(this.errorHandler(error));
    }
  });

  @Effect() patchCutPieceTepItemInTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.PATCH_CUT_PIECE_TEP_ITEM, {
    run: (action: TepActions.PatchCutPieceTepItem) => {
      return this.tepService
        .patchCutPieceTepTransactionItem(
          action.id,
          action.itemId,
          action.payload
        )
        .pipe(
          map((data: any) => new TepActions.PatchCutPieceTepItemSuccess(data))
        );
    },
    onError: (
      action: TepActions.PatchCutPieceTepItem,
      error: HttpErrorResponse
    ) => {
      return new TepActions.PatchCutPieceTepItemFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() confirmCutPieceTepItemInTransaction$: Observable<
    Action
  > = this.dataPersistence.fetch(
    TepActionTypes.CONFIRM_CUT_PIECE_TEP_TRANSACTION,
    {
      run: (action: TepActions.ConfirmCutPieceTepTransaction) => {
        return this.tepService
          .confirmCutPieceTepTransactionItem(action.id, action.payload)
          .pipe(
            map(
              (data: any) =>
                new TepActions.ConfirmCutPieceTepTransactionSuccess(data)
            )
          );
      },
      onError: (
        action: TepActions.ConfirmCutPieceTepTransaction,
        error: HttpErrorResponse
      ) => {
        return new TepActions.ConfirmCutPieceTepTransactionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadAvailableDiscounts$: Observable<
    Action
  > = this.dataPersistence.fetch(TepActionTypes.LOAD_AVAILABLE_DISCOUNTS_LIST, {
    run: (action: TepActions.LoadAvailableDiscountsList) => {
      return this.tepService
        .getAvailableDiscounts(action.payload)
        .pipe(
          map(
            (data: DiscountsList[]) =>
              new TepActions.LoadAvailableDiscountsListSuccess(data)
          )
        );
    },
    onError: (
      action: TepActions.LoadAvailableDiscountsList,
      error: HttpErrorResponse
    ) => {
      return new TepActions.LoadAvailableDiscountsListFailure(
        this.errorHandler(error)
      );
    }
  });

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
