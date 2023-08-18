import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  ProductCategoryDataService,
  BinDataService,
  ProductGroupDataService,
  LovDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CommonService,
  InventoryValidationService
} from '@poss-web/shared/common/data-access-common';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StockReceiveActionTypes } from './stock-receive.actions';
import * as StockReceiveActions from './stock-receive.actions';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import {
  StockReceiveStock,
  StockReceiveItem,
  CustomErrors,
  BinCode,
  Lov,
  ProductGroup,
  ProductCategory,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StockReceiveAPITypesEnum,
  StockReceiveTotalMeasuredWeight,
  ImageResponse
} from '@poss-web/shared/models';
import { StockReceiveService } from '../stock-receive.service';
import { stockReceiveFeatureKey } from './stock-receive.state';

/**
 * Stock Receive Effects
 */
@Injectable()
export class StockReceiveEffect {
  constructor(
    private stockReceiveService: StockReceiveService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private lovDataService: LovDataService,
    private binDataService: BinDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private inventoryValidationService: InventoryValidationService,
    private commonService: CommonService
  ) {}
  /**
   *  The effect which handles the loadPendingFactorySTN Action
   */
  @Effect() loadPendingFactorySTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN,
    {
      run: (action: StockReceiveActions.LoadPendingFactorySTN) => {
        return this.stockReceiveService
          .getStocks(
            StockReceiveAPITypesEnum.FAC_BTQ,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: StockReceiveStock[]) =>
                new StockReceiveActions.LoadPendingFactorySTNSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadPendingFactorySTN,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadPendingFactorySTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the loadPendingBoutiqueSTN Action
   */
  @Effect() loadPendingBoutiqueSTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN,
    {
      run: (action: StockReceiveActions.LoadPendingBoutiqueSTN) => {
        return this.stockReceiveService
          .getStocks(
            StockReceiveAPITypesEnum.BTQ_BTQ,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: StockReceiveStock[]) =>
                new StockReceiveActions.LoadPendingBoutiqueSTNSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadPendingBoutiqueSTN,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadPendingBoutiqueSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadPendingMerchandiseSTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN,
    {
      run: (action: StockReceiveActions.LoadPendingMerchandiseSTN) => {
        return this.stockReceiveService
          .getStocks(
            StockReceiveAPITypesEnum.MER_BTQ,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: StockReceiveStock[]) =>
                new StockReceiveActions.LoadPendingMerchandiseSTNSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadPendingMerchandiseSTN,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadPendingMerchandiseSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the loadPendingCFSInvoice Action
   */
  @Effect() loadPendingCFSInvoice$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE,
    {
      run: (action: StockReceiveActions.LoadPendingCFAInvoice) => {
        return this.stockReceiveService
          .getInvoices(
            StockReceiveAPITypesEnum.CFA_BTQ,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (invoices: StockReceiveStock[]) =>
                new StockReceiveActions.LoadPendingCFAInvoiceSuccess(invoices)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadPendingCFAInvoice,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadPendingCFAInvoiceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  searchPendingStocks Action
   */
  @Effect() searchPendingStocks$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.SEARCH_PENDING_STOCKS,
    {
      run: (action: StockReceiveActions.SearchPendingStocks) => {
        return this.stockReceiveService
          .searchStocks(action.payload.srcDocnumber, action.payload.type)
          .pipe(
            map(
              (searchresult: StockReceiveStock[]) =>
                new StockReceiveActions.SearchPendingStocksSuccess(searchresult)
            )
          );
      },

      onError: (
        action: StockReceiveActions.SearchPendingStocks,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.SearchPendingStocksSuccess([]);
      }

      // onError: (
      //   action: StockReceiveActions.SearchPendingStocks,
      //   error: HttpErrorResponse
      // ) => {
      //   return new StockReceiveActions.SearchPendingStocksFailure(
      //     this.errorHandler(error)
      //   );
      // }
    }
  );

  @Effect() fetchSTNFromOracle$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.FETCH_STN_FROM_ORACLE,
    {
      run: (action: StockReceiveActions.FetchSTNFromOracle) => {
        return this.stockReceiveService
          .fetchSTNFromOracle(action.payload.stn, action.payload.type)
          .pipe(
            map(
              (searchresult: StockReceiveStock[]) =>
                new StockReceiveActions.FetchSTNFromOracleSuccess(searchresult)
            )
          );
      },
      // TODO : change the action sent
      onError: (
        action: StockReceiveActions.FetchSTNFromOracle,
        error: HttpErrorResponse
      ) => {
        const errorData = this.errorHandler(error);
        if (
          errorData.code === ErrorEnums.ERR_INT_067 ||
          errorData.code === ErrorEnums.ERR_INT_069
        ) {
          return new StockReceiveActions.FetchSTNFromOracleSuccess([]);
        } else {
          return new StockReceiveActions.FetchSTNFromOracleFailure(errorData);
        }
      }
    }
  );

  @Effect() fetchInvoiceFromOracle$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE,
    {
      run: (action: StockReceiveActions.FetchInvoiceFromOracle) => {
        return this.stockReceiveService
          .fetchInvoiceFromOracle(action.payload.invoiceNo, action.payload.type)
          .pipe(
            map(
              (searchresult: StockReceiveStock[]) =>
                new StockReceiveActions.FetchInvoiceFromOracleSuccess(
                  searchresult
                )
            )
          );
      },
      // TODO : change the action sent
      onError: (
        action: StockReceiveActions.FetchInvoiceFromOracle,
        error: HttpErrorResponse
      ) => {
        const errorData = this.errorHandler(error);
        if (
          errorData.code === ErrorEnums.ERR_INT_068 ||
          errorData.code === ErrorEnums.ERR_INT_075 ||
          errorData.code === ErrorEnums.ERR_CORE_038
        ) {
          return new StockReceiveActions.FetchInvoiceFromOracleSuccess([]);
        } else {
          return new StockReceiveActions.FetchInvoiceFromOracleFailure(
            errorData
          );
        }
      }
    }
  );

  /**
   * The effect which handles the  searchPendingInvoices Action
   */
  @Effect() searchPendingInvoices$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.SEARCH_PENDING_INVOICES,
    {
      run: (action: StockReceiveActions.SearchPendingInvoices) => {
        return this.stockReceiveService
          .searchInovices(action.payload.srcDocnumber, action.payload.type)
          .pipe(
            map(
              (searchResult: StockReceiveStock[]) =>
                new StockReceiveActions.SearchPendingInvoicesSuccess(
                  searchResult
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.SearchPendingInvoices,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.SearchPendingInvoicesSuccess([]);
      }

      // onError: (
      //   action: StockReceiveActions.SearchPendingInvoices,
      //   error: HttpErrorResponse
      // ) => {
      //   return new StockReceiveActions.SearchPendingInvoicesFailure(
      //     this.errorHandler(error)
      //   );
      // }
    }
  );

  /**
   * The effect which handles the  loadSeletedStock Action
   */
  @Effect() loadSeletedStock$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_SELECTED_STOCK,
    {
      run: (action: StockReceiveActions.LoadSelectedStock) => {
        return this.stockReceiveService
          .getStock(
            action.payload.id,
            action.payload.type,
            action.payload.historyAPIType
          )
          .pipe(
            map(
              (stockTransferNote: StockReceiveStock) =>
                new StockReceiveActions.LoadSelectedStockSuccess(
                  stockTransferNote
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadSelectedStock,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadSelectedStockFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  loadSeletedSTN Action
   */
  @Effect() loadSeletedInvoice$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_SELECTED_INVOICE,
    {
      run: (action: StockReceiveActions.LoadSelectedInvoice) => {
        return this.stockReceiveService
          .getInvoice(
            action.payload.id,
            action.payload.type,
            action.payload.historyAPIType
          )
          .pipe(
            map(
              (invoice: StockReceiveStock) =>
                new StockReceiveActions.LoadSelectedInvoiceSuccess(invoice)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadSelectedInvoice,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadSelectedInvoiceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // For verify items

  @Effect()
  loadItemsTotalCount$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_ItEMS_COUNT,
    {
      run: (action: StockReceiveActions.LoadItemsTotalCount) => {
        return this.stockReceiveService
          .getItemsCount(
            action.payload.storeType,
            action.payload.type,
            action.payload.id
          )
          .pipe(
            map(
              (
                loadItemsTotalCountSuccessPayload: StockReceiveLoadItemsTotalCountSuccessResponse
              ) =>
                new StockReceiveActions.LoadItemsTotalCountSuccess(
                  loadItemsTotalCountSuccessPayload
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadItems$ = this.dataPersistence.fetch(StockReceiveActionTypes.LOAD_ITEMS, {
    run: (action: StockReceiveActions.LoadItems, state: any) => {
      return this.stockReceiveService
        .getItems(
          action.payload.storeType,
          action.payload.type,
          action.payload.status,
          action.payload.id,
          action.payload.itemCode,
          action.payload.lotNumber,
          action.payload.pageIndex,
          action.payload.pageSize,
          action.payload.sortBy,
          action.payload.sortOrder,
          action.payload.filter,
          state[stockReceiveFeatureKey].studdedProductGroups
        )
        .pipe(
          map(
            (data: { items: StockReceiveItem[]; count: number }) =>
              new StockReceiveActions.LoadItemsSuccess({
                ...data,
                status: action.payload.status
              })
          )
        );
    },
    onError: (
      action: StockReceiveActions.LoadItems,
      error: HttpErrorResponse
    ) => {
      return new StockReceiveActions.LoadItemsSuccess({
        items: [],
        count: 0,
        status: action.payload.status
      });
    }

    // onError: (
    //   action: StockReceiveActions.LoadItems,
    //   error: HttpErrorResponse
    // ) => {
    //   return new StockReceiveActions.LoadItemsFailure(this.errorHandler(error));
    // }
  });

  @Effect()
  loadHistoryItems$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS,
    {
      run: (
        action: StockReceiveActions.LoadStockReceiveHistoryItems,
        state: any
      ) => {
        return this.stockReceiveService
          .getHistoryItems(
            action.payload.StockReceiveHistoryItem,
            action.payload.id,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.isL1L2Store,
            action.payload.isL3Store,
            action.payload.sort,
            action.payload.historyAPIType,
            state[stockReceiveFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: { items: StockReceiveItem[]; count: number }) =>
                new StockReceiveActions.LoadStockReceiveHistoryItemsSuccess({
                  ...data
                })
            )
          );
      },
      onError: (
        action: StockReceiveActions.LoadStockReceiveHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadStockReceiveHistoryItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBins$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_BIN_CODES,
    {
      run: (action: StockReceiveActions.LoadBinCodes) => {
        return this.binDataService
          .getBinDetails(action.payload, false)
          .pipe(
            map(
              (bincodes: BinCode[]) =>
                new StockReceiveActions.LoadBinCodesSuccess(bincodes)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadBinCodes,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadBinCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRemarks$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_REMARKS,
    {
      run: () => {
        return this.lovDataService
          .getInventoryLovs('DEFECTTYPE')
          .pipe(
            map(
              (remarks: Lov[]) =>
                new StockReceiveActions.LoadRemarksSuccess(remarks)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadRemarks,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadRemarksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  verifyItem$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.VERIFY_ITEM,
    {
      run: (action: StockReceiveActions.VerifyItem, state: any) => {
        return this.stockReceiveService
          .verifyItem(
            action.payload.storeType,
            action.payload.type,
            action.payload.id,
            action.payload.itemId,
            action.payload.newUpdate,
            state[stockReceiveFeatureKey].studdedProductGroups
          )
          .pipe(
            mergeMap((item: StockReceiveItem) => [
              new StockReceiveActions.VerifyItemSuccess(item),
              new StockReceiveActions.GetTotalMeasuredWeight({
                id: action.payload.id,
                storeType: action.payload.storeType,
                type: action.payload.type
              }),
              action.payload.loadItemsPayload.isSearchReset
                ? new StockReceiveActions.ResetSearch(
                    action.payload.loadItemsPayload.isSearchReset
                  )
                : new StockReceiveActions.LoadItems(
                    action.payload.loadItemsPayload
                  ),

              new StockReceiveActions.LoadItemsTotalCount(
                action.payload.loadTemsCountPayload
              )
            ])
          );
      },

      onError: (
        action: StockReceiveActions.VerifyItem,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.VerifyItemFailure({
          itemId: action.payload.itemId,
          actualDetails: action.payload.actualDetails,
          error: this.errorHandler(error)
        });
      }
    }
  );

  @Effect()
  updateItem$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.UPADTE_ITEM,
    {
      run: (action: StockReceiveActions.UpdateItem, state: any) => {
        return this.stockReceiveService
          .verifyItem(
            action.payload.storeType,
            action.payload.type,
            action.payload.id,
            action.payload.itemId,
            action.payload.newUpdate,
            state[stockReceiveFeatureKey].studdedProductGroups
          )
          .pipe(
            mergeMap((item: StockReceiveItem) => [
              new StockReceiveActions.UpdateItemSuccess(item),
              new StockReceiveActions.GetTotalMeasuredWeight({
                id: action.payload.id,
                storeType: action.payload.storeType,
                type: action.payload.type
              })
            ])
          );
      },

      onError: (
        action: StockReceiveActions.UpdateItem,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.UpdateItemFailure({
          itemId: action.payload.itemId,
          actualDetails: action.payload.actualDetails,
          error: this.errorHandler(error)
        });
      }
    }
  );

  @Effect()
  getTotalMeasuredWeight$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT,
    {
      run: (action: StockReceiveActions.GetTotalMeasuredWeight, state: any) => {
        return this.stockReceiveService
          .getTotalReceivedWeight(
            action.payload.storeType,
            action.payload.type,
            action.payload.id
          )
          .pipe(
            map(
              (weight: StockReceiveTotalMeasuredWeight) =>
                new StockReceiveActions.GetTotalMeasuredWeightSuccess(weight)
            )
          );
      },

      onError: (
        action: StockReceiveActions.GetTotalMeasuredWeight,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.GetTotalMeasuredWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  validateItem$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.VALIDATE_ITEM,
    {
      run: (action: StockReceiveActions.ValidateItem) => {
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
              () =>
                new StockReceiveActions.ValidateItemSuccess({
                  itemId: action.payload.itemId,
                  isSuccess: true
                })
            )
          );
      },

      onError: (
        action: StockReceiveActions.ValidateItem,
        error: HttpErrorResponse
      ) => {
        const err = CustomErrorAdaptor.fromJson(error);
        if (err.code === ErrorEnums.ERR_INV_028) {
          return new StockReceiveActions.ValidateItemSuccess({
            itemId: action.payload.itemId,
            isSuccess: false
          });
        } else {
          return new StockReceiveActions.ValidateItemFailure({
            itemId: action.payload.itemId,
            error: this.errorHandler(error)
          });
        }
      }
    }
  );

  @Effect()
  verifyAllItems$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.VERIFY_ALL_ITEMS,
    {
      run: (action: StockReceiveActions.VerifyAllItems) => {
        return this.stockReceiveService
          .updateAllItems(
            action.payload.storeType,
            action.payload.type,
            action.payload.id,
            action.payload.data
          )
          .pipe(
            mergeMap((isSuccess: boolean) => [
              new StockReceiveActions.VerifyAllItemsSuccess(isSuccess),
              new StockReceiveActions.GetTotalMeasuredWeight({
                id: action.payload.id,
                storeType: action.payload.storeType,
                type: action.payload.type
              })
            ])
            // map(
            //   (isSuccess: boolean) =>
            //     new StockReceiveActions.VerifyAllItemsSuccess(isSuccess)
            // )
          );
      },

      onError: (
        action: StockReceiveActions.VerifyAllItems,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.VerifyAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  assignBinToAllItems$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS,
    {
      run: (action: StockReceiveActions.AssignBinToAllItems) => {
        return this.stockReceiveService
          .updateAllItems(
            action.payload.storeType,
            action.payload.type,
            action.payload.id,
            action.payload.data
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new StockReceiveActions.AssignBinToAllItemsSuccess(isSuccess)
            )
          );
      },

      onError: (
        action: StockReceiveActions.AssignBinToAllItems,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.AssignBinToAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmStock$ = this.dataPersistence.pessimisticUpdate(
    StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE,
    {
      run: (action: StockReceiveActions.ConfirmStockReceive) => {
        return this.stockReceiveService
          .confirmStn(
            action.payload.storeType,
            action.payload.type,
            action.payload.id,
            action.payload.confirmReceive
          )
          .pipe(
            map(
              (confirmedStock: any) =>
                new StockReceiveActions.ConfirmStockReceiveSuccess(
                  confirmedStock
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.ConfirmStockReceive,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.ConfirmStockReceiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new StockReceiveActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new StockReceiveActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategories$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: () => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new StockReceiveActions.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  //history
  @Effect() loadStockReceiveHistory$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY,
    {
      run: (action: StockReceiveActions.LoadStockReceiveHistory) => {
        return this.stockReceiveService
          .getStockReceiveHistory(
            action.payload.data,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.transferType,
            ['lastModifiedDate,DESC']
          )
          .pipe(
            map(
              (data: { stocks: StockReceiveStock[]; count: number }) =>
                new StockReceiveActions.LoadStockReceiveHistorySuccess(data)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadStockReceiveHistory,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadStockReceiveHistorySuccess({
          stocks: [],
          count: 0
        });
      }
    }
  );
  @Effect() loadStockReceiveInvoiceHistory$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY,
    {
      run: (action: StockReceiveActions.LoadStockReceiveInvoiceHistory) => {
        return this.stockReceiveService
          .getStockReceiveInvoiceHistory(
            action.payload.data,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.transferType,
            ['lastModifiedDate,DESC']
          )
          .pipe(
            map(
              (data: { stocks: StockReceiveStock[]; count: number }) =>
                new StockReceiveActions.LoadStockReceiveInvoiceHistorySuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadStockReceiveInvoiceHistory,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadStockReceiveInvoiceHistorySuccess({
          stocks: [],
          count: 0
        });
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: StockReceiveActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new StockReceiveActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    StockReceiveActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: StockReceiveActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new StockReceiveActions.LoadImageUrlSuccess(loadImageResponse)
            )
          );
      },

      onError: (
        action: StockReceiveActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new StockReceiveActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl
        });
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
