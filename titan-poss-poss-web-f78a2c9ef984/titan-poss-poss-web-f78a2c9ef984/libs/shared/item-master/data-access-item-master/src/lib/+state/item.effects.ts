import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  ItemStones,
  ProductGroup,
  Lov,
  LoadItemListingSuccessPayload,
  ItemDetails
} from '@poss-web/shared/models';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import * as ItemActions from './item.actions';
import { ItemListingService } from '../item.service';
import {
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class ItemEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private itemListingService: ItemListingService,
    private lovService: LovDataService,
    private produtGroupService: ProductGroupDataService
  ) {}

  @Effect()
  loadItemDetailsByItemCode$ = this.dataPersistence.fetch(
    ItemActions.ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE,
    {
      run: (action: ItemActions.LoadItemByItemCode) => {
        return this.itemListingService
          .getItemByItemCode(action.payload)
          .pipe(
            map(
              (ItemDetailsByItemCode: ItemDetails) =>
                new ItemActions.LoadItemByItemCodeSuccess(ItemDetailsByItemCode)
            )
          );
      },
      onError: (
        action: ItemActions.LoadItemByItemCode,
        error: HttpErrorResponse
      ) => {
        return new ItemActions.LoadItemByItemCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // @Effect()
  // searchItem$ = this.dataPersistence.fetch(
  //   ItemActions.ItemActionTypes.SEARCH_ITEM,
  //   {
  //     run: (action: ItemActions.SearchItem) => {
  //       return this.itemListingService
  //         .getItemSearchResult(action.payload)
  //         .pipe(
  //           map(
  //             (SearchResult: ListingPageData[]) =>
  //               new ItemActions.SearchItemSuccess(SearchResult)
  //           )
  //         );
  //     },
  //     onError: (action: ItemActions.SearchItem, error: HttpErrorResponse) => {
  //       return new ItemActions.SearchItemFailure(this.errorHandler(error));
  //     }
  //   }
  // );

  @Effect()
  itemStones$ = this.dataPersistence.fetch(
    ItemActions.ItemActionTypes.LOAD_STONES,
    {
      run: (action: ItemActions.LoadStones) => {
        return this.itemListingService
          .getItemStones(action.payload)
          .pipe(
            map(
              (itemStones: ItemStones[]) =>
                new ItemActions.LoadStonesSuccess(itemStones)
            )
          );
      },
      onError: (action: ItemActions.LoadStones, error: HttpErrorResponse) => {
        return new ItemActions.LoadStonesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadFilterItemDetails$ = this.dataPersistence.fetch(
    ItemActions.ItemActionTypes.LOAD_ITEM_FILTER,
    {
      run: (action: ItemActions.LoadFilterItemDetails) => {
        return this.itemListingService
          .getFilterItemDetails(action.payload)
          .pipe(
            map(
              (itemDetails: LoadItemListingSuccessPayload) =>
                new ItemActions.LoadFilterItemDetailsSuccess(itemDetails)
            )
          );
      },
      onError: (
        action: ItemActions.LoadFilterItemDetails,
        error: HttpErrorResponse
      ) => {
        return new ItemActions.LoadFilterItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadPricingTypes$ = this.dataPersistence.fetch(
    ItemActions.ItemActionTypes.LOAD_PRICING_TYPES,
    {
      run: (action: ItemActions.LoadPricingType) => {
        return this.lovService
          .getEngineProductLovs(action.payload)
          .pipe(
            map(
              (pricingType: Lov[]) =>
                new ItemActions.LoadPricingTypeSuccess(pricingType)
            )
          );
      },
      onError: (
        action: ItemActions.LoadPricingType,
        error: HttpErrorResponse
      ) => {
        return new ItemActions.LoadPricingTypeFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  cfaProductCodeDetails$ = this.dataPersistence.fetch(
    ItemActions.ItemActionTypes.LOAD_CFAPRODUCT_CODE,
    {
      run: (action: ItemActions.LoadCFAProductCode) => {
        return this.produtGroupService
          .getProductGroups()
          .pipe(
            map(
              (cfaProductCodes: ProductGroup[]) =>
                new ItemActions.LoadCFAProductCodeSuccess(cfaProductCodes)
            )
          );
      },
      onError: (
        action: ItemActions.LoadCFAProductCode,
        error: HttpErrorResponse
      ) => {
        return new ItemActions.LoadCFAProductCodeFailure(
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
