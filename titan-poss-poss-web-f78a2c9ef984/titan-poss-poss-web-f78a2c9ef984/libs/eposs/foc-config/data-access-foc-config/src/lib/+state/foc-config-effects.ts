import { Injectable } from '@angular/core';

import { FocConfigurationActionTypes } from './foc-config-actions';
import * as FocConfigurationActions from './foc-config-actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FocConfigService } from '../foc-config.service';
import {
  CustomErrors,
  FocConfigurationList,
  SchemeDetails,
  VariantDetails, 
  ProductGroupMappingOption,
  FOCItemCodes,
  FocItemsResponse,
  LocationListSuccessPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';

@Injectable()
export class FocConfigurationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private focConfigurationService: FocConfigService
  ) {}

  @Effect()
  loadFocConfigurationList$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_FOC_CONFIGURATION_LIST,
    {
      run: (action: FocConfigurationActions.LoadFocConfigurationList) => {
        return this.focConfigurationService
          .getFocConfiguratonList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.searchValue
          )
          .pipe(
            map(
              (focconfiglist: FocConfigurationList) =>
                new FocConfigurationActions.LoadFocConfigurationListSuccess(
                  focconfiglist
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadFocConfigurationList,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadFocConfigurationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateFocSchemeConfiguration$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.UPDATE_FOC_SCHEME_CONFIGURATION,
    {
      run: (action: FocConfigurationActions.UpdateFocSchemeConfiguration) => {
        return this.focConfigurationService
          .updateFocConfiguration(action.payload)
          .pipe(
            map(
              (focConfiguration: SchemeDetails) =>
                new FocConfigurationActions.UpdateFocSchemeConfigurationSuccess(
                  focConfiguration
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.UpdateFocSchemeConfiguration,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.UpdateFocSchemeConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveFocSchemeConfiguration$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SAVE_FOC_SCHEME_CONFIGURATION,
    {
      run: (action: FocConfigurationActions.SaveFocSchemeConfiguration) => {
        return this.focConfigurationService
          .saveFocConfiguration(action.payload)
          .pipe(
            map(
              (schemeDetails: SchemeDetails) =>
                new FocConfigurationActions.SaveFocSchemeConfigurationSuccess(
                  schemeDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.SaveFocSchemeConfiguration,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SaveFocSchemeConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchConfigBySchemeName$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SEARCH_CONFIG_BY_SCHEME_NAME,
    {
      run: (action: FocConfigurationActions.SearchConfigBySchemeName) => {
        return this.focConfigurationService
          .searchConfigBySchemeName(action.payload)
          .pipe(
            map(
              (focConfiguration: FocConfigurationList) =>
                new FocConfigurationActions.SearchConfigBySchemeNameSuccess(
                  focConfiguration
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.SearchConfigBySchemeName,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SearchConfigBySchemeNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFocConfigurationByConfigId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_FOC_SCHEME_CONFIGURATION_BY_CONFIG_ID,
    {
      run: (
        action: FocConfigurationActions.LoadFocSchemeConfigurationByConfigId
      ) => {
        return this.focConfigurationService
          .getFocSchemeConfiguration(action.payload)
          .pipe(
            map(
              (schemeDetails: SchemeDetails) =>
                new FocConfigurationActions.LoadFocSchemeConfigurationByConfigIdSuccess(
                  schemeDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadFocSchemeConfigurationByConfigId,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadFocSchemeConfigurationByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_RANGE_WEIGHT,
    {
      run: (action: FocConfigurationActions.LoadRangeWeight) => {
        return this.focConfigurationService
          .loadRangeWeight()

          .pipe(
            map(
              rangeWeight =>
                new FocConfigurationActions.LoadRangeWeightSuccesss(rangeWeight)
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadRangeWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveVariantDetails$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SAVE_VARIANT_DETAILS,
    {
      run: (action: FocConfigurationActions.SaveVariantDetails) => {
        return this.focConfigurationService
          .saveVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.SaveVariantDetailsSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.SaveVariantDetails,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SaveVariantDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  publishFocScheme$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.PUBLISH_FOC_SCHEME,
    {
      run: (action: FocConfigurationActions.PublishFocScheme) => {
        return this.focConfigurationService
          .publishFocScheme(action.payload)
          .pipe(
            map(() => new FocConfigurationActions.PublishFocSchemeSuccesss())
          );
      },
      onError: (
        action: FocConfigurationActions.PublishFocScheme,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.PublishFocSchemeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadVariantDetails$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_BY_ID,
    {
      run: (action: FocConfigurationActions.LoadVariantDetailsById) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_CONFIG_ID,
    {
      run: (
        action: FocConfigurationActions.LoadMappedProductGroupsByConfigId
      ) => {
        return this.focConfigurationService
          .loadMappedProductGroups(action.payload)
          .pipe(
            map(
              (productGroups: ProductGroupMappingOption[]) =>
                new FocConfigurationActions.LoadMappedProductGroupsByConfigIdSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadMappedProductGroupsByConfigId,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadMappedProductGroupsByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_CONFIG_ID,
    {
      run: (action: FocConfigurationActions.UpdateProductGroupByConfigId) => {
        return this.focConfigurationService
          .updateProductGroups(action.payload)
          .pipe(
            map(
              (productGroups: ProductGroupMappingOption[]) =>
                new FocConfigurationActions.UpdateProductGroupByConfigIdSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.UpdateProductGroupByConfigId,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.UpdateProductGroupByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationById$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_MAPPED_LOCATIONS_BY_ID,
    {
      run: (action: FocConfigurationActions.LoadLocationById) => {
        return this.focConfigurationService
          .loadMappedLocations(action.payload)
          .pipe(
            map(
              (locationListSuccessPayload: LocationListSuccessPayload) =>
                new FocConfigurationActions.LoadLocationByIdSuccess(
                  locationListSuccessPayload
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadLocationById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadLocationByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateLocationById$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.UPDATE_LOCATIONS_BY_ID,
    {
      run: (action: FocConfigurationActions.UpdateLocationById) => {
        return this.focConfigurationService
          .updateLocationById(
            action.payload.id,
            action.payload.saveLocationPayload
          )
          .pipe(
            map(() => new FocConfigurationActions.UpdateLocationByIdSuccess())
          );
      },
      onError: (
        action: FocConfigurationActions.UpdateLocationById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.UpdateLocationByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveFocItems$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SAVE_FOC_ITEMS,
    {
      run: (action: FocConfigurationActions.SaveFocItems) => {
        return this.focConfigurationService
          .saveFocItems(action.payload)
          .pipe(map(() => new FocConfigurationActions.SaveFocItemsSuccess()));
      },
      onError: (
        action: FocConfigurationActions.SaveFocItems,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SaveFocItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappedFocItems$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_MAPPED_FOC_ITEMS_BY_ID,
    {
      run: (action: FocConfigurationActions.LoadMappedFocItemsById) => {
        return this.focConfigurationService
          .loadMappedFocItems(action.payload)
          .pipe(
            map(
              (response: FocItemsResponse) =>
                new FocConfigurationActions.LoadMappedFocItemsByIdSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadMappedFocItemsById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadMappedFocItemsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllMappedFocItems$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_ITEM_CODES,
    {
      run: (action: FocConfigurationActions.LoadAllSelectedItemCodes) => {
        return this.focConfigurationService
          .loadMappedFocItems(action.payload)
          .pipe(
            map(
              (response: FocItemsResponse) =>
                new FocConfigurationActions.LoadAllSelectedItemCodesSuccess(
                  response.items
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadAllSelectedItemCodes,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadAllSelectedItemCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchFocItem$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SEARCH_FOC_ITEM,
    {
      run: (action: FocConfigurationActions.SearchFocItem) => {
        return this.focConfigurationService
          .searchFocItems(action.payload)
          .pipe(
            map(
              (searchResponse: FOCItemCodes[]) =>
                new FocConfigurationActions.SearchFocItemSuccess(searchResponse)
            )
          );
      },
      onError: (
        action: FocConfigurationActions.SearchFocItem,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SearchFocItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFocItems$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_FOC_ITEM_CODES,
    {
      run: (action: FocConfigurationActions.LoadFocItemCodes) => {
        return this.focConfigurationService
          .loadFOCItemCodes(action.payload)
          .pipe(
            map(
              (focItems: FOCItemCodes[]) =>
                new FocConfigurationActions.LoadFocItemCodesSuccess(focItems)
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadFocItemCodes,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadFocItemCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchLocationCode$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.SEARCH_LOCATION_CODE,
    {
      run: (action: FocConfigurationActions.SearchLocationCode) => {
        return this.focConfigurationService
          .searchLocationCode(action.payload)
          .pipe(
            map(
              (locationListSuccessPayload: LocationListSuccessPayload) =>
                new FocConfigurationActions.SearchLocationCodeSuccess(
                  locationListSuccessPayload
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.SearchLocationCode,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.SearchLocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // View specific

  @Effect()
  loadVariantDetailsValueGoldStandardById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_STANDARD_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsValueGoldStandardById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsValueGoldStandardByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsValueGoldStandardById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsValueGoldStandardByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsValueGoldSlabById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_GOLD_SLAB_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsValueGoldSlabById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsValueGoldSlabByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsValueGoldSlabById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsValueGoldSlabByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsValueOthersStandardById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_STANDARD_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsValueOthersStandardById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsValueOthersStandardByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsValueOthersStandardById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsValueOthersStandardByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsValueOthersSlabById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_VALUE_OTHERS_SLAB_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsValueOthersSlabById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsValueOthersSlabByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsValueOthersSlabById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsValueOthersSlabByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsWeightGoldStandardById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_STANDARD_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsWeightGoldStandardById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsWeightGoldStandardByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsWeightGoldStandardById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsWeightGoldStandardByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsWeightGoldSlabById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_GOLD_SLAB_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsWeightGoldSlabById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsWeightGoldSlabByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsWeightGoldSlabById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsWeightGoldSlabByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsWeightOthersStandardById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_STANDARD_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsWeightOthersStandardById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsWeightOthersStandardByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsWeightOthersStandardById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsWeightOthersStandardByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  LoadVariantDetailsWeightOthersSlabById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_VARIANT_DEATAILS_WEIGHT_OTHERS_SLAB_BY_ID,
    {
      run: (
        action: FocConfigurationActions.LoadVariantDetailsWeightOthersSlabById
      ) => {
        return this.focConfigurationService
          .loadVariantDetails(action.payload)
          .pipe(
            map(
              (variantDetails: VariantDetails) =>
                new FocConfigurationActions.LoadVariantDetailsWeightOthersSlabByIdSuccess(
                  variantDetails
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadVariantDetailsWeightOthersSlabById,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadVariantDetailsWeightOthersSlabByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllSelectedLocations$: Observable<Action> = this.dataPersistence.fetch(
    FocConfigurationActionTypes.LOAD_ALL_SELECTED_LOCATION_CODES,
    {
      run: (action: FocConfigurationActions.LoadAllSelectedLocationCodes) => {
        return this.focConfigurationService
          .loadMappedLocations(action.payload)
          .pipe(
            map(
              (locationListSuccessPayload: LocationListSuccessPayload) =>
                new FocConfigurationActions.LoadAllSelectedLocationCodesSuccess(
                  locationListSuccessPayload
                )
            )
          );
      },
      onError: (
        action: FocConfigurationActions.LoadAllSelectedLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new FocConfigurationActions.LoadAllSelectedLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // View specific ends

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
