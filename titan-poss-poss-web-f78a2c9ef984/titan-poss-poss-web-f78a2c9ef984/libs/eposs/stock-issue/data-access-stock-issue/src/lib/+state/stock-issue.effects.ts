import { Injectable } from '@angular/core';

import {
  CustomErrors,
  StoreUser,
  LoadIssueSTNCountsPayload,
  ProductGroup,
  ProductCategory,
  RequestList,
  MeasuredWeightAndValuePayload,
  StockRequestNote,
  IssueInventoryItem,
  LoadIssueItemsTotalCountSuccessPayload,
  ImageResponse,
  RegenerateFileResponse
} from '@poss-web/shared/models';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as StockIssueActions from './stock-issue.actions';
import { StockIssueActionTypes } from './stock-issue.actions';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { map } from 'rxjs/operators';
import { StockIssueService } from '../stock-issue.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CourierDataService,
  StoreUserDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CommonService,
  InventoryValidationService
} from '@poss-web/shared/common/data-access-common';
import { stockIssueFeatureKey } from './stock-issue.reducer';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class StockIssueEffect {
  constructor(
    private stockIssueService: StockIssueService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private courierService: CourierDataService,
    private storeUserDataService: StoreUserDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private productGroupDataService: ProductGroupDataService,
    private inventoryValidationService: InventoryValidationService,
    private commonService: CommonService
  ) {}

  @Effect()
  loadPendingIssueToFactorySTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN,
    {
      run: (action: StockIssueActions.LoadFactoryIssuePendingSTN) => {
        return this.stockIssueService
          .getIssues(
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (requestStockTransferNotes: {
                response: StockRequestNote[];
                count: number;
              }) =>
                new StockIssueActions.LoadFactoryIssuePendingSTNSuccess(
                  requestStockTransferNotes
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadFactoryIssuePendingSTN,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadFactoryIssuePendingSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPendingIssueToBoutiqueSTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN,
    {
      run: (action: StockIssueActions.LoadBoutiqueIssuePendingSTN) => {
        return this.stockIssueService
          .getIssues(
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (requestStockTransferNotes: {
                response: StockRequestNote[];
                count: number;
              }) =>
                new StockIssueActions.LoadBoutiqueIssuePendingSTNSuccess(
                  requestStockTransferNotes
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadBoutiqueIssuePendingSTN,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadBoutiqueIssuePendingSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPendingIssueToMerchantSTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN,
    {
      run: (action: StockIssueActions.LoadMerchantIssuePendingSTN) => {
        return this.stockIssueService
          .getIssues(
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (requestStockTransferNotes: {
                response: StockRequestNote[];
                count: number;
              }) =>
                new StockIssueActions.LoadMerchantIssuePendingSTNSuccess(
                  requestStockTransferNotes
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadMerchantIssuePendingSTN,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadMerchantIssuePendingSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPendingIssues$ = this.dataPersistence.fetch(
    StockIssueActionTypes.SEARCH_PENDING_ISSUES,
    {
      run: (action: StockIssueActions.SearchPendingIssues) => {
        return this.stockIssueService
          .searchIssues(action.payload.reqDocNo, action.payload.requestType)
          .pipe(
            map(
              (searchResult: StockRequestNote[]) =>
                new StockIssueActions.SearchPendingIssuesSuccess(searchResult)
            )
          );
      },
      // onError: (
      //   action: StockIssueActions.SearchPendingIssues,
      //   error: HttpErrorResponse
      // ) => {
      //   return new StockIssueActions.SeachPendingIssuesFailure(
      //     this.errorHandler(error)
      //   );
      // }
      onError: (
        action: StockIssueActions.SearchPendingIssues,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.SearchPendingIssuesSuccess([]);
      }
    }
  );

  @Effect()
  loadSelectedIssue$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_SELECTED_ISSUE,
    {
      run: (action: StockIssueActions.LoadSelectedIssue) => {
        return this.stockIssueService
          .getIssue(action.payload.id, action.payload.requestType)
          .pipe(
            map(
              (requestStockTransferNoteData: StockRequestNote) =>
                new StockIssueActions.LoadSelectedIssueSuccess(
                  requestStockTransferNoteData
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadSelectedIssue,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadSelectedIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadItems$ = this.dataPersistence.fetch(StockIssueActionTypes.LOAD_ITEMS, {
    run: (action: StockIssueActions.LoadItems, state) => {
      return this.stockIssueService
        .getItems(
          action.payload.id,
          action.payload.itemCode,
          action.payload.lotNumber,
          action.payload.requestType,
          action.payload.storeType,
          action.payload.status,
          action.payload.pageIndex,
          action.payload.pageSize,
          state[stockIssueFeatureKey].studdedProductGroups,
          action.payload.sort,
          action.payload.filter
        )
        .pipe(
          map(
            (data: { items: IssueInventoryItem[]; count: number }) =>
              new StockIssueActions.LoadItemsSuccess({ ...data })
          )
        );
    },
    onError: (
      action: StockIssueActions.LoadItems,
      error: HttpErrorResponse
    ) => {
      return new StockIssueActions.LoadItemsSuccess({ items: [], count: 0 });
    }
  });

  @Effect()
  LoadIssueItemsTotalCount$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT,
    {
      run: (action: StockIssueActions.LoadIssueItemsTotalCount) => {
        return this.stockIssueService
          .getIssueItemsCount(
            action.payload.storeType,
            action.payload.id,
            action.payload.requestType
          )
          .pipe(
            map(
              (
                loadItemsTotalCountSuccessPayload: LoadIssueItemsTotalCountSuccessPayload
              ) =>
                new StockIssueActions.LoadIssueItemsTotalCountSuccess(
                  loadItemsTotalCountSuccessPayload
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadIssueItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadIssueItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmIssue$ = this.dataPersistence.pessimisticUpdate(
    StockIssueActionTypes.CONFIRM_ISSUE,
    {
      run: (action: StockIssueActions.ConfirmIssue) => {
        return this.stockIssueService
          .confirmIssue(
            action.payload.id,
            action.payload.data,
            action.payload.requestType
          )
          .pipe(
            map(
              (issueConfirmResponse: StockRequestNote) =>
                new StockIssueActions.ConfirmIssueSuccess(issueConfirmResponse)
            )
          );
      },
      onError: (
        action: StockIssueActions.ConfirmIssue,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.ConfirmIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  validateItem$ = this.dataPersistence.fetch(
    StockIssueActionTypes.VALIDATE_ITEM,
    {
      run: (action: StockIssueActions.ValidateItem) => {
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
                new StockIssueActions.ValidateItemSuccess({
                  itemId: action.payload.itemId,
                  isSuccess: true
                })
            )
          );
      },

      onError: (
        action: StockIssueActions.ValidateItem,
        error: HttpErrorResponse
      ) => {
        const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
        if (customError.code === ErrorEnums.ERR_INV_028) {
          return new StockIssueActions.ValidateItemSuccess({
            itemId: action.payload.itemId,
            isSuccess: false
          });
        } else {
          return new StockIssueActions.ValidateItemFailure({
            itemId: action.payload.itemId,
            // isSuccess: false,
            error: this.errorHandler(error)
          });
        }
      }
    }
  );

  @Effect()
  updateItem$ = this.dataPersistence.pessimisticUpdate(
    StockIssueActionTypes.UPDATE_ITEM,
    {
      run: (action: StockIssueActions.UpdateItem, state) => {
        return this.stockIssueService
          .updateItem(
            action.payload.requestType,
            action.payload.storeType,
            action.payload.id,
            action.payload.itemId,
            action.payload.newUpdate,
            state[stockIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (item: IssueInventoryItem) =>
                new StockIssueActions.UpdateItemSuccess(item)
            )
          );
      },
      onError: (
        action: StockIssueActions.UpdateItem,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.UpdateItemFailure({
          itemId: action.payload.itemId,
          actualDetails: action.payload.actualDetails,
          error: this.errorHandler(error)
        });
      }
    }
  );
  @Effect()
  updateAllItem$ = this.dataPersistence.pessimisticUpdate(
    StockIssueActionTypes.UPDATE_ALL_ITEM,
    {
      run: (action: StockIssueActions.UpdateAllItems) => {
        return this.stockIssueService
          .updateAllItem(
            action.payload.requestType,
            action.payload.storeType,
            action.payload.id,
            action.payload.itemId,
            action.payload.status
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new StockIssueActions.UpdateAllItemsSuccess(isSuccess)
            )
          );
      },
      onError: (
        action: StockIssueActions.UpdateAllItems,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.UpdateAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // REQUEST COUNT
  @Effect()
  LoadIssueStockTransferNoteCount$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_ISSUES_COUNT,
    {
      run: (action: StockIssueActions.LoadIssueSTNCount) => {
        return this.stockIssueService
          .getCount()
          .pipe(
            map(
              (data: LoadIssueSTNCountsPayload) =>
                new StockIssueActions.LoadIssueSTNCountSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadIssueSTNCount,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadIssueSTNCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  LoadCourierDetails$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_COURIER_DETAILS,
    {
      run: (action: StockIssueActions.LoadCourierDetails) => {
        return this.courierService // .getCouriers(null, null, true, action.payload, false, null)
          .getCouriersSummary(0, 9999, true, null)
          .pipe(
            map((data: any) => {
              const courierNames: string[] = [];
              for (const courier of data) {
                courierNames.push(courier.courierName);
              }
              return new StockIssueActions.LoadCourierDetailsSuccess(
                courierNames
              );
            })
          );
      },
      onError: (
        action: StockIssueActions.LoadCourierDetails,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCourierDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadEmployeeCodes$: Observable<Action> = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_EMPLOYEE_CODES,
    {
      run: (action: StockIssueActions.LoadEmployeeCodes) => {
        return this.storeUserDataService.getStoreUsers().pipe(
          map((data: StoreUser[]) => {
            const employeeCodes: string[] = [];
            for (const employee of data) {
              employeeCodes.push(employee.employeeCode);
            }
            return new StockIssueActions.LoadEmployeeCodesSuccess(
              employeeCodes
            );
          })
        );
      },
      onError: (
        action: StockIssueActions.LoadEmployeeCodes,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadEmployeeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEmployeeDetails$: Observable<Action> = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS,
    {
      run: (action: StockIssueActions.LoadEmployeeDetails) => {
        return (
          this.storeUserDataService
            // .getStoreUserDetails(action.payload)
            .getStoreUsers(null, null, action.payload)

            .pipe(
              map((data: StoreUser[]) => {
                return new StockIssueActions.LoadEmployeeDetailsSuccess(data);
              })
            )
        );
      },
      onError: (
        action: StockIssueActions.LoadEmployeeDetails,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadEmployeeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategories$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: StockIssueActions.LoadProductCategories) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new StockIssueActions.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: StockIssueActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PROUDCT_GROUPS,
    {
      run: (action: StockIssueActions.LoadProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new StockIssueActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: StockIssueActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new StockIssueActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: StockIssueActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() updateItemListStatus$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS,
    {
      run: (action: StockIssueActions.UpdateItemListStatus) => {
        return this.stockIssueService
          .updateItemListStatus(
            action.payload.type,
            action.payload.id,
            action.payload.itemIds,
            action.payload.requestGroup,
            action.payload.remarks
          )
          .pipe(
            map(
              (data: RequestList) =>
                new StockIssueActions.UpdateItemListStatusSuccess(data)
            )
          );
      },

      onError: (
        action: StockIssueActions.UpdateItemListStatus,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.UpdateItemListStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMeasuredWeightAndValue$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE,
    {
      run: (action: StockIssueActions.LoadTotalMeasuredWeightAndValue) => {
        return this.stockIssueService
          .getWeightAndValue(action.payload.id, action.payload.requestType)
          .pipe(
            map(
              (data: MeasuredWeightAndValuePayload) =>
                new StockIssueActions.LoadTotalMeasuredWeightAndValueSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadTotalMeasuredWeightAndValue,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadTotalMeasuredWeightAndValueFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadIssueHistory$: Observable<Action> = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_ISSUE_HISTORY,
    {
      run: (action: StockIssueActions.LoadIssueHistory) => {
        return this.stockIssueService
          .getHistory(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sort,
            action.payload.payload,
            action.payload.transferType,
            action.payload.isLegacy
          )
          .pipe(
            map(
              (data: { response: StockRequestNote[]; count: number }) =>
                new StockIssueActions.LoadIssueHistorySuccess({ ...data })
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadIssueHistory,

        error: HttpErrorResponse
      ) => {
        // return new StockIssueActions.LoadIssueHistoryFailure(
        //   this.errorHandler(error)
        // );
        return new StockIssueActions.LoadIssueHistorySuccess({
          response: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadSelectedHistory$: Observable<Action> = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_SELECTED_HISTORY,
    {
      run: (action: StockIssueActions.LoadSelectedHistory) => {
        return this.stockIssueService
          .getSelectedHistory(
            action.payload.actionType,
            action.payload.id,
            action.payload.type,
            action.payload.isL1L2Store,
            action.payload.isL3Store
          )
          .pipe(
            map(
              (selectedHistory: StockRequestNote) =>
                new StockIssueActions.LoadSelectedHistorySuccess(
                  selectedHistory
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadSelectedHistory,
        error: HttpErrorResponse
      ) => {
        // return new StockIssueActions.LoadSelectedHistoryFailure(
        //   this.errorHandler(error)
        // );
        return new StockIssueActions.ResetLoadedHistory();
      }
    }
  );
  @Effect()
  loadHistoryItems$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS,
    {
      run: (action: StockIssueActions.LoadHistoryItems, state) => {
        return this.stockIssueService
          .getHistoryItems(
            action.payload.actionType,
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transferType,
            action.payload.isL1L2Store,
            action.payload.isL3Store,
            state[stockIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: { items: IssueInventoryItem[]; count: number }) =>
                new StockIssueActions.LoadHistoryItemsSuccess({ ...data })
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadHistoryItems,
        error: HttpErrorResponse
      ) => {
        // return new StockIssueActions.LoadHistoryItemsFailure(
        //   this.errorHandler(error)
        // );
        return new StockIssueActions.LoadHistoryItemsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadHistoryItemsCount$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT,
    {
      run: (action: StockIssueActions.LoadHistoryItemsTotalCount) => {
        return this.stockIssueService
          .getHistoryItemsCount(
            action.payload.actionType,
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transferType,
            action.payload.isL1L2Store,
            action.payload.isL3Store
          )
          .pipe(
            map(
              (data: number) =>
                new StockIssueActions.LoadHistoryItemsTotalCountSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadHistoryItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadHistoryItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // cancel STN

  @Effect()
  loadPendingIssueToBoutiqueCancelSTN$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN,
    {
      run: (action: StockIssueActions.LoadCancelIssuePendingSTN) => {
        return this.stockIssueService
          .getIssuesCancelSTN(
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.srcDocNo
          )
          .pipe(
            map(
              (requestStockTransferNotes: {
                response: StockRequestNote[];
                count: number;
              }) =>
                new StockIssueActions.LoadCancelIssuePendingSTNSuccess(
                  requestStockTransferNotes
                )
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadCancelIssuePendingSTN,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCancelIssuePendingSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  LoadCancelIssueStockTransferNoteCount$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT,
    {
      run: (action: StockIssueActions.LoadCancelIssueCount) => {
        return this.stockIssueService
          .getCancelSTNCount(action.payload.transferType)
          .pipe(
            map(
              (data: number) =>
                new StockIssueActions.LoadCancelIssueCountSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadCancelIssueCount,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCancelIssueCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCancelIssueDetails$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS,
    {
      run: (action: StockIssueActions.LoadCancelIssueDetails) => {
        return this.stockIssueService
          .getCancelIssueSTNDetails(
            action.payload.transferType,
            action.payload.id
          )
          .pipe(
            map(
              (data: StockRequestNote) =>
                new StockIssueActions.LoadCancelIssueDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadCancelIssueDetails,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCancelIssueDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCancelIssueItems$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS,
    {
      run: (action: StockIssueActions.LoadCancelIssueItems, state) => {
        return this.stockIssueService
          .getCancelIssueItems(
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.transferType,
            action.payload.binCodes,
            action.payload.binGroupCode,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.productCategories,
            action.payload.productGroups,
            state[stockIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: { items: IssueInventoryItem[]; count: number }) =>
                new StockIssueActions.LoadCancelIssueItemsSuccess({ ...data })
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadCancelIssueItems,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCancelIssueItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCancelIssueItemsCount$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT,
    {
      run: (action: StockIssueActions.LoadCancelIssueItemsCount, state) => {
        return this.stockIssueService
          .getCancelIssueItemsCount(
            action.payload.transferType,
            action.payload.id
          )
          .pipe(
            map(
              (data: number) =>
                new StockIssueActions.LoadCancelIssueItemsCountSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.LoadCancelIssueItemsCount,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadCancelIssueItemsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  cancelIssueSTN$ = this.dataPersistence.fetch(
    StockIssueActionTypes.CANCEL_ISSUE_STN,
    {
      run: (action: StockIssueActions.CancelIssueSTN) => {
        return this.stockIssueService
          .getCancelIssueSTNRes(
            action.payload.transferType,
            action.payload.id,
            action.payload.payload
          )
          .pipe(
            map(
              (data: StockRequestNote) =>
                new StockIssueActions.CancelIssueSTNSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.CancelIssueSTN,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.CancelIssueSTNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  RegenerateFile$ = this.dataPersistence.fetch(
    StockIssueActionTypes.REGENERATE_FILE,
    {
      run: (action: StockIssueActions.RegenerateFile) => {
        return this.stockIssueService
          .regenerateFile(
            action.payload.invoiceType,
            action.payload.id,
            action.payload.payload
          )
          .pipe(
            map(
              (data: RegenerateFileResponse) =>
                new StockIssueActions.RegenerateFileSuccess(data)
            )
          );
      },
      onError: (
        action: StockIssueActions.RegenerateFile,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.RegenerateFileFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: StockIssueActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new StockIssueActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: StockIssueActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isCancelItems: action.payload?.isCancelItems,
          isHistoryItems: action.payload?.isHistoryItems
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    StockIssueActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: StockIssueActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new StockIssueActions.LoadImageUrlSuccess(loadImageResponse)
            )
          );
      },

      onError: (
        action: StockIssueActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new StockIssueActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isCancelItems: action.payload?.isCancelItems,
          isHistoryItems: action.payload?.isHistoryItems
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
