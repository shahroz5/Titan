import { Injectable } from '@angular/core';
import { EncircleProductGroupMappingService } from '../encircle-product-group-mapping.service';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Effect } from '@ngrx/effects';
import { EncircleProductGroupMappingActionTypes } from './encircle-product-group-mapping.actions';
import * as EncircleProductGroupMappingActions from './encircle-product-group-mapping.actions';
import { map } from 'rxjs/operators';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  ProductGroup,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class EncircleProductGroupMappingEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private encircleProductGroupMappingService: EncircleProductGroupMappingService,
    private productGroupDataService: ProductGroupDataService
  ) {}

  @Effect() saveEncircleProductGroups$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.SAVE_ENCIRCLE_PRODUCT_GROUPS,
    {
      run: (
        action: EncircleProductGroupMappingActions.SaveEncircleProdcutGroups
      ) => {
        return this.encircleProductGroupMappingService
          .saveEncircleProductGroups(action.payload)
          .pipe(
            map(
              () =>
                new EncircleProductGroupMappingActions.SaveEncircleProdcutGroupsSuccess()
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.SaveEncircleProdcutGroups,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.SaveEncircleProdcutGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() removeEncircleProductGroups$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.REMOVE_ENCIRCLE_PRODUCT_GROUPS,
    {
      run: (
        action: EncircleProductGroupMappingActions.RemoveEncircleProdcutGroups
      ) => {
        return this.encircleProductGroupMappingService
          .saveEncircleProductGroups(action.payload)
          .pipe(
            map(
              () =>
                new EncircleProductGroupMappingActions.RemoveEncircleProdcutGroupsSuccess()
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.RemoveEncircleProdcutGroups,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.RemoveEncircleProdcutGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadSelectedProductGroups$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.LOAD_SELECTED_PRODUCT_GROUPS,
    {
      run: (
        action: EncircleProductGroupMappingActions.LoadSelectedProductGroups
      ) => {
        return this.encircleProductGroupMappingService
          .loadSelectedProductGroups(
            action.payload.paymentMode,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description,
          )
          .pipe(
            map(
              (payload: ProductGroupMappingResponse) =>
                new EncircleProductGroupMappingActions.LoadSelectedProductGroupsSuccess(
                  payload
                )
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.LoadSelectedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.LoadSelectedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchProductGroup$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.SEARCH_PRODUCT_GROUP_CODE,
    {
      run: (
        action: EncircleProductGroupMappingActions.SearchProductGroupCode
      ) => {
        return this.encircleProductGroupMappingService
          .searchProductGroupCode(action.payload)
          .pipe(
            map(
              (data: ProductGroupMappingResponse) =>
                new EncircleProductGroupMappingActions.SearchProductGroupCodeSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.SearchProductGroupCode,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.SearchProductGroupCodeSuccess(
          { response: [], totalElements: 0 }
        );
      }
    }
  );

  @Effect() loadAllSelectedProductGroups$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.LOAD_ALL_SELECTED_PRODUCT_GROUPS,
    {
      run: (
        action: EncircleProductGroupMappingActions.LoadAllSelectedProductGroups
      ) => {
        return this.encircleProductGroupMappingService
          .loadSelectedProductGroups(
            action.payload.paymentMode,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (payload: ProductGroupMappingResponse) =>
                new EncircleProductGroupMappingActions.LoadAllSelectedProductGroupsSuccess(
                  payload
                )
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.LoadAllSelectedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.LoadAllSelectedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    EncircleProductGroupMappingActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new EncircleProductGroupMappingActions.LoadProductGroupsSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: EncircleProductGroupMappingActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new EncircleProductGroupMappingActions.LoadProductGroupsFailure(
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
