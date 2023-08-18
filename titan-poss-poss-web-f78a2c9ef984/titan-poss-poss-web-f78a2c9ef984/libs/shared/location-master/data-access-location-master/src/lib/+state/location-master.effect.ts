import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';

import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';

import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationMasterActionTypes } from './location-master.actions';
import * as LocationMasterActions from './location-master.actions';
import { LocationMasterService } from '../location-master.service';
import {
  CustomErrors,
  BrandSummary,
  RegionSummary,
  LocationListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList,
  StateTypes,
  LocationCFAType
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RegionDataService,
  BrandDataService
} from '@poss-web/shared/masters/data-access-masters';
/**
 * Location Master Effects
 */
@Injectable()
export class LocationMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationService: LocationMasterService,
    private brandDataService: BrandDataService,
    private regionDataService: RegionDataService
  ) {}
  /**
   *  The effect which handles the loadPendingFactorySTN Action
   */

  @Effect()
  loadLocationListing$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_LOCATION_LISTING,
    {
      run: (action: LocationMasterActions.LoadLocationListing) => {
        return this.locationService
          .getLocationListing(action.payload.pageIndex, action.payload.pageSize)
          .pipe(
            map(
              (locationList: LocationListingPayload) =>
                new LocationMasterActions.LoadLocationListingSuccess(
                  locationList
                )
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadLocationListing,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadLocationListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchLocationByLocationCode$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.SEARCH_LOCATION_BY_LOCATIONCODE,
    {
      run: (action: LocationMasterActions.SearchLocationByLocationCode) => {
        return this.locationService
          .searchLocationByLocationCode(action.payload)
          .pipe(
            map(
              (locationList: LocationListingPayload) =>
                new LocationMasterActions.SearchLocationByLocationCodeSuccess(
                  locationList
                )
            )
          );
      },
      onError: (
        action: LocationMasterActions.SearchLocationByLocationCode,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.SearchLocationByLocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  copyLocationDetails$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.COPY_DETAILS,
    {
      run: (action: LocationMasterActions.CopyDetails) => {
        return this.locationService
          .copyLocationDetail(
            action.payload.oldLocationCode,
            action.payload.newLocationCode
          )
          .pipe(map(() => new LocationMasterActions.CopyDetailsSuccess()));
      },
      onError: (
        action: LocationMasterActions.CopyDetails,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.CopyDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationDetails$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_LOCATION_DETAILS,
    {
      run: (action: LocationMasterActions.LoadLocationDetails) => {
        return this.locationService
          .getLocationDetails(action.payload)
          .pipe(
            map(
              (locationMasterDetails: LocationMasterDetails) =>
                new LocationMasterActions.LoadLocationDetailsSuccess(
                  locationMasterDetails
                )
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadLocationDetails,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadLocationDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveLocationDetails$ = this.dataPersistence.pessimisticUpdate(
    LocationMasterActionTypes.SAVE_LOCATION_DETAILS,
    {
      run: (action: LocationMasterActions.SaveLocationDetails) => {
        return this.locationService
          .saveLocationDetails(action.payload)
          .pipe(
            map(
              (locationMasterDetails: LocationMasterDetails) =>
                new LocationMasterActions.SaveLocationDetailsSuccess(
                  locationMasterDetails
                )
            )
          );
      },
      onError: (
        action: LocationMasterActions.SaveLocationDetails,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.SaveLocationDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateLocationDetails$ = this.dataPersistence.pessimisticUpdate(
    LocationMasterActionTypes.UPDATE_LOCATION_DETAILS,
    {
      run: (action: LocationMasterActions.UpdateLocationDetails) => {
        return this.locationService
          .updateLocationDetails(action.payload)
          .pipe(
            map(
              (locationMasterDetails: LocationMasterDetails) =>
                new LocationMasterActions.UpdateLocationDetailsSuccess(
                  locationMasterDetails
                )
            )
          );
      },
      onError: (
        action: LocationMasterActions.UpdateLocationDetails,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.UpdateLocationDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationTypes$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_LOCATION_TYPES,
    {
      run: () => {
        return this.locationService
          .getLocationTypes()
          .pipe(
            map(
              (towns: any) =>
                new LocationMasterActions.LoadLocationTypesSuccess(towns)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadLocationTypes,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadLocationTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTowns$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_TOWNS,
    {
      run: (action: LocationMasterActions.LoadTowns) => {
        return this.locationService
          .getPersonalTownsData(action.payload)
          .pipe(
            map(
              (towns: any) => new LocationMasterActions.LoadTownsSuccess(towns)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadTowns,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadTownsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStates$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_STATES,
    {
      run: (action: LocationMasterActions.LoadStates) => {
        return this.locationService
          .getPersonalStatesData(action.payload)
          .pipe(
            map(
              (states: any) =>
                new LocationMasterActions.LoadStatesSuccess(states)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadStates,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadStatesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadOwnerInfo$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_OWNER_INFO,
    {
      run: () => {
        return this.locationService
          .getOwnerTypeList()
          .pipe(
            map(
              (ownerInfo: any) =>
                new LocationMasterActions.LoadOwnerInfoSuccess(ownerInfo)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadOwnerInfo,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadOwnerInfoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRegions$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_REGION,
    {
      run: () => {
        return this.locationService
          .getRegionSummary()
          .pipe(
            map(
              (region: LocationMasterDropdownList[]) =>
                new LocationMasterActions.LoadRegionSuccess(region)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadRegion,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadRegionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSubRegions$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_SUB_REGION_DETAILS,
    {
      run: (action: LocationMasterActions.LoadSubRegion) => {
        return this.regionDataService
          .getRegionSummary(false, action.payload)
          .pipe(
            map(
              (region: RegionSummary[]) =>
                new LocationMasterActions.LoadSubRegionSuccess(region)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadSubRegion,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadSubRegionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBrands$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_BRAND,
    {
      run: () => {
        return this.locationService
          .getBrandSummary()
          .pipe(
            map(
              (brands: LocationMasterDropdownList[]) =>
                new LocationMasterActions.LoadBrandSuccess(brands)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadBrand,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadBrandFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSubBrands$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_SUB_BRAND_DETAILS,
    {
      run: (action: LocationMasterActions.LoadSubBrand) => {
        return this.brandDataService
          .getBrandSummary(false, action.payload)
          .pipe(
            map(
              (brands: BrandSummary[]) =>
                new LocationMasterActions.LoadSubBrandSuccess(brands)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadSubBrand,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadSubBrandFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMarketCode$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_MARKET_CODE,
    {
      run: () => {
        return this.locationService
          .getMarketCodeData()
          .pipe(
            map(
              (marketCode: any) =>
                new LocationMasterActions.LoadMarketCodeSuccess(marketCode)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadMarketCode,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadMarketCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLocationSize$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_LOCATION_SIZE,
    {
      run: () => {
        return this.locationService
          .getLocationSize()
          .pipe(
            map(
              (marketCode: StateTypes[]) =>
                new LocationMasterActions.LoadLocationSizeSuccess(marketCode)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadLocationSize,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadLocationSizeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadInvoiceType$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_INVOICE_TYPE,
    {
      run: () => {
        return this.locationService
          .getInvoiceType()
          .pipe(
            map(
              (marketCode: StateTypes[]) =>
                new LocationMasterActions.LoadInvoiceTypeSuccess(marketCode)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadInvoiceType,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadInvoiceTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRefundMode$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_REFUND_MODE,
    {
      run: () => {
        return this.locationService
          .getRefundMode()
          .pipe(
            map(
              (marketCode: StateTypes[]) =>
                new LocationMasterActions.LoadRefundModeSuccess(marketCode)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadRefundMode,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadRefundModeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBaseCurrency$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_BASE_CURRENCY,
    {
      run: () => {
        return this.locationService
          .getBaseCurrencyData()
          .pipe(
            map(
              (baseCurrency: any) =>
                new LocationMasterActions.LoadBaseCurrencySuccess(baseCurrency)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadBaseCurrency,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadBaseCurrencyFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCurrency$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_CURRENCY,
    {
      run: () => {
        return this.locationService
          .getCurrencyDetails()
          .pipe(
            map(
              (currency: any) =>
                new LocationMasterActions.LoadCurrencySuccess(currency)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadCurrency,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadCurrencyFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCountryCode$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_COUNTRY_CODE,
    {
      run: () => {
        return this.locationService
          .getCountryCode()
          .pipe(
            map(
              (countryCode: { id: string; name: string }[]) =>
                new LocationMasterActions.LoadCountryCodeSuccess(countryCode)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadCountryCode,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadCountryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCFALists$ = this.dataPersistence.fetch(
    LocationMasterActionTypes.LOAD_CFA_LIST,
    {
      run: () => {
        return this.locationService
          .getLocationCFAList()
          .pipe(
            map(
              (list: LocationCFAType[]) =>
                new LocationMasterActions.LoadCFAListSuccess(list)
            )
          );
      },
      onError: (
        action: LocationMasterActions.LoadCFAList,
        error: HttpErrorResponse
      ) => {
        return new LocationMasterActions.LoadCFAListFailure(
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
