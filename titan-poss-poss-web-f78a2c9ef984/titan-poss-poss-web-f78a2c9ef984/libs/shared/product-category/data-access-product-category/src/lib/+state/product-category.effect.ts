import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as ProductCategoryActions from './product-category.actions';
import { ProductCategoryService } from '../product-category.service';
import {
  LoadProductCategoryListingSuccessPayload,
  ProductCategoryDetails,
  CustomErrors
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class ProductCategoryEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private productCategoryService: ProductCategoryService
  ) {}

  @Effect()
  loadProductCategoryDetails$ = this.dataPersistence.fetch(
    ProductCategoryActions.ProductCategoryActionTypes
      .LOAD_PRODUCT_CATEGORY_DETAILS,
    {
      run: (action: ProductCategoryActions.LoadProductCategoryDetails) => {
        return this.productCategoryService
          .getProductCategoryDetails(action.payload)
          .pipe(
            map(
              (
                productCategoryDetails: LoadProductCategoryListingSuccessPayload
              ) =>
                new ProductCategoryActions.LoadProductCategoryDetailsSuccess(
                  productCategoryDetails
                )
            )
          );
      },
      onError: (
        action: ProductCategoryActions.LoadProductCategoryDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductCategoryActions.LoadProductCategoryDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductCategoryDetailsByProductCategoryCode$ = this.dataPersistence.fetch(
    ProductCategoryActions.ProductCategoryActionTypes
      .LOAD_PRODUCT_CATEGORY_DETAILS_BY_PRODUCT_CATEGORYCODE,
    {
      run: (
        action: ProductCategoryActions.LoadProductCategoryByProductCategoryCode
      ) => {
        return this.productCategoryService
          .getProductCategoryByProductCategoryCode(action.payload)
          .pipe(
            map(
              (
                ProductCategoryDetailsByProductCategoryCode: ProductCategoryDetails
              ) =>
                new ProductCategoryActions.LoadProductCategoryByProductCategoryCodeSuccess(
                  ProductCategoryDetailsByProductCategoryCode
                )
            )
          );
      },
      onError: (
        action: ProductCategoryActions.LoadProductCategoryByProductCategoryCode,
        error: HttpErrorResponse
      ) => {
        return new ProductCategoryActions.LoadProductCategoryByProductCategoryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveProductCategoryFormDetails$ = this.dataPersistence.pessimisticUpdate(
    ProductCategoryActions.ProductCategoryActionTypes
      .SAVE_PRODUCT_CATEGORY_FORM_DETAILS,
    {
      run: (action: ProductCategoryActions.SaveProductCategoryFormDetails) => {
        return this.productCategoryService
          .saveProductCategoryFormDetails(action.payload)
          .pipe(
            map((saveData: ProductCategoryDetails) => {
              return new ProductCategoryActions.SaveProductCategoryFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: ProductCategoryActions.SaveProductCategoryFormDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductCategoryActions.SaveProductCategoryFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editProductCategoryFormDetails$ = this.dataPersistence.pessimisticUpdate(
    ProductCategoryActions.ProductCategoryActionTypes
      .EDIT_PRODUCT_CATEGORY_FORM_DETAILS,
    {
      run: (action: ProductCategoryActions.EditProductCategoryFormDetails) => {
        return this.productCategoryService
          .editProductCategoryFormDetails(action.payload)
          .pipe(
            map((saveData: ProductCategoryDetails) => {
              return new ProductCategoryActions.EditProductCategoryFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: ProductCategoryActions.EditProductCategoryFormDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductCategoryActions.EditProductCategoryFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchProductCategoryFormDetails$ = this.dataPersistence.fetch(
    ProductCategoryActions.ProductCategoryActionTypes
      .SEARCH_PRODUCT_CATEGORY_DETAILS,
    {
      run: (action: ProductCategoryActions.SearchProductCategoryCode) => {
        return this.productCategoryService
          .getProductCategorySearchResult(action.payload)
          .pipe(
            map(
              (SearchResult: ProductCategoryDetails[]) =>
                new ProductCategoryActions.SearchProductCategoryCodeSuccess(
                  SearchResult
                )
            )
          );
      },
      onError: (
        action: ProductCategoryActions.SearchProductCategoryCode,
        error: HttpErrorResponse
      ) => {
        return new ProductCategoryActions.SearchProductCategoryCodeFailure(
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
