import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MarketMaterialPriceActionTypes } from './market-material-price.actions';
import * as MarketMaterialPriceActions from './market-material-price.actions';

import { NotificationService } from '@poss-web/shared/util-notification';
import { MaterialPriceService } from '../material-price.service';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  MaterialPriceList,
  MarketListing,
  LocationDetailsList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class MarketMaterialPriceEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private notificationService: NotificationService,
    private metalTypePriceService: MaterialPriceService
  ) {}

  @Effect()
  searchMarketCode$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.SEARCH_MARKET_CODE,
    {
      run: (action: MarketMaterialPriceActions.SearchMarketCode) => {
        return this.metalTypePriceService
          .getSearchResult(action.payload)
          .pipe(
            map(
              (marketDetails: MarketListing) =>
                new MarketMaterialPriceActions.SearchMarketCodeSuccess(
                  marketDetails
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.SearchMarketCode,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.SearchMarketCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSavedBasePrice$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.LOAD_SAVED_BASE_PRICE,
    {
      run: (action: MarketMaterialPriceActions.LoadSavedPrice) => {
        return this.metalTypePriceService
          .loadSavedBasePrice(action.payload)
          .pipe(
            map(
              (locationDetailsList: LocationDetailsList) =>
                new MarketMaterialPriceActions.LoadSavedPriceSuccess(
                  locationDetailsList
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.LoadSavedPrice,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.LoadSavedPriceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  savePrice$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.SAVE_PRICE,
    {
      run: (action: MarketMaterialPriceActions.SavePrice) => {
        return this.metalTypePriceService
          .savePrice(action.payload)
          .pipe(map(() => new MarketMaterialPriceActions.SavePriceSuccess()));
      },
      onError: (
        action: MarketMaterialPriceActions.SavePrice,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.SavePriceFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMarketDetailsBasedOnMaterial$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.LOAD_MARKET_DETAILS_BASED_ON_MATERIAL,
    {
      run: (
        action: MarketMaterialPriceActions.LoadMarketDetailsBasedOnMaterial
      ) => {
        return this.metalTypePriceService
          .getMarketDetailsBasedOnMaterial(action.payload)
          .pipe(
            map(
              (marketDetails: MarketListing) =>
                new MarketMaterialPriceActions.LoadMarketDetailsBasedOnMaterialSuccess(
                  marketDetails
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.LoadMarketDetailsBasedOnMaterial,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.LoadMarketDetailsBasedOnMaterialFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMetalPriceDetails$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.LOAD_METAL_PRICE_DETAILS,
    {
      run: (action: MarketMaterialPriceActions.LoadMetalPriceDetails) => {
        return this.metalTypePriceService
          .getMaterialPriceDetails(action.payload)
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new MarketMaterialPriceActions.LoadMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.LoadMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.LoadMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  viewComputedLocationPriceDetails$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.VIEW_LOCATION_PRICE,
    {
      run: (action: MarketMaterialPriceActions.ViewLocationPrice) => {
        return this.metalTypePriceService
          .getComputedLocationPrice(action.payload)
          .pipe(
            map(
              (locationDetailsList: LocationDetailsList) =>
                new MarketMaterialPriceActions.ViewLocationPriceSuccess(
                  locationDetailsList
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.ViewLocationPrice,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.ViewLocationPriceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchComputedPriceByLocationCode$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.SEARCH_COMPUTED_PRICE_BY_LOCATION_CODE,
    {
      run: (
        action: MarketMaterialPriceActions.SearchComputedPriceByLocationCode
      ) => {
        return this.metalTypePriceService
          .searchComputedPriceByLocationCode(
            action.payload.locationCode,
            action.payload.materialCode,
            action.payload.data
          )
          .pipe(
            map(
              (locationDetailsList: LocationDetailsList) =>
                new MarketMaterialPriceActions.SearchComputedPriceByLocationCodeSuccess(
                  locationDetailsList
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.SearchComputedPriceByLocationCode,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.SearchComputedPriceByLocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  SearchSavedLocationPriceByLocationCode$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.SEARCH_SAVED_LOCATION_PRICE_BY_LOCATION_CODE,
    {
      run: (
        action: MarketMaterialPriceActions.SearchSavedLocationPriceByLocationCode
      ) => {
        return this.metalTypePriceService
          .searchSavedLocationPriceByLocationCode(
            action.payload.id,
            action.payload.locationCode,
            action.payload.materialCode
          )
          .pipe(
            map(
              (locationDetailsList: LocationDetailsList) =>
                new MarketMaterialPriceActions.SearchSavedLocationPriceByLocationCodeSuccess(
                  locationDetailsList
                )
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.SearchSavedLocationPriceByLocationCode,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.SearchSavedLocationPriceByLocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIsValueResetToZero$ = this.dataPersistence.fetch(
    MarketMaterialPriceActionTypes.LOAD_IS_VALUE_RESET_To_ZERO,
    {
      run: (action: MarketMaterialPriceActions.LoadIsValueResetToZero) => {
        return this.metalTypePriceService
          .resetAmountToZero()
          .pipe(
            map(
              () =>
                new MarketMaterialPriceActions.LoadIsValueResetToZeroSuccess()
            )
          );
      },
      onError: (
        action: MarketMaterialPriceActions.LoadIsValueResetToZero,
        error: HttpErrorResponse
      ) => {
        return new MarketMaterialPriceActions.LoadIsValueResetToZeroFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.notificationService.error(customError);
    return customError;
  }
}
