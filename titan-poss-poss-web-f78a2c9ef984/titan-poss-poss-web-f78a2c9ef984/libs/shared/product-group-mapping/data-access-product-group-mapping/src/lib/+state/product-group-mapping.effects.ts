import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductGroupMappingActionTypes } from './product-group-mapping.actions';
import * as ProductGroupActions from './product-group-mapping.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrors, ProductGroup } from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

@Injectable()
export class ProductGroupMappingEffects {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public productGroupDataService: ProductGroupDataService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadProductGroups$ = this.dataPersistence.fetch(
    ProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: ProductGroupActions.LoadProductGroupMapping) => {
        return this.productGroupDataService
          .getProductGroups(
            false,
            undefined,
            undefined,
            ['productGroupCode'],
            action.payload
          )
          .pipe(
            map(
              (productGroup: ProductGroup[]) =>
                new ProductGroupActions.LoadProductGroupMappingSuccess(
                  productGroup
                )
            )
          );
      },
      onError: (
        action: ProductGroupActions.LoadProductGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new ProductGroupActions.LoadProductGroupMappingFailure(
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
