import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductCategoryMappingActionTypes } from './pc-mapping.actions';
import * as ProductGroupActions from './pc-mapping.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductCategoryDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrors, ProductCategory } from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

@Injectable()
export class ProductCategoryMappingEffects {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public productCategoryDataService: ProductCategoryDataService,

    public loggerService: LoggerService
  ) {}

  @Effect()
  loadProductGroups$ = this.dataPersistence.fetch(
    ProductCategoryMappingActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: ProductGroupActions.LoadProductCategory) => {
        return this.productCategoryDataService
          .getProductCategories(false, undefined, undefined, [
            'productCategoryCode'
          ])
          .pipe(
            map(
              (productCategory: ProductCategory[]) =>
                new ProductGroupActions.LoadProductCategorySuccess(
                  productCategory
                )
            )
          );
      },
      onError: (
        action: ProductGroupActions.LoadProductCategory,
        error: HttpErrorResponse
      ) => {
        return new ProductGroupActions.LoadProductCategoryFailure(
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
