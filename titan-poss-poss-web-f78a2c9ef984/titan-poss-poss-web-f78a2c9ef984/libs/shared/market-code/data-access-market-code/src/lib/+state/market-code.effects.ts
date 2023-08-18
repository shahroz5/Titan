import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import * as MarketCodeActions from './market-code.actions';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@poss-web/shared/util-notification';
import { MarketCodeService } from '../market-code.service';
import {
  LoadMarketCodeListingSuccessPayload,
  MarketCodeDetails,
  CustomErrors,
  MarketMaterialFactors
} from '@poss-web/shared/models';
import { MarketCodeActionTypes } from './market-code.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class MarketCodeEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private notificationService: NotificationService,
    private marketCodeService: MarketCodeService
  ) {}
  @Effect()
  loadMarketCode$ = this.dataPersistence.fetch(
    MarketCodeActions.MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS,
    {
      run: (action: MarketCodeActions.LoadMarketCodeDetails) => {
        return this.marketCodeService
          .getMarketDetails(action.payload)
          .pipe(
            map(
              (marketCodeListing: LoadMarketCodeListingSuccessPayload) =>
                new MarketCodeActions.LoadMarketCodeDetailsSuccess(
                  marketCodeListing
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.LoadMarketCodeDetails,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.LoadMarketCodeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMarketCodeDetailsBasedOnMarketCode$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE,
    {
      run: (
        action: MarketCodeActions.LoadMarketCodeDetailsBasedOnMarketCode
      ) => {
        return this.marketCodeService
          .getMarketDetailsBasedOnMarketCode(action.payload)
          .pipe(
            map(
              (loadMarketCodeDetails: MarketCodeDetails) =>
                new MarketCodeActions.LoadMarketCodeDetailsBasedOnMarketCodeSuccess(
                  loadMarketCodeDetails
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.LoadMarketCodeDetailsBasedOnMarketCode,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.LoadMarketCodeDetailsBasedOnMarketCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchMarketCode$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.SEARCH_MARKET_CODE,
    {
      run: (action: MarketCodeActions.SearchMarketCode) => {
        return this.marketCodeService
          .getSearchResult(action.payload)
          .pipe(
            map(
              (loadMarketCodeDetails: MarketCodeDetails[]) =>
                new MarketCodeActions.SearchMarketCodeSuccess(
                  loadMarketCodeDetails
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.SearchMarketCode,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.SearchMarketCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveMarketCodeDetails$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS,
    {
      run: (action: MarketCodeActions.SaveMarketCodeDetails) => {
        return this.marketCodeService
          .saveMarketCodeDetails(action.payload)
          .pipe(
            map(
              (saveMarketCodeDetailsResponse: MarketCodeDetails) =>
                new MarketCodeActions.SaveMarketCodeDetailsSuccess(
                  saveMarketCodeDetailsResponse
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.SaveMarketCodeDetails,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.SaveMarketCodeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateMarketCodeDetails$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS,
    {
      run: (action: MarketCodeActions.UpdateMarketCodeDetails) => {
        return this.marketCodeService
          .updateMarketCodeDetails(action.payload)
          .pipe(
            map(
              (updateMarketCodeDetailsResponse: MarketCodeDetails) =>
                new MarketCodeActions.UpdateMarketCodeDetailsSuccess(
                  updateMarketCodeDetailsResponse
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.UpdateMarketCodeDetails,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.UpdateMarketCodeDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveMarketMaterialFactors$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS,
    {
      run: (action: MarketCodeActions.SaveMarketMaterialFactors) => {
        return this.marketCodeService
          .saveMarketMaterialFacators(action.payload)
          .pipe(
            map(
              (saveMarketMaterialFacatorsResponse: MarketMaterialFactors) =>
                new MarketCodeActions.SaveMarketMaterialFacatorsSuccess(
                  saveMarketMaterialFacatorsResponse
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.SaveMarketMaterialFactors,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.SaveMarketMaterialFacatorsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateMarketMaterialFactors$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS,
    {
      run: (action: MarketCodeActions.UpdateMarketMaterialFactors) => {
        return this.marketCodeService
          .updateMarketMaterialFacators(action.payload)
          .pipe(
            map(
              (updateMarketMaterialFacatorsResponse: MarketMaterialFactors) =>
                new MarketCodeActions.UpdateMarketMaterialFactorsSuccess(
                  updateMarketMaterialFacatorsResponse
                )
            )
          );
      },
      onError: (
        action: MarketCodeActions.UpdateMarketMaterialFactors,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.UpdateMarketMaterialFactorsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateToggleButton$ = this.dataPersistence.fetch(
    MarketCodeActionTypes.UPDATE_TOGGLE_BUTTON,
    {
      run: (action: MarketCodeActions.UpdateToggleButton) => {
        return this.marketCodeService
          .updateMarketCodeDetails(action.payload)
          .pipe(map(() => new MarketCodeActions.UpdateToggleButtonSuccess()));
      },
      onError: (
        action: MarketCodeActions.UpdateToggleButton,
        error: HttpErrorResponse
      ) => {
        return new MarketCodeActions.UpdateToggleButtonFailure(
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
