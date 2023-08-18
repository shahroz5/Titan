import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import * as CFAProductCodeActions from './cfa-product-code.actions';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CfaProductCodeService } from '../cfa-product-code.service';
import { CFAProductCodeActionTypes } from './cfa-product-code.actions';
import {
  LoadCFAProductCodeListingSuccessPayload,
  CFAProducts,
  ProductType,
  CustomErrors,
  CFAProductsResponse,
  ItemTypesResponse,
  Lov,
  ProductGroupDetails
} from '@poss-web/shared/models';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class CFAProductCodeEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private CFAProductCodeService: CfaProductCodeService,
    private lovDataService: LovDataService
  ) {}
  @Effect()
  loadCFAProduct$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS,
    {
      run: (action: CFAProductCodeActions.LoadCFAProducts) => {
        return this.CFAProductCodeService.getCFAProducts(action.payload).pipe(
          map(
            (
              loadCFAProductCodeListing: LoadCFAProductCodeListingSuccessPayload
            ) =>
              new CFAProductCodeActions.LoadCFAProductsSuccess(
                loadCFAProductCodeListing
              )
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.LoadCFAProducts,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadCFAProductsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCFAProductsBasedOnProductGroupCode$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE,
    {
      run: (
        action: CFAProductCodeActions.LoadCFAProductsBasedOnProductGroupCode
      ) => {
        return this.CFAProductCodeService.getCFAProductsBasedProductGroupCode(
          action.payload
        ).pipe(
          map(
            (productGroupDetails: ProductGroupDetails) =>
              new CFAProductCodeActions.LoadCFAProductsBasedOnProductGroupCodeSuccess(
                productGroupDetails
              )
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.LoadCFAProductsBasedOnProductGroupCode,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadCFAProductsBasedOnProductGroupCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchCFAProduct$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT,
    {
      run: (action: CFAProductCodeActions.SearchCFAproduct) => {
        return this.CFAProductCodeService.getCFASearchResult(
          action.payload
        ).pipe(
          map(
            (SearchResult: CFAProductsResponse[]) =>
              new CFAProductCodeActions.SearchCFAProductSuccess(SearchResult)
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.SearchCFAproduct,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.SearchCFAProductFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveCFAProducts$ = this.dataPersistence.pessimisticUpdate(
    CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS,
    {
      run: (action: CFAProductCodeActions.SaveCFAProducts) => {
        return this.CFAProductCodeService.saveCFAProducts(action.payload).pipe(
          map(
            (saveCFAProductCodeResponse: CFAProducts) =>
              new CFAProductCodeActions.SaveCFAProductsSuccess()
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.SaveCFAProducts,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.SaveCFAProductsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateCFAProducts$ = this.dataPersistence.pessimisticUpdate(
    CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS,
    {
      run: (action: CFAProductCodeActions.UpdateCFAProducts) => {
        return this.CFAProductCodeService.updateCFAProducts(
          action.payload
        ).pipe(
          map(
            (updateSuccessPayload: CFAProducts) =>
              new CFAProductCodeActions.UpdateCFAProductsSuccess(
                updateSuccessPayload
              )
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.UpdateCFAProducts,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.UpdateCFAProductsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadProductTypes$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES,
    {
      run: (action: CFAProductCodeActions.LoadProductTypes) => {
        return this.lovDataService
          .getProductLovs('PRODUCTTYPE')
          .pipe(
            map(
              (productType: Lov[]) =>
                new CFAProductCodeActions.LoadProductTypesSuccess(
                  this.getProductTypes(productType)
                )
            )
          );
      },
      onError: (
        action: CFAProductCodeActions.LoadProductTypes,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadProductTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadItemTypes$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_ITEM_TYPES,
    {
      run: (action: CFAProductCodeActions.LoadItemTypes) => {
        return this.CFAProductCodeService.loadItemTypes().pipe(
          map(
            (materialType: ItemTypesResponse[]) =>
              new CFAProductCodeActions.LoadItemTypesSuccess(materialType)
          )
        );
      },
      onError: (
        action: CFAProductCodeActions.LoadItemTypes,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadItemTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPlainStuddedTypes$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE,
    {
      run: (action: CFAProductCodeActions.LoadPlainStuddedType) => {
        return this.lovDataService
          .getProductLovs(action.payload)
          .pipe(
            map(
              (plainStuddedTypes: Lov[]) =>
                new CFAProductCodeActions.LoadPlainStuddedTypeSuccess(
                  this.getPlainStuddedTypes(plainStuddedTypes)
                )
            )
          );
      },
      onError: (
        action: CFAProductCodeActions.LoadPlainStuddedType,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadPlainStuddedTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadhallmarkingExcludeKaratTypes$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE,
    {
      run: (action: CFAProductCodeActions.LoadhallmarkingExcludeKaratType) => {
        return this.lovDataService
          .getProductLovs(action.payload)
          .pipe(
            map(
              (hallmarkingExcludeKaratTypes: Lov[]) =>
                new CFAProductCodeActions.LoadhallmarkingExcludeKaratTypeSuccess(
                  this.getPlainStuddedTypes(hallmarkingExcludeKaratTypes)
                )
            )
          );
      },
      onError: (
        action: CFAProductCodeActions.LoadhallmarkingExcludeKaratType,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadhallmarkingExcludeKaratTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPricingType$ = this.dataPersistence.fetch(
    CFAProductCodeActionTypes.LOAD_PRICING_TYPE,
    {
      run: (action: CFAProductCodeActions.LoadPricingType) => {
        return this.lovDataService
          .getProductLovs(action.payload)
          .pipe(
            map(
              (pricingTypes: Lov[]) =>
                new CFAProductCodeActions.LoadPricingTypeSuccess(
                  this.getPlainStuddedTypes(pricingTypes)
                )
            )
          );
      },
      onError: (
        action: CFAProductCodeActions.LoadPricingType,
        error: HttpErrorResponse
      ) => {
        return new CFAProductCodeActions.LoadPricingTypeFailure(
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
  getPlainStuddedTypes(plainStudded: Lov[]) {
    const lovData: { id: string; name: string }[] = [];
    for (const products of plainStudded) {
      lovData.push({
        id: products.code,
        name: products.value
      });
    }
    return lovData;
  }

  getProductTypes(data: any): any {
    const productTypes: ProductType[] = [];
    console.log('data', data);
    for (const productType of data) {
      productTypes.push({
        id: productType.code,
        name: productType.value,
        isActive: productType.isActive
      });
    }
    return productTypes;
  }
}
