import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import {
  OtherReceiptsActionTypes,
  LoadReceiptsSTNCount,
  LoadReceiptsSTNCountSuccess,
  LoadReceiptsSTNCountFailure
} from './other-receipts.actions';

import * as otherRecieptissuesActions from './other-receipts.actions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { OtherReceiptState } from './other-receipts.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  OtherReceiptsDataModel,
  OtherReceiptsModel,
  OtherReceiptItem,
  BinCode,
  Lov,
  ItemSummary,
  AdjustmentItem,
  ProductCategory,
  ProductGroup,
  CustomErrors,
  LoadOtherReceiptsSTNCountPayload,
  OtherReceiptLoadItemsTotalCountSuccessPayload,
  ImageResponse
} from '@poss-web/shared/models';
import { OtherReceiptService } from '../other-receipts.service';
import {
  CommonService,
  InventoryValidationService
} from '@poss-web/shared/common/data-access-common';
import {
  BinDataService,
  LovDataService,
  ItemDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { OTHER_RECEIPT_FEATURE_KEY } from './other-receipts.reducer';
@Injectable()
export class OtherReceiptsEffect {
  @Effect() loadOtherReceiptsCount$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT,
    {
      // provides an action and the current state of the store
      run: (action: LoadReceiptsSTNCount, state: OtherReceiptState) => {
        return this.otherReceiptService
          .getOtherReceiptsSTNCount()
          .pipe(
            map(
              (data: LoadOtherReceiptsSTNCountPayload) =>
                new LoadReceiptsSTNCountSuccess(data)
            )
          );
      },

      onError: (action: LoadReceiptsSTNCount, error: HttpErrorResponse) => {
        return new LoadReceiptsSTNCountFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadReceiptList$: Observable<Action> = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_RECEIPT_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadRecieptList) => {
        return this.otherReceiptService
          .getReceiptsList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherReceiptsDataModel) =>
                new otherRecieptissuesActions.LoadRecieptListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadRecieptList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadRecieptListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReceiptLoanList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadRecieptLoanList) => {
        return this.otherReceiptService
          .getReceiptsList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherReceiptsDataModel) =>
                new otherRecieptissuesActions.LoadRecieptLoanListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadRecieptLoanList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadRecieptLoanListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() printOtherIssues$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.PRINT_OTHER_RECIVES,
    {
      run: (action: otherRecieptissuesActions.PrintOtherReceives) => {
        return this.otherReceiptService
          .printOtherIssue(action.payload.id, action.payload.requestType)
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.PrintOtherReceivesSuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.PrintOtherReceives,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.PrintOtherReceivesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchPendingReceiptsStocks$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS,
    {
      run: (action: otherRecieptissuesActions.SearchPendingReceipts) => {
        return this.otherReceiptService
          .searchRecieptsStocks(
            action.payload.srcDocnumber,
            action.payload.type
          )
          .pipe(
            map(
              (searchresult: OtherReceiptsModel[]) =>
                new otherRecieptissuesActions.SearchPendingReceiptsSuccess(
                  searchresult
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.SearchPendingReceipts,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.SearchPendingReceiptsSuccess([]);
      }
    }
  );

  @Effect()
  loadItemsTotalCount$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_ItEMS_COUNT,
    {
      run: (action: otherRecieptissuesActions.LoadItemsTotalCount) => {
        return this.otherReceiptService
          .getOtherReceiveItemsCount(
            action.payload.transactionType,
            action.payload.id
          )
          .pipe(
            map(
              (
                loadItemsTotalCountSuccessPayload: OtherReceiptLoadItemsTotalCountSuccessPayload
              ) =>
                new otherRecieptissuesActions.LoadItemsTotalCountSuccess(
                  loadItemsTotalCountSuccessPayload
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNonVerifiedItems$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS,
    {
      run: (action: otherRecieptissuesActions.LoadNonVerifiedItems, state) => {
        return this.otherReceiptService
          .getTempSortItems(
            action.payload.id,
            'ISSUED',
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sortBy,
            action.payload.property,
            action.payload.transactionType,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.sort,
            action.payload.filter
          )
          .pipe(
            map(
              (data: { items: OtherReceiptItem[]; count: number }) =>
                new otherRecieptissuesActions.LoadNonVerifiedItemsSuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadNonVerifiedItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadNonVerifiedItemsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadVerifiedItems$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS,
    {
      run: (action: otherRecieptissuesActions.LoadVerifiedItems, state) => {
        return this.otherReceiptService
          .getTempSortItems(
            action.payload.id,
            'VERIFIED',
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sortBy,
            action.payload.property,
            action.payload.transactionType,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.sort,
            action.payload.filter
          )
          .pipe(
            map(
              (data: { items: OtherReceiptItem[]; count: number }) =>
                new otherRecieptissuesActions.LoadVerifiedItemsSuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadVerifiedItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadVerifiedItemsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadBins$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_BIN_CODES,
    {
      run: (action: otherRecieptissuesActions.LoadBinCodes) => {
        return this.binDataService
          .getBinDetails(action.payload, false)
          .pipe(
            map(
              (bins: BinCode[]) =>
                new otherRecieptissuesActions.LoadBinCodesSuccess(bins)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadBinCodes,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadBinCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRemarks$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_REMARKS,
    {
      run: (action: otherRecieptissuesActions.LoadRemarks) => {
        return this.lovDataService
          .getInventoryLovs('DEFECTTYPE')
          .pipe(
            map(
              (remarks: Lov[]) =>
                new otherRecieptissuesActions.LoadRemarksSuccess(remarks)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadRemarks,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadRemarksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // TODO : check pessimisticUpdate
  @Effect()
  verifyItem$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.VERIFY_ITEM,
    {
      run: (action: otherRecieptissuesActions.VerifyItem, state) => {
        return this.otherReceiptService
          .verifyOtherReceiptItem(
            action.payload.id,
            action.payload.itemId,
            action.payload.newUpdate,
            action.payload.transactionType,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (item: OtherReceiptItem) =>
                new otherRecieptissuesActions.VerifyItemSuccess(item)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.VerifyItem,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.VerifyItemFailure({
          itemId: action.payload.itemId,
          actualDetails: action.payload.actualDetails,
          error: this.errorHandler(error)
        });
      }
    }
  );
  @Effect()
  validateNonVerifiedItem$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM,
    {
      run: (action: otherRecieptissuesActions.ValidateNonVerifiedItem) => {
        return this.inventoryValidationService
          .validateWeightTolerance(
            action.payload.productGroupCode,
            action.payload.availableWeight,
            action.payload.measuredWeight,
            action.payload.measuredQuantity,
            action.payload.availableQuantity
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new otherRecieptissuesActions.ValidateNonVerifiedItemSuccess({
                  itemId: action.payload.itemId,
                  isSuccess: true
                })
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ValidateNonVerifiedItem,
        error: HttpErrorResponse
      ) => {
        const err = CustomErrorAdaptor.fromJson(error);
        if (err.code === ErrorEnums.ERR_INV_028) {
          return new otherRecieptissuesActions.ValidateNonVerifiedItemSuccess({
            itemId: action.payload.itemId,
            isSuccess: false
          });
        } else {
          return new otherRecieptissuesActions.ValidateNonVerifiedItemFailure({
            itemId: action.payload.itemId,
            error: this.errorHandler(error)
          });
        }
      }
    }
  );
  @Effect()
  validateVerifiedItem$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM,
    {
      run: (action: otherRecieptissuesActions.ValidateVerifiedItem) => {
        return this.inventoryValidationService
          .validateWeightTolerance(
            action.payload.productGroupCode,
            action.payload.availableWeight,
            action.payload.measuredWeight,
            action.payload.measuredQuantity,
            action.payload.availableQuantity
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new otherRecieptissuesActions.ValidateVerifiedItemSuccess({
                  itemId: action.payload.itemId,
                  isSuccess: true
                })
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ValidateVerifiedItem,
        error: HttpErrorResponse
      ) => {
        const err = CustomErrorAdaptor.fromJson(error);
        if (err.code === ErrorEnums.ERR_INV_028) {
          return new otherRecieptissuesActions.ValidateVerifiedItemSuccess({
            itemId: action.payload.itemId,
            isSuccess: false
          });
        } else {
          return new otherRecieptissuesActions.ValidateVerifiedItemFailure({
            itemId: action.payload.itemId,
            error: this.errorHandler(error)
          });
        }
      }
    }
  );
  @Effect()
  updateItem$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.UPADTE_ITEM,
    {
      run: (action: otherRecieptissuesActions.UpdateItem, state) => {
        return this.otherReceiptService
          .verifyOtherReceiptItem(
            action.payload.id,
            action.payload.itemId,
            action.payload.newUpdate,
            action.payload.transactionType,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (item: OtherReceiptItem) =>
                new otherRecieptissuesActions.UpdateItemSuccess(item)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.UpdateItem,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.UpdateItemFailure({
          itemId: action.payload.itemId,
          actualDetails: action.payload.actualDetails,
          error: this.errorHandler(error)
        });
      }
    }
  );

  @Effect()
  verifyAllItems$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.VERIFY_ALL_ITEMS,
    {
      run: (action: otherRecieptissuesActions.VerifyAllItems) => {
        return this.otherReceiptService
          .updateAllOtherReceiptItems(
            action.payload.id,
            action.payload.data,
            action.payload.transactionType
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new otherRecieptissuesActions.VerifyAllItemsSuccess(isSuccess)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.VerifyAllItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.VerifyAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  assignBinToAllItems$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS,
    {
      run: (action: otherRecieptissuesActions.AssignBinToAllItems) => {
        return this.otherReceiptService
          .updateAllOtherReceiptItems(
            action.payload.id,
            action.payload.data,
            action.payload.transactionType
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new otherRecieptissuesActions.AssignBinToAllItemsSuccess(
                  isSuccess
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.AssignBinToAllItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.AssignBinToAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmStock$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE,
    {
      run: (action: otherRecieptissuesActions.ConfirmStockReceive) => {
        return this.otherReceiptService
          .confirmOtherReceiveStn(
            action.payload.id,
            action.payload.confirmReceive,
            action.payload.transactionType
          )
          .pipe(
            map(
              (confirmedStock: any) =>
                new otherRecieptissuesActions.ConfirmStockReceiveSuccess(
                  confirmedStock
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ConfirmStockReceive,
        httpErrorResponse: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.ConfirmStockReceiveFailure(
          this.errorHandler(httpErrorResponse)
        );
      }
    }
  );

  @Effect() loadSeletedStock$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_SELECTED_STOCK,
    {
      run: (action: otherRecieptissuesActions.LoadSelectedStock) => {
        return this.otherReceiptService
          .getOtherReceiptStock(
            action.payload.id,
            action.payload.transactionType
          )
          .pipe(
            map(
              (stockTransferNote: OtherReceiptsModel) =>
                new otherRecieptissuesActions.LoadSelectedStockSuccess(
                  stockTransferNote
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadSelectedStock,
        httpErrorResponse: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedStockFailure(
          this.errorHandler(httpErrorResponse)
        );
      }
    }
  );
  @Effect() adjustmentSearch$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.ADJUSTMENT_SEARCH,
    {
      run: (action: otherRecieptissuesActions.AdjustmentSearch, state) => {
        return this.itemDataService
          .getItemSummaryByCode(
            action.payload.variantCode,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (item: ItemSummary) =>
                new otherRecieptissuesActions.AdjustmentSearchSuccess(item)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.AdjustmentSearch,
        httpErrorResponse: HttpErrorResponse
      ) => {
        const item: ItemSummary = null;
        return new otherRecieptissuesActions.AdjustmentSearchSuccess(item);
      }
    }
  );
  @Effect() confirmAdjustmentItems$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS,
    {
      run: (action: otherRecieptissuesActions.ConfirmAdjustementItems) => {
        return this.otherReceiptService
          .confirmAdjustementItems(action.payload)
          .pipe(
            map(
              (confirmAdjustementItem: AdjustmentItem) =>
                new otherRecieptissuesActions.ConfirmAdjustementItemsSuccess(
                  confirmAdjustementItem
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ConfirmAdjustementItems,
        httpErrorResponse: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.ConfirmAdjustementItemsFailure(
          this.errorHandler(httpErrorResponse)
        );
      }
    }
  );
  @Effect() loadreceiptsADJList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadReceiptsADJList) => {
        return this.otherReceiptService
          .getReceiptsList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherReceiptsDataModel) =>
                new otherRecieptissuesActions.LoadReceiptsADJListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadReceiptsADJList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadReceiptsADJListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  //psv
  @Effect() psvSearch$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.PSV_SEARCH,
    {
      run: (action: otherRecieptissuesActions.PSVSearch, state) => {
        return this.itemDataService
          .getItemSummaryByCode(
            action.payload.variantCode,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (item: ItemSummary) =>
                new otherRecieptissuesActions.PSVSearchSuccess(item)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.PSVSearch,
        httpErrorResponse: HttpErrorResponse
      ) => {
        const item: ItemSummary = null;
        return new otherRecieptissuesActions.PSVSearchSuccess(item);
      }
    }
  );
  @Effect() confirmPSVItems$ = this.dataPersistence.pessimisticUpdate(
    OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS,
    {
      run: (action: otherRecieptissuesActions.ConfirmPSVItems) => {
        return this.otherReceiptService
          .confirmAdjustementItems(action.payload)
          .pipe(
            map(
              (confirmAdjustementItem: AdjustmentItem) =>
                new otherRecieptissuesActions.ConfirmPSVItemsSuccess(
                  confirmAdjustementItem
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ConfirmPSVItems,
        httpErrorResponse: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.ConfirmPSVItemsFailure(
          this.errorHandler(httpErrorResponse)
        );
      }
    }
  );
  @Effect() loadProductCategories$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: otherRecieptissuesActions.LoadProductCategories) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new otherRecieptissuesActions.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS,
    {
      run: (action: otherRecieptissuesActions.LoadProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new otherRecieptissuesActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // HISTORY
  @Effect()
  loadReceiptsHistory$: Observable<Action> = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY,
    {
      run: (action: otherRecieptissuesActions.LoadOtherReceiptsHistory) => {
        return this.otherReceiptService
          .getHistory(
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transactionType
          )
          .pipe(
            map(
              (history: OtherReceiptsDataModel) =>
                new otherRecieptissuesActions.LoadOtherReceiptsHistorySuccess(
                  history
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadOtherReceiptsHistory,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadOtherReceiptsHistorySuccess({
          receiptsData: [],
          totalElements: 0
        });
      }
    }
  );
  @Effect()
  loadSelectedHistory$: Observable<Action> = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY,
    {
      run: (action: otherRecieptissuesActions.LoadSelectedHistory) => {
        return this.otherReceiptService
          .getSelectedHistory(action.payload.id, action.payload.transactionType)
          .pipe(
            map(
              (data: OtherReceiptsModel) =>
                new otherRecieptissuesActions.LoadSelectedHistorySuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistory,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadHistoryItems$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItems,
        state
      ) => {
        return this.otherReceiptService
          .getHistoryItems(
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transactionType,
            state[OTHER_RECEIPT_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (data: { items: OtherReceiptItem[]; count: number }) =>
                new otherRecieptissuesActions.LoadSelectedHistoryItemsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryItemsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new otherRecieptissuesActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadItemsCount$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT,
    {
      run: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCount
      ) => {
        return this.otherReceiptService
          .getHistoryItemsTotalCount(
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transactionType
          )
          .pipe(
            map(
              (data: number) =>
                new otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCountSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCountSuccess(
          0
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: otherRecieptissuesActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new otherRecieptissuesActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          itemCode: action.payload?.itemCode,
          isHistoryItems: action.payload?.isHistoryItems,
          isPSVItems: action.payload?.isPSVItems,
          isAdjustmentItems: action.payload?.isAdjustmentItems,
          isVerifiedItems: action.payload?.isVerifiedItems
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    OtherReceiptsActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: otherRecieptissuesActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new otherRecieptissuesActions.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          itemCode: action.payload?.itemCode,
          isHistoryItems: action.payload?.isHistoryItems,
          isPSVItems: action.payload?.isPSVItems,
          isAdjustmentItems: action.payload?.isAdjustmentItems,
          isVerifiedItems: action.payload?.isVerifiedItems
        });
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
  constructor(
    private dataPersistence: DataPersistence<OtherReceiptState>,
    private loggerService: LoggerService,
    private otherReceiptService: OtherReceiptService,
    private inventoryValidationService: InventoryValidationService,
    private binDataService: BinDataService,
    private lovDataService: LovDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private itemDataService: ItemDataService,
    private commonService: CommonService
  ) {}
}
