import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as DiscountConfigActions from './discount-config.actions';
import { map, mergeMap } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  BrandSummary,
  CustomErrors,
  DiscountExcludeItemSuccessList,
  DiscountLocationSuccessList,
  DiscountProductCategorySuccessList,
  DiscountProductGroupSuccessList,
  Lov,
  NewDiscountApplicableConfig,
  ProductGroup,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import { DiscountConfigService } from '../discount-config.service';
import { DiscountConfigActionTypes } from './discount-config.actions';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  BrandDataService,
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class DiscountConfigEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public service: DiscountConfigService,
    public loggerService: LoggerService,
    private lovService: LovDataService,
    private brandDataService: BrandDataService,
    private productGroupDataService: ProductGroupDataService
  ) {}

  @Effect()
  loadDiscountConfigList$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_LIST,
    {
      run: (action: DiscountConfigActions.LoadDiscountConfigList) => {
        return this.service
          .loadDiscountConfigList(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.LoadDiscountConfigListSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountConfigList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBestDealDiscountList$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_BEST_DEAL_DISCOUNT_LIST,
    {
      run: (action: DiscountConfigActions.LoadBestDealDiscountList) => {
        return this.service
          .loadBeastDealDiscount(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.LoadBestDealDiscountListSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadBestDealDiscountList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadBestDealDiscountListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_CONFIG_DETAILS,
    {
      run: (action: DiscountConfigActions.LoadDiscountConfigDetails) => {
        return this.service
          .loadDiscountDetailsById(action.payload)
          .pipe(
            map(
              (discountDetails: NewDiscountApplicableConfig) =>
                new DiscountConfigActions.LoadDiscountConfigDetailsSuccess(
                  discountDetails
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveDiscountDetails$ = this.dataPersistence.pessimisticUpdate(
    DiscountConfigActionTypes.SAVE_DISCOUNT_CONFIG_DETAILS,
    {
      run: (action: DiscountConfigActions.SaveDiscountConfigList) => {
        return this.service.saveDiscountsDetails(action.payload).pipe(
          map(discountData => {
            return new DiscountConfigActions.SaveDiscountConfigListSuccess(
              discountData
            );
          })
        );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountConfigList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editDiscountDetails$ = this.dataPersistence.pessimisticUpdate(
    DiscountConfigActionTypes.EDIT_DISCOUNT_CONFIG_DETAILS,
    {
      run: (action: DiscountConfigActions.EditDiscountConfigList) => {
        return this.service.editDiscountDetails(action.id, action.payload).pipe(
          map(() => {
            return new DiscountConfigActions.EditDiscountConfigListSuccess();
          })
        );
      },
      onError: (
        action: DiscountConfigActions.EditDiscountConfigList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.EditDiscountConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() discountRequestList$: Observable<
    Action
  > = this.dataPersistence.fetch(DiscountConfigActionTypes.LOAD_REQUESTS, {
    run: (action: DiscountConfigActions.LoadRequests) => {
      return this.service
        .loadRequest(action.payload)
        .pipe(
          map(
            (data: any) => new DiscountConfigActions.LoadRequestsSuccess(data)
          )
        );
    },

    onError: (
      action: DiscountConfigActions.LoadRequests,
      error: HttpErrorResponse
    ) => {
      return new DiscountConfigActions.LoadRequestsFailure(
        this.errorHandler(error)
      );
    }
  });
  @Effect()
  loadDiscountLocationDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_LOCATION_LIST,
    {
      run: (action: DiscountConfigActions.LoadDiscountMappedLocationList) => {
        return this.service
          .getMappedLocationsList(action.payload)
          .pipe(
            map(
              (locationList: DiscountLocationSuccessList) =>
                new DiscountConfigActions.LoadDiscountMappedLocationListSuccess(
                  locationList
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountMappedLocationList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountMappedLocationListSuccess({
          discountLocationList: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  saveDiscountLocationDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_LOCATIONS,
    {
      run: (action: DiscountConfigActions.SaveDiscountLocations) => {
        return this.service
          .saveMappedLocations(action.payload)
          .pipe(
            map(() => new DiscountConfigActions.SaveDiscountLocationsSuccess())
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountLocations,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBestDealDiscounts$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_BEST_DEAL_DISCOUNTS,
    {
      run: (action: DiscountConfigActions.SaveBestDealDiscounts) => {
        return this.service
          .saveMappedBestDealDiscount(action.payload)
          .pipe(
            map(
              (bestDealDiscountList: any) =>
                new DiscountConfigActions.SaveBestDealDiscountsSuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveBestDealDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveBestDealDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountProductCategoryDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_CATEGORY_LIST,
    {
      run: (
        action: DiscountConfigActions.LoadDiscountMappedProductCategoryList
      ) => {
        return this.service
          .getMappedProductCategoryList(action.payload)
          .pipe(
            map(
              (productCategoryList: DiscountProductCategorySuccessList) =>
                new DiscountConfigActions.LoadDiscountMappedProductCategoryListSuccess(
                  productCategoryList
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountMappedProductCategoryList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountMappedProductCategoryListSuccess(
          {
            discountProductCategoryList: [],
            count: 0
          }
        );
      }
    }
  );

  @Effect()
  saveDiscountProductCategoryDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_PRODUCT_CATEGORIES,
    {
      run: (action: DiscountConfigActions.SaveDiscountProductCategory) => {
        return this.service
          .saveMappedProductCategories(action.payload)
          .pipe(
            map(
              () =>
                new DiscountConfigActions.SaveDiscountProductCategorySuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountProductCategory,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountProductCategoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountProductGroupDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_MAPPED_PRODUCT_GROUP_LIST,
    {
      run: (
        action: DiscountConfigActions.LoadDiscountMappedProductGroupList
      ) => {
        return this.service
          .getMappedProductGroupsList(action.payload)
          .pipe(
            map(
              (locationList: DiscountProductGroupSuccessList) =>
                new DiscountConfigActions.LoadDiscountMappedProductGroupListSuccess(
                  locationList
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountMappedProductGroupList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountMappedProductGroupListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveDiscountProductGroupDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_PRODUCT_GROUPS,
    {
      run: (action: DiscountConfigActions.SaveDiscountProductGroups) => {
        return this.service
          .saveMappedProductGroups(action.payload)
          .pipe(
            map(
              () => new DiscountConfigActions.SaveDiscountProductGroupsSuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountProductGroups,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountExcludeConfigDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_EXCLUDE_TYPE_LIST,
    {
      run: (action: DiscountConfigActions.LoadDiscountExcludeTypeList) => {
        console.log(action.payload, 'eff');

        return this.service
          .getExcludeItemsList(action.payload)
          .pipe(
            map(
              (excludeConfigList: DiscountExcludeItemSuccessList) =>
                new DiscountConfigActions.LoadDiscountExcludeTypeListSuccess(
                  excludeConfigList
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountExcludeTypeList,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountExcludeTypeListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadDiscountExcludeItemDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_EXCLUDE_ITEM_CODES,
    {
      run: (action: DiscountConfigActions.LoadDiscountExcludeItemCodes) => {
        return this.service
          .getExcludeItemsList(action.payload)
          .pipe(
            map(
              (excludeConfigList: DiscountExcludeItemSuccessList) =>
                new DiscountConfigActions.LoadDiscountExcludeItemCodesSuccess(
                  excludeConfigList
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountExcludeItemCodes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountExcludeItemCodesSuccess({
          discountExcludeItemList: [],
          count: 0
        });
      }
    }
  );
  @Effect()
  saveDiscountExcludeThemesDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_EXCLUDE_THEME_CODES,
    {
      run: (action: DiscountConfigActions.SaveDiscountExcludeThemes) => {
        return this.service
          .saveExcludeThemeCodes(action.payload)
          .pipe(
            map(
              () => new DiscountConfigActions.SaveDiscountExcludeThemesSuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountExcludeThemes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountExcludeThemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveDiscountExcludeTypeDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_EXCLUDE_TYPE,
    {
      run: (action: DiscountConfigActions.SaveDiscountExcludeTypes) => {
        return this.service
          .saveExcludeTypes(action.payload)
          .pipe(
            map(
              () => new DiscountConfigActions.SaveDiscountExcludeTypesSuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountExcludeTypes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountExcludeTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveDiscountExcludeSchemesDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.MAP_EXCLUDE_SCHEME_CODES,
    {
      run: (action: DiscountConfigActions.SaveDiscountExcludeSchemes) => {
        return this.service
          .saveExcludeSchemeCodes(action.payload)
          .pipe(
            map(
              () =>
                new DiscountConfigActions.SaveDiscountExcludeSchemesSuccess()
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountExcludeSchemes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountExcludeSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedLocations$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.GET_MAPPED_LOCATIONS,
    {
      run: (action: DiscountConfigActions.LoadSelectedLocations) => {
        return this.service
          .getSelectedLocations(action.payload)
          .pipe(
            map(
              locations =>
                new DiscountConfigActions.LoadSelectedLocationsSuccess(
                  locations
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadSelectedLocations,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadSelectedLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedBestDealDiscounts$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.GET_MAPPED_BEST_DEAL_DISCOUNTS,
    {
      run: (action: DiscountConfigActions.LoadSelectedBestDealDiscounts) => {
        return this.service
          .getSelectedBestDealDiscount(action.payload)
          .pipe(
            map(
              discount =>
                new DiscountConfigActions.LoadSelectedBestDealDiscountSuccess(
                  discount
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadSelectedBestDealDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadSelectedBestDealDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedProductGroups$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.GET_MAPPED_PRODUCT_GROUPS,
    {
      run: (action: DiscountConfigActions.LoadSelectedProductGroups) => {
        return this.service
          .getSelectedProductGroups(action.payload)
          .pipe(
            map(
              productGroups =>
                new DiscountConfigActions.LoadSelectedProductGroupsSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadSelectedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadSelectedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedProductCategories$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.GET_MAPPED_PRODUCT_CATEGORIES,
    {
      run: (action: DiscountConfigActions.LoadSelectedProductCategories) => {
        return this.service
          .getSelectedProductCategories(action.payload)
          .pipe(
            map(
              productCategories =>
                new DiscountConfigActions.LoadSelectedProductCategoriesSuccess(
                  productCategories
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadSelectedProductCategories,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadSelectedProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  publishDiscountConfig$ = this.dataPersistence.pessimisticUpdate(
    DiscountConfigActionTypes.PUBLISH_DISCOUNT_CONFIG,
    {
      run: (action: DiscountConfigActions.PublishDiscountConfig) => {
        return this.service.publishDiscount(action.payload).pipe(
          map(() => {
            return new DiscountConfigActions.PublishDiscountConfigSuccess();
          })
        );
      },
      onError: (
        action: DiscountConfigActions.PublishDiscountConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.PublishDiscountConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sendForApproval$ = this.dataPersistence.pessimisticUpdate(
    DiscountConfigActionTypes.SEND_FOR_APPROVAL_DISCOUNT_CONFIG,
    {
      run: (action: DiscountConfigActions.SendForApprovalDiscountConfig) => {
        return this.service.sendDiscountForApproval(action.payload).pipe(
          map(() => {
            return new DiscountConfigActions.SendForApprovalDiscountConfigSuccess();
          })
        );
      },
      onError: (
        action: DiscountConfigActions.SendForApprovalDiscountConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SendForApprovalDiscountConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  approveWorkflow$ = this.dataPersistence.pessimisticUpdate(
    DiscountConfigActionTypes.APPROVE_DISCOUNT_CONFIG,
    {
      run: (action: DiscountConfigActions.ApproveDiscountConfig) => {
        return this.service.approveOrCancelDiscount(action.payload).pipe(
          map(value => {
            return new DiscountConfigActions.ApproveDiscountConfigSuccess(
              value
            );
          })
        );
      },
      onError: (
        action: DiscountConfigActions.ApproveDiscountConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.ApproveDiscountConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveSlabDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.SAVE_SLAB_DETAILS,
    {
      run: (action: DiscountConfigActions.SaveSlabDetails) => {
        return this.service
          .saveSlabDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.SaveSlabDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveSlabDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveSlabDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveDiscDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.SAVE_DISCOUNT_DETAILS,
    {
      run: (action: DiscountConfigActions.SaveDiscountDetails) => {
        return this.service
          .saveDiscountDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.SaveDiscountDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveDiscountDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveDiscountDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_DETAILS,
    {
      run: (action: DiscountConfigActions.LoadDiscountDetails) => {
        return this.service
          .loadDiscountDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.LoadDiscountDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountComponentPGConfig$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_COMPONENT_PG_CONFIG,
    {
      run: (action: DiscountConfigActions.LoadDiscountComponentPGConfig) => {
        return this.productGroupDataService
          .getProductGroups(
            false,
            undefined,
            undefined,
            undefined,
            action.payload.pgType
          )
          .pipe(
            mergeMap((productGroups: ProductGroup[]) => {
              return this.service
                .loadDiscountComponentPGConfig(action.payload, productGroups)
                .pipe(
                  map(
                    (data: any) =>
                      new DiscountConfigActions.LoadDiscountComponentPGConfigSuccess(
                        data
                      )
                  )
                );
            })
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountComponentPGConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountComponentPGConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateDiscountComponentPGConfig$: Observable<
    Action
  > = this.dataPersistence.fetch(
    DiscountConfigActionTypes.UPDATE_DISCOUNT_COMPONENT_PG_CONFIG,
    {
      run: (action: DiscountConfigActions.UpdateDiscountComponentPGConfig) => {
        return this.service
          .updateDiscountComponentPGConfig(action.payload)
          .pipe(
            mergeMap((data: any[]) => [
              new DiscountConfigActions.UpdateDiscountComponentPGConfigSuccess(
                data
              ),
              new DiscountConfigActions.LoadDiscountComponentPGConfig(
                action.payload.loadData
              )
            ])
          );
      },
      onError: (
        action: DiscountConfigActions.UpdateDiscountComponentPGConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.UpdateDiscountComponentPGConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID,
    {
      run: (
        action: DiscountConfigActions.LoadMappedProductGroupsByConfigId
      ) => {
        return this.service
          .loadMappedProductGroups(
            action.payload.discountId,
            action.payload.discountDetailsId
          )
          .pipe(
            map(
              (productGroups: ProductGroupMappingOption[]) =>
                new DiscountConfigActions.LoadMappedProductGroupsByConfigIdSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadMappedProductGroupsByConfigId,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadMappedProductGroupsByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    DiscountConfigActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID,
    {
      run: (
        action: DiscountConfigActions.UpdateMappedProductGroupByConfigId
      ) => {
        return this.service
          .updateMappedProductGroups(
            action.payload.discountId,
            action.payload.discountDetailsId,
            action.payload.data
          )
          .pipe(
            mergeMap((productGroups: ProductGroupMappingOption[]) => [
              new DiscountConfigActions.UpdateMappedProductGroupByConfigIdSuccess(
                productGroups
              ),
              new DiscountConfigActions.LoadDiscountComponentPGConfig(
                action.payload.loadData
              )
            ])
          );
      },
      onError: (
        action: DiscountConfigActions.UpdateMappedProductGroupByConfigId,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.UpdateMappedProductGroupByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadBrands$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_BRANDS,
    {
      run: (action: DiscountConfigActions.LoadBrands) => {
        return this.brandDataService
          .getBrandSummary(false)
          .pipe(
            map(
              (parentBrands: BrandSummary[]) =>
                new DiscountConfigActions.LoadBrandsSuccess(parentBrands)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadBrands,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadBrandsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSubBrands$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_SUB_BRANDS,
    {
      run: (action: DiscountConfigActions.LoadSubBrands) => {
        return this.brandDataService
          .getBrandSummary(false, action.payload)
          .pipe(
            map(
              (parentBrands: BrandSummary[]) =>
                new DiscountConfigActions.LoadSubBrandsSuccess(parentBrands)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadSubBrands,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadSubBrandsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountTypes$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_DISCOUNT_TYPES,
    {
      run: (action: DiscountConfigActions.LoadDiscountTypes) => {
        return this.lovService
          .getLov(action.payload, false, true)
          .pipe(
            map(
              (discountTypes: Lov[]) =>
                new DiscountConfigActions.LoadDiscountTypesSuccess(
                  discountTypes
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadDiscountTypes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadDiscountTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadApprovers$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_APPROVERS,
    {
      run: (action: DiscountConfigActions.LoadApprovers) => {
        return this.lovService
          .getLov(action.payload)
          .pipe(
            map(
              (discountTypes: Lov[]) =>
                new DiscountConfigActions.LoadApproversSuccess(discountTypes)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadApprovers,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadApproversFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadApplicableLevels$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_APPLICABLE_LEVELS,
    {
      run: (action: DiscountConfigActions.LoadApplicableLevels) => {
        return this.lovService
          .getLocationLovs(action.payload)
          .pipe(
            map(
              (applicableLevels: Lov[]) =>
                new DiscountConfigActions.LoadApplicableLevelsSuccess(
                  applicableLevels
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadApplicableLevels,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadApplicableLevelsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadClubbingDiscountTypes$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_CLUBBING_DISCOUNT_TYPES,
    {
      run: (action: DiscountConfigActions.LoadClubbingDiscountTypes) => {
        return this.lovService
          .getLov(action.payload)
          .pipe(
            map(
              (discountTypes: Lov[]) =>
                new DiscountConfigActions.LoadClubbingDiscountTypesSuccess(
                  discountTypes
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadClubbingDiscountTypes,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadClubbingDiscountTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_TEP_DURATION_RANGE,
    {
      run: (action: DiscountConfigActions.LoadTepDurationDaysRange) => {
        return this.service
          .loadRangeTepDurationDays()
          .pipe(
            map(
              rangeWeight =>
                new DiscountConfigActions.LoadTepDurationDaysRangeSuccess(
                  rangeWeight
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadTepDurationDaysRange,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadTepDurationDaysRangeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveEmpowermentDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.SAVE_EMPOWERMENT_DETAILS,
    {
      run: (action: DiscountConfigActions.SaveEmpowermentDetails) => {
        return this.service
          .saveSlabDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.SaveEmpowermentDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.SaveEmpowermentDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.SaveEmpowermentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  computeTsssConfig$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.COMPUTE_TSSS_CONFIG,
    {
      run: (action: DiscountConfigActions.ComputeTsssConfig) => {
        return this.service
          .computeTSSSConfig(action.payload)
          .pipe(
            map(
              data => new DiscountConfigActions.ComputeTsssConfigSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.ComputeTsssConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.ComputeTsssConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateEmpowermentDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.UPDATE_EMPOWERMENT_DETAILS,
    {
      run: (action: DiscountConfigActions.UpdateEmpowermentDetails) => {
        return this.service
          .updateEmpowermentDiscountDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.UpdateEmpowermentDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.UpdateEmpowermentDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.UpdateEmpowermentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  tsssConfigDownloadUrl$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_TSSS_CONFIG_DOWNLOAD_URL,
    {
      run: (action: DiscountConfigActions.LoadTsssConfigDownloadUrl) => {
        return this.service
          .getDownloadUrlOfTsssConfig(action.payload)
          .pipe(
            map(
              data =>
                new DiscountConfigActions.LoadTsssConfigDownloadUrlSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadTsssConfigDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadTsssConfigDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEmpowermentDiscDetails$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_EMPOWERMENT_DISCOUNT_DETAILS,
    {
      run: (action: DiscountConfigActions.LoadEmpowermentDiscountDetails) => {
        return this.service
          .getEmpowermentDiscountDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.LoadEmpowermentDiscountDetailsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadEmpowermentDiscountDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadEmpowermentDiscountDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFaqFileUplaod$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.FAQ_FILE_UPLOAD,
    {
      run: (action: DiscountConfigActions.FaqFileUpload) => {
        return this.service
          .uploadFaq(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.FaqFileUploadSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.FaqFileUpload,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.FaqFileUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFaqFileDownload$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.FAQ_FILE_DOWNLOAD,
    {
      run: (action: DiscountConfigActions.FaqFileDownload) => {
        return this.service
          .downloadFaqFile(action.payload)
          .pipe(map(() => new DiscountConfigActions.FaqFileDownloadSuccess()));
      },
      onError: (
        action: DiscountConfigActions.FaqFileDownload,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.FaqFileDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadResendEmailStatus$ = this.dataPersistence.fetch(
    DiscountConfigActionTypes.LOAD_RESEND_EMAIL_STATUS,
    {
      run: (action: DiscountConfigActions.LoadResendEmailStatus) => {
        return this.service
          .resendEmail(action.payload)
          .pipe(
            map(
              (data: any) =>
                new DiscountConfigActions.LoadResendEmailStatusSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountConfigActions.LoadResendEmailStatus,
        error: HttpErrorResponse
      ) => {
        return new DiscountConfigActions.LoadResendEmailStatusFailure(
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
