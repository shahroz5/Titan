import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { IssueTEPState } from './stock-issue-tep-gep.state';
import { IssueTEPActionTypes } from './stock-issue-tep-gep.action';
import * as IssueTEPActions from './stock-issue-tep-gep.action';
import {
  LocationDataService,
  CourierDataService,
  ProductGroupDataService,
  ProductCategoryDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  LocationSummary,
  ProductCategory,
  ProductGroup,
  Courier,
  StoreUser,
  CustomErrors,
  CreateStockIssueResponse,
  StockIssueItem,
  ImageResponse
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StockIssueTepGepService } from '../stock-issue-tep-gep.service';
import { tepGepFeatureKey } from './stock-issue-tep-gep.reducers';
import {
  CommonService,
  InventoryValidationService
} from '@poss-web/shared/common/data-access-common';

@Injectable()
export class IssueTEPEffects {
  constructor(
    private dataPersistence: DataPersistence<IssueTEPState>,
    private loggerService: LoggerService,
    private stockIssueTepGepService: StockIssueTepGepService,
    private courierDataService: CourierDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private locationDataService: LocationDataService,
    private storeUserDataService: StoreUserDataService,
    private commonService: CommonService
  ) {}

  @Effect() createStockIssue$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.CREATE_STOCK_ISSUE,
    {
      run: (action: IssueTEPActions.CreateStockIssue, state: IssueTEPState) => {
        return this.stockIssueTepGepService
          .createStockIssue(
            action.payload.transferType,
            action.payload.storeType
          )
          .pipe(
            map(
              (data: CreateStockIssueResponse) =>
                new IssueTEPActions.CreateStockIssueSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.CreateStockIssue,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.CreateStockIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateStockIssue$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.UPDATE_STOCK_ISSUE,
    {
      run: (action: IssueTEPActions.UpdateStockIssue, state: IssueTEPState) => {
        return this.stockIssueTepGepService
          .updateStockIssue(
            action.payload.id,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.remarks,
            action.payload.carrierDetails,
            action.payload.destinationLocationCode
          )
          .pipe(
            map(
              (data: CreateStockIssueResponse) =>
                new IssueTEPActions.UpdateStockIssueSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.UpdateStockIssue,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.UpdateStockIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadItems$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_ITEMS,
    {
      run: (action: IssueTEPActions.LoadItems, state: IssueTEPState) => {
        return this.stockIssueTepGepService
          .loadStockIssueItems(
            action.payload.id,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.status,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sort,
            action.payload.filter,
            state[tepGepFeatureKey].studdedProductGroups,
            action.payload.cfaLocationCode
          )
          .pipe(
            map(
              (data: StockIssueItem[]) =>
                new IssueTEPActions.LoadItemsSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadItems,
        error: HttpErrorResponse
      ) => {
        // return new IssueTEPActions.ResetList();
        return new IssueTEPActions.UpdateAllStockIssueItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateAllStockIssueItems$: Observable<
    Action
  > = this.dataPersistence.fetch(
    IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS,
    {
      run: (
        action: IssueTEPActions.UpdateAllStockIssueItems,
        state: IssueTEPState
      ) => {
        return this.stockIssueTepGepService
          .updateAllStockIssueItems(
            action.payload.id,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.itemIds
          )
          .pipe(
            map(
              (data: any) =>
                new IssueTEPActions.UpdateAllStockIssueItemsSuccess(true)
            )
          );
      },

      onError: (
        action: IssueTEPActions.UpdateAllStockIssueItems,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.UpdateAllStockIssueItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() createStockIssueItems$: Observable<
    Action
  > = this.dataPersistence.fetch(IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS, {
    run: (
      action: IssueTEPActions.CreateStockIssueItems,
      state: IssueTEPState
    ) => {
      return this.stockIssueTepGepService
        .createStockIssueItems(
          action.payload.id,
          action.payload.transferType,
          action.payload.storeType,
          action.payload.itemIds
        )
        .pipe(
          map(
            (data: any) =>
              new IssueTEPActions.CreateStockIssueItemsSuccess(true)
          )
        );
    },

    onError: (
      action: IssueTEPActions.CreateStockIssueItems,
      error: HttpErrorResponse
    ) => {
      return new IssueTEPActions.CreateStockIssueItemsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadStockIssueItems$: Observable<
    Action
  > = this.dataPersistence.fetch(IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS, {
    run: (
      action: IssueTEPActions.LoadStockIssueItems,
      state: IssueTEPState
    ) => {
      return this.stockIssueTepGepService
        .loadStockIssueItems(
          action.payload.id,
          action.payload.itemCode,
          action.payload.lotNumber,
          action.payload.transferType,
          action.payload.storeType,
          action.payload.status,
          action.payload.pageIndex,
          action.payload.pageSize,
          action.payload.sort,
          action.payload.filter,
          state[tepGepFeatureKey].studdedProductGroups,
          action.payload.cfaLocationCode
        )
        .pipe(
          map(
            (data: StockIssueItem[]) =>
              new IssueTEPActions.LoadStockIssueItemsSuccess(data)
          )
        );
    },

    onError: (
      action: IssueTEPActions.LoadStockIssueItems,
      error: HttpErrorResponse
    ) => {
      return new IssueTEPActions.ResetList();
    }
  });

  @Effect() totalItemsCount$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT,
    {
      run: (
        action: IssueTEPActions.LoadTotalItemsCount,
        state: IssueTEPState
      ) => {
        return this.stockIssueTepGepService
          .loadTotalCount(
            action.payload.id,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.status,
            action.payload.cfaLocationCode
          )
          .pipe(
            map(
              (data: number) =>
                new IssueTEPActions.LoadTotalItemsCountSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadTotalItemsCount,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadTotalItemsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() totalStockIssueItemsCount$: Observable<
    Action
  > = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT,
    {
      run: (
        action: IssueTEPActions.LoadTotalStockIssueItemsCount,
        state: IssueTEPState
      ) => {
        return this.stockIssueTepGepService
          .loadTotalCount(
            action.payload.id,
            action.payload.transferType,
            action.payload.storeType,
            action.payload.status,
            action.payload.cfaLocationCode
          )
          .pipe(
            map(
              (data: number) =>
                new IssueTEPActions.LoadTotalStockIssueItemsCountSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadTotalStockIssueItemsCount,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadTotalStockIssueItemsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFactoryAddress$: Observable<
    Action
  > = this.dataPersistence.fetch(IssueTEPActionTypes.LOAD_FACTORY_ADDRESS, {
    run: (action: IssueTEPActions.LoadFactoryAddress, state: IssueTEPState) => {
      return this.locationDataService
        .getLocationSummary()
        .pipe(
          map(
            (data: LocationSummary) =>
              new IssueTEPActions.LoadFactoryAddressSuccess(data.factoryDetails)
          )
        );
    },

    onError: (
      action: IssueTEPActions.LoadFactoryAddress,
      error: HttpErrorResponse
    ) => {
      return new IssueTEPActions.LoadFactoryAddressFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadCFAAddress$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_CFA_ADDRESS,
    {
      run: (action: IssueTEPActions.LoadcfaAddress, state: IssueTEPState) => {
        return this.locationDataService
          .getLocationSummary()
          .pipe(
            map(
              (data: LocationSummary) =>
                new IssueTEPActions.LoadcfaAddressSuccess(data.cfaDetails)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadcfaAddress,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadcfaAddressFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategories$: Observable<
    Action
  > = this.dataPersistence.fetch(IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES, {
    run: (
      action: IssueTEPActions.LoadProductCategories,
      state: IssueTEPState
    ) => {
      return this.productCategoryDataService
        .getProductCategories(false, null, null, ['description,asc'])
        .pipe(
          map(
            (data: ProductCategory[]) =>
              new IssueTEPActions.LoadProductCategoriesSuccess(data)
          )
        );
    },

    onError: (
      action: IssueTEPActions.LoadProductCategories,
      error: HttpErrorResponse
    ) => {
      return new IssueTEPActions.LoadProductCategoriesFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_PROUDCT_GROUPS,
    {
      run: (
        action: IssueTEPActions.LoadProductGroups,
        state: IssueTEPState
      ) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new IssueTEPActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCourierDetails$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_COURIER_DETAILS,
    {
      run: (action: IssueTEPActions.LoadCourierDetails) => {
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
                return new IssueTEPActions.LoadCourierDetailsSuccess(
                  courierNames
                );
              })
            )
        );
      },
      onError: (
        action: IssueTEPActions.LoadCourierDetails,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadCourierDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationCode$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_LOCATION_CODES,
    {
      run: (action: IssueTEPActions.LoadLocationCodes) => {
        return this.stockIssueTepGepService.getLocationCode().pipe(
          map((data: string[]) => {
            return new IssueTEPActions.LoadLocationCodesSuccess(data);
          })
        );
      },
      onError: (
        action: IssueTEPActions.LoadLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEmployeeCodes$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_EMPLOYEE_CODES,
    {
      run: (action: IssueTEPActions.LoadEmployeeCodes) => {
        return this.storeUserDataService.getStoreUsers().pipe(
          map((data: StoreUser[]) => {
            const employeeCodes: string[] = [];
            for (const employee of data) {
              employeeCodes.push(employee.employeeCode);
            }
            return new IssueTEPActions.LoadEmployeeCodesSuccess(employeeCodes);
          })
        );
      },
      onError: (
        action: IssueTEPActions.LoadEmployeeCodes,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadEmployeeCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEmployeeDetails$: Observable<Action> = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS,
    {
      run: (action: IssueTEPActions.LoadEmployeeDetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, action.payload)
          .pipe(
            map((data: StoreUser[]) => {
              return new IssueTEPActions.LoadEmployeeDetailsSuccess(data);
            })
          );
      },
      onError: (
        action: IssueTEPActions.LoadEmployeeDetails,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadEmployeeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new IssueTEPActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: IssueTEPActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new IssueTEPActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isSearchedItem: action.payload?.isSearchedItem
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: IssueTEPActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new IssueTEPActions.LoadImageUrlSuccess(loadImageResponse)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isSearchedItem: action.payload?.isSearchedItem
        });
      }
    }
  );

  @Effect() loadSelectedStockIssue$: Observable<
    Action
  > = this.dataPersistence.fetch(
    IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE,
    {
      run: (
        action: IssueTEPActions.LoadSelectedStockIssue,
        state: IssueTEPState
      ) => {
        return this.stockIssueTepGepService
          .getSelectedStockIssue(
            action.payload.transferType,
            action.payload.storeType,
            action.payload.id
          )
          .pipe(
            map(
              (data: CreateStockIssueResponse) =>
                new IssueTEPActions.LoadSelectedStockIssueSuccess(data)
            )
          );
      },

      onError: (
        action: IssueTEPActions.LoadSelectedStockIssue,
        error: HttpErrorResponse
      ) => {
        return new IssueTEPActions.LoadSelectedStockIssueFailure(
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
