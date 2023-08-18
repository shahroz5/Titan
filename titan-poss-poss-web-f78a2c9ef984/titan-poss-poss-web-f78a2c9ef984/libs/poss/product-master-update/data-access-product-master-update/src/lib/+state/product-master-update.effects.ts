import { Injectable } from '@angular/core';
import { LoggerService } from '@poss-web/shared/util-logger';
import { DataPersistence } from '@nrwl/angular';
import { ProductMasterUpdateService } from '../product-master-update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrors } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Observable } from 'rxjs';
import * as ProductMasterActions from './product-master-update.actions';
import { ProductMasterUpdateActionTypes } from './product-master-update.actions';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

@Injectable()
export class ProductMasterUpdateEffects {
  constructor(
    private dataPersistence: DataPersistence<ProductMasterUpdateEffects>,
    private loggerService: LoggerService,
    private productMasterUpdateService: ProductMasterUpdateService
  ) {}

  @Effect() loadProductMasterUpdate$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProductMasterUpdateActionTypes.LOAD_PRODUCT_MASTER_UPDATE,
    {
      run: (action: ProductMasterActions.LoadProductMasterUpdate) => {
        return this.productMasterUpdateService
          .loadProductMasterUpdate(action.itemCode, action.lotNumber)
          .pipe(
            map((data: any) => {
              return new ProductMasterActions.LoadProductMasterUpdateSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: ProductMasterActions.LoadProductMasterUpdate,
        error: HttpErrorResponse
      ) => {
        return new ProductMasterActions.LoadProductMasterUpdateFailure(
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
