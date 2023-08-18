import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  ProductCategory,
  ProductGroup,
  ProductGroupMappingOption,
  RivaahConfigurationResponse,
  RivaahLocationSuccessList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';
import { RivaahConfigurationService } from '../rivaah-configuration.service';
import * as RivaahConfigurationAction from './rivaah-configuration.actions';
import { RivaahConfigurationActionTypes } from './rivaah-configuration.actions';
import {
  ProductGroupDataService,
  ProductCategoryDataService
} from '@poss-web/shared/masters/data-access-masters';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';


@Injectable()
export class RivaahConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public rivaahConfigurationService: RivaahConfigurationService,
    public loggerService: LoggerService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService
  ) {}

  @Effect()
  loadCouponConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION,
    {
      run: (action: RivaahConfigurationAction.LoadCouponConfiguration) => {
        return this.rivaahConfigurationService
          .getCouponConfiguration(
            action.payload.configId,
            action.payload.ruleType
          )
          .pipe(
            map(
              selectedConfigData =>
                new RivaahConfigurationAction.LoadCouponConfigurationSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.LoadCouponConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadCouponConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCouponConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION,
    {
      run: (action: RivaahConfigurationAction.UpdateCouponConfiguration) => {
        return this.rivaahConfigurationService
          .updateCouponConfiguration(action.payload)
          .pipe(
            map(
              (payload: RivaahConfigurationResponse) =>
                new RivaahConfigurationAction.UpdateCouponConfigurationSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.UpdateCouponConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.UpdateCouponConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRivaahElibilityConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION,
    {
      run: (
        action: RivaahConfigurationAction.LoadRivaahEligibilityConfiguration
      ) => {
        return this.rivaahConfigurationService
          .getRivaahEligibilityConfiguration(
            action.payload.configId,
            action.payload.ruleType,
            action.payload?.productCategoryCode,
            action.payload?.productGroupCode,
            action.payload?.pageIndex,
            action.payload?.pageSize
          )
          .pipe(
            map(
              selectedConfigData =>
                new RivaahConfigurationAction.LoadRivaahEligibilityConfigurationSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.LoadRivaahEligibilityConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadRivaahEligibilityConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  createRivaahEligibilityConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION,
    {
      run: (
        action: RivaahConfigurationAction.CreateRivaahEligibilityConfiguration
      ) => {
        return this.rivaahConfigurationService
          .updateRivaahEligibilityConfiguration(action.payload)
          .pipe(
            map(
              () =>
                new RivaahConfigurationAction.CreateRivaahEligibilityConfigurationSuccess()
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.CreateRivaahEligibilityConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.CreateRivaahEligibilityConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateRivaahEligibilityConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.UPDATE_RIVAAH_ELIGIBILITY_CONFIGURATION,
    {
      run: (
        action: RivaahConfigurationAction.UpdateRivaahEligibilityConfiguration
      ) => {
        return this.rivaahConfigurationService
          .updateRivaahEligibilityConfiguration(action.payload)
          .pipe(
            map(
              () =>
                new RivaahConfigurationAction.UpdateRivaahEligibilityConfigurationSuccess()
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.UpdateRivaahEligibilityConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.UpdateRivaahEligibilityConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deleteRivaahEligibilityConfiguration$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.DELETE_RIVAAH_ELIGIBILITY_CONFIGURATION,
    {
      run: (
        action: RivaahConfigurationAction.DeleteRivaahEligibilityConfiguration
      ) => {
        return this.rivaahConfigurationService
          .updateRivaahEligibilityConfiguration(action.payload)
          .pipe(
            map(
              () =>
                new RivaahConfigurationAction.DeleteRivaahEligibilityConfigurationSuccess()
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.DeleteRivaahEligibilityConfiguration,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.DeleteRivaahEligibilityConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  toggleRivaahEligibilityConfigurationStatus$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.TOGGLE_RIVAAH_ELIGIBILITY_CONFIGURATION_STATUS,
    {
      run: (
        action: RivaahConfigurationAction.ToggleRivaahEligibilityConfigurationStatus
      ) => {
        return this.rivaahConfigurationService
          .updateRivaahEligibilityConfiguration(action.payload)
          .pipe(
            map(
              () =>
                new RivaahConfigurationAction.ToggleRivaahEligibilityConfigurationStatusSuccess()
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.ToggleRivaahEligibilityConfigurationStatus,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.ToggleRivaahEligibilityConfigurationStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUPS_BY_PRODUCT_ID,
    {
      run: (
        action: RivaahConfigurationAction.LoadMappedProductGroupsByProductId
      ) => {
        return this.rivaahConfigurationService
          .loadMappedProductGroups(action.payload)
          .pipe(
            map(
              (productGroups: ProductGroupMappingOption[]) =>
                new RivaahConfigurationAction.LoadMappedProductGroupsByProductIdSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.LoadMappedProductGroupsByProductId,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadMappedProductGroupsByProductIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategory$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_PRODUCT_CATEGORY,
    {
      run: (action: RivaahConfigurationAction.LoadProductCategory) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new RivaahConfigurationAction.LoadProductCategorySuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: RivaahConfigurationAction.LoadProductCategory,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadProductCategoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadMappedProductCategory$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_MAPPED_PRODUCT_CATEGORY,
    {
      run: (action: RivaahConfigurationAction.LoadMappedProductCategory) => {
        return this.rivaahConfigurationService
          .getMappedProductCategories(
            action.payload.ruleId,
            action.payload.ruleType,
          )
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new RivaahConfigurationAction.LoadMappedProductCategorySuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: RivaahConfigurationAction.LoadMappedProductCategory,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadMappedProductCategoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.UPDATE_PRODUCT_GROUPS_BY_PRODUCT_ID,
    {
      run: (action: RivaahConfigurationAction.UpdateProductGroupByProductId) => {
        return this.rivaahConfigurationService
          .updateProductGroups(action.payload)
          .pipe(
            map(
              (productGroups: ProductGroupMappingOption[]) =>
                new RivaahConfigurationAction.UpdateProductGroupByProductIdSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.UpdateProductGroupByProductId,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.UpdateProductGroupByProductIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRivaahLocationDetails$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.LOAD_RIVAAH_MAPPED_LOCATION_LIST,
    {
      run: (action: RivaahConfigurationAction.LoadRivaahMappedLocationList) => {
        return this.rivaahConfigurationService
          .getRivaahMappedLocationsList(action.payload)
          .pipe(
            map(
              (locationList: RivaahLocationSuccessList) =>
                new RivaahConfigurationAction.LoadRivaahMappedLocationListSuccess(
                  locationList
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.LoadRivaahMappedLocationList,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadRivaahMappedLocationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  
  @Effect()
  saveRivaahLocationDetails$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.SAVE_RIVAAH_LOCATIONS,
    {
      run: (action: RivaahConfigurationAction.SaveRivaahLocations) => {
        return this.rivaahConfigurationService
          .saveRivaahLocations(action.payload)
          .pipe(
            map(() => new RivaahConfigurationAction.SaveRivaahLocationsSuccess())
          );
      },
      onError: (
        action: RivaahConfigurationAction.SaveRivaahLocations,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.SaveRivaahLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateRivaahLocationDetails$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.UPDATE_RIVAAH_LOCATIONS,
    {
      run: (action: RivaahConfigurationAction.UpdateRivaahLocations) => {
        return this.rivaahConfigurationService
          .saveRivaahLocations(action.payload)
          .pipe(
            map(() => new RivaahConfigurationAction.UpdateRivaahLocationsSuccess())
          );
      },
      onError: (
        action: RivaahConfigurationAction.UpdateRivaahLocations,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.UpdateRivaahLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deleteRivaahLocationDetails$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.DELETE_RIVAAH_LOCATIONS,
    {
      run: (action: RivaahConfigurationAction.DeleteRivaahLocations) => {
        return this.rivaahConfigurationService
          .saveRivaahLocations(action.payload)
          .pipe(
            map(() => new RivaahConfigurationAction.DeleteRivaahLocationsSuccess())
          );
      },
      onError: (
        action: RivaahConfigurationAction.DeleteRivaahLocations,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.DeleteRivaahLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedLocations$ = this.dataPersistence.fetch(
    RivaahConfigurationActionTypes.GET_MAPPED_LOCATIONS,
    {
      run: (action: RivaahConfigurationAction.LoadSelectedLocations) => {
        return this.rivaahConfigurationService
          .getSelectedLocations(action.payload)
          .pipe(
            map(
              locations =>
                new RivaahConfigurationAction.LoadSelectedLocationsSuccess(
                  locations
                )
            )
          );
      },
      onError: (
        action: RivaahConfigurationAction.LoadSelectedLocations,
        error: HttpErrorResponse
      ) => {
        return new RivaahConfigurationAction.LoadSelectedLocationsFailure(
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
