import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  SearchItemPayloadSuccess,
  LoadItemsSuccessPayload,
  StockReturnItem,
  LocationSummary,
  ProductCategory,
  ProductGroup,
  Courier,
  StoreUserDetails,
  StoreUser,
  StockIssueInvoiceHistorySuccess,
  ImageResponse,


} from '@poss-web/shared/models';
import { StockReturnActionTypes } from './stock-return.actions';
import * as RetrunInvoiceCfaAction from './stock-return.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CommonService, InventoryValidationService } from '@poss-web/shared/common/data-access-common';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StockReturnService } from '../stock-return.service';
import {
  LocationDataService,
  CourierDataService,
  ProductGroupDataService,
  ProductCategoryDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import { STOCK_RETURN_FEATURE_KEY } from './stock-return.reducers';
import { StockReturnState } from './stock-return.state';

@Injectable()
export class StockReturnEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public stockReturnService: StockReturnService,
    public loggerService: LoggerService,
    private locationDataService: LocationDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private courierDataService: CourierDataService,
    private storeUserDataService: StoreUserDataService,
    private commonService: CommonService
  ) {}

  /**
   * The effect which handles the  createRequestTocfa Action
   */
  @Effect()
  createRequestTocfa$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.CREATE_REQUEST_TO_CFA,
    {
      run: (action: RetrunInvoiceCfaAction.CreateRequestToCfa) => {
        return this.stockReturnService
          .createReturnRequestToCfa()
          .pipe(
            map(
              (invoicenumber: number) =>
                new RetrunInvoiceCfaAction.CreateRequestToCfaSuccess(
                  invoicenumber
                )
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.CreateRequestToCfa,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.CreateRequestToCfaFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  confirmIssue Action
   */

  @Effect() confirmIssue$: Observable<
    Action
  > = this.dataPersistence.pessimisticUpdate(
    StockReturnActionTypes.CONFIRM_ISSUE,
    {
      run: (action: RetrunInvoiceCfaAction.ConfirmIssue) => {
        return this.stockReturnService
          .confirmIssueCfa(action.payload.id, action.payload.confirmIssue)
          .pipe(
            map(
              (invoicenumber: number) =>
                new RetrunInvoiceCfaAction.ConfirmIssueSuccess(invoicenumber)
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.ConfirmIssue,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.ConfirmIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  searchItem Action
   */
  @Effect() searchItem$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.SEARCH_ITEM,
    {
      run: (action: RetrunInvoiceCfaAction.SearchItem, state) => {
        return this.stockReturnService
          .searchItem(
            action.payload.id,
            action.payload.variantCode,
            action.payload.lotNumber,
            state[STOCK_RETURN_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (searchItemPayloadSuccess: SearchItemPayloadSuccess) =>
                new RetrunInvoiceCfaAction.SearchItemSuccess({
                  items: searchItemPayloadSuccess.items,
                  count: searchItemPayloadSuccess.count
                })
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.SearchItem,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.SearchItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  CreateIssueItems Action
   */
  @Effect() CreateIssueItems$: Observable<
    Action
  > = this.dataPersistence.pessimisticUpdate(
    StockReturnActionTypes.CREATE_ISSUE_ITEMS,
    {
      run: (action: RetrunInvoiceCfaAction.CreateIssueItems) => {
        return this.stockReturnService
          .createIssueItems(action.payload.id, action.payload.invoiceItems,action.payload.stockItems)
          .pipe(
            map(() => new RetrunInvoiceCfaAction.CreateIssueItemsSuccess())
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.CreateIssueItems,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.CreateIssueItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /**
   * The effect which handles the  loadCFALocationCode Action
   */

  @Effect()
  loadCfaAddress$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_CFA_LOCATION_CODE,
    {
      run: (action: RetrunInvoiceCfaAction.LoadCFALocationCode) => {
        return this.locationDataService
          .getLocationSummary()
          .pipe(
            map(
              (data: LocationSummary) =>
                new RetrunInvoiceCfaAction.LoadCFALocationCodeSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadCFALocationCode,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadCFALocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadItems$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_ITEMS,
    {
      run: (action: RetrunInvoiceCfaAction.LoadItems, state) => {
        return this.stockReturnService
          .getItemsCFA(
            action.payload,
            state[STOCK_RETURN_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemSuccessPayload: LoadItemsSuccessPayload) =>
                new RetrunInvoiceCfaAction.LoadItemSuccess(
                  loadItemSuccessPayload
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadItems,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() removeMultipleItems$: Observable<
    Action
  > = this.dataPersistence.pessimisticUpdate(
    StockReturnActionTypes.REMOVE_SELECTED_ITEMS,
    {
      run: (action: RetrunInvoiceCfaAction.RemoveSelectedItems) => {
        return this.stockReturnService
          .removeSelectedItems(action.payload.requestId, action.payload.itemIds)
          .pipe(
            map(() => new RetrunInvoiceCfaAction.RemoveSelectedItemsSuccess())
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.RemoveSelectedItems,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.RemoveSelectedItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() selectedProductsSearch$: Observable<
    Action
  > = this.dataPersistence.pessimisticUpdate(
    StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH,
    {
      run: (action: RetrunInvoiceCfaAction.SelectedProductsSearch, state) => {
        return this.stockReturnService
          .getItemsCFA(
            action.payload,
            state[STOCK_RETURN_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemSuccessPayload: LoadItemsSuccessPayload) =>
                new RetrunInvoiceCfaAction.SelectedProdutsSearchSuccess(
                  loadItemSuccessPayload
                )
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.SelectedProductsSearch,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.SelectedProductsSearchFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCourierDetails$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_COURIER_DETAILS,
    {
      run: (action: RetrunInvoiceCfaAction.LoadCourierDetails) => {
        return (
          this.courierDataService
            // .getCouriers(null, null, true, action.payload, true)
            .getCouriersSummary(0, 9999, true, null)
            .pipe(
              map((data: Courier[]) => {
                const courierNames: string[] = [];
                for (const courier of data) {
                  courierNames.push(courier.courierName);
                }
                return new RetrunInvoiceCfaAction.LoadCourierDetailsSuccess(
                  courierNames
                );
              })
            )
        );
      },
      onError: (
        action: RetrunInvoiceCfaAction.LoadCourierDetails,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadCourierDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadHeaderLevelDetails$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS,
    {
      run: (action: RetrunInvoiceCfaAction.LoadHeaderLevelDetails) => {
        return this.stockReturnService
          .loadHeaderLevelDetails(action.payload)
          .pipe(
            map(
              (item: StockReturnItem) =>
                new RetrunInvoiceCfaAction.LoadHeaderLevelDetailsSuccess(item)
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.LoadHeaderLevelDetails,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadHeaderLevelDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadProductCategories$: Observable<
    Action
  > = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: RetrunInvoiceCfaAction.LoadProductCategories) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new RetrunInvoiceCfaAction.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_PROUDCT_GROUPS,
    {
      run: (action: RetrunInvoiceCfaAction.LoadProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new RetrunInvoiceCfaAction.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadEmployeeDetails$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS,
    {
      run: (action: RetrunInvoiceCfaAction.LoadEmployeeDetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, action.payload)
          .pipe(
            map((data: StoreUserDetails[]) => {
              return new RetrunInvoiceCfaAction.LoadEmployeeDetailsSuccess(
                data
              );
            })
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.LoadEmployeeDetails,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadEmployeeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadEmployeeCodes$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_EMPLOYEE_CODES,
    {
      run: (action: RetrunInvoiceCfaAction.LoadEmployeeCodes) => {
        return this.storeUserDataService.getStoreUsers().pipe(
          map((data: StoreUser[]) => {
            const employeeCodes: string[] = [];
            for (const employee of data) {
              employeeCodes.push(employee.employeeCode);
            }
            return new RetrunInvoiceCfaAction.LoadEmployeeCodesSuccess(
              employeeCodes
            );
          })
        );
      },
      onError: (
        action: RetrunInvoiceCfaAction.LoadEmployeeCodes,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadEmployeeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadInvoiceHistory$: Observable<Action> = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY,
    {
      run: (action: RetrunInvoiceCfaAction.LoadIssueInvoiceHistory) => {
        return this.stockReturnService
          .getInvoiceHistory(
            action.payload.loadStockIssueInvoiceHistory,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.invoiceType
          )
          .pipe(
            map(
              (invoiceHistory: StockIssueInvoiceHistorySuccess) =>
                new RetrunInvoiceCfaAction.LoadIssueInvoiceHistorySucceess(
                  invoiceHistory
                )
            )
          );
      },
      onError: (
        action: RetrunInvoiceCfaAction.LoadIssueInvoiceHistory,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadIssueInvoiceHistorySucceess({
          requestInvoice: [],
          totalElements: 0
        });
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new RetrunInvoiceCfaAction.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadStuddedProductGroupsFailure(
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



  @Effect() loadItemsCfa$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_ITEMS_CFA,
    {
      run: (action: RetrunInvoiceCfaAction.LoadItemsCfa, state:StockReturnState) => {
        return this.stockReturnService
          .loadStockIssueItems(
            action.payload.id,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.status,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sortBy,
            action.payload.filter,
            state[STOCK_RETURN_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemSuccessPayload: LoadItemsSuccessPayload) =>
                new RetrunInvoiceCfaAction.LoadItemsSuccessCfa(
                  loadItemSuccessPayload
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadItemsCfa,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadItemsFailureCfa(
          this.errorHandler(error)
        );
      }
    }
  );
  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: RetrunInvoiceCfaAction.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new RetrunInvoiceCfaAction.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isSearchedItem: action.payload?.isSearchedItem,
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    StockReturnActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: RetrunInvoiceCfaAction.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new RetrunInvoiceCfaAction.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: RetrunInvoiceCfaAction.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new RetrunInvoiceCfaAction.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isSearchedItem: action.payload?.isSearchedItem,
        });
      }
    }
  );
}
