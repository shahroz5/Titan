import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { CutPieceConfigActionTypes } from './cut-piece-config.actions';
import * as CutPieceConfigActions from './cut-piece-config.actions';
import { CutPieceConfigService } from '../cut-piece-config.service';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  ProductCategory,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductCategoryDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CutPieceConfigEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cutPieceConfigService: CutPieceConfigService,
    private productCategoryDataService: ProductCategoryDataService
  ) {}

  @Effect()
  loadCutPieceConfigs$: Observable<Action> = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.LOAD_CUT_PIECE_CONFIGS,
    {
      run: (action: CutPieceConfigActions.LoadCutPieceConfigs) => {
        return this.cutPieceConfigService
          .loadCutPieceConfig()
          .pipe(
            map(
              (configId: string) =>
                new CutPieceConfigActions.LoadCutPieceConfigsSuccess(configId)
            )
          );
      },
      onError: (
        action: CutPieceConfigActions.LoadCutPieceConfigs,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.LoadCutPieceConfigsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchProductCategoryCode$: Observable<Action> = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.SEARCH_PRODUCT_CATEGORY_CODE,
    {
      run: (action: CutPieceConfigActions.SearchProductCategoryCode) => {
        return this.cutPieceConfigService
          .searchProductCategoryCode(action.payload)
          .pipe(
            map(
              (searchResponse: ProductCategoryMappingList[]) =>
                new CutPieceConfigActions.SearchProductCategroyCodeSuccess(
                  searchResponse
                )
            )
          );
      },
      onError: (
        action: CutPieceConfigActions.SearchProductCategoryCode,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.SearchProductCategoryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCutPieceConfig$: Observable<Action> = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.SAVE_CUT_PIECE_CONFIG,
    {
      run: (action: CutPieceConfigActions.SaveCutPieceConfig) => {
        return this.cutPieceConfigService
          .saveCutPieceConfig(action.payload)
          .pipe(
            map(() => new CutPieceConfigActions.SaveCutPieceConfigSuccess())
          );
      },
      onError: (
        action: CutPieceConfigActions.SaveCutPieceConfig,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.SaveCutPieceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductCategoriesMapping$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES_MAPPING,
    {
      run: (action: CutPieceConfigActions.LoadProductCategoryMapping) => {
        return this.cutPieceConfigService
          .loadProductCategoryMapping(action.payload)
          .pipe(
            map(
              (response: {
                response: ProductCategoryMappingList[];
                totalElements: number;
              }) =>
                new CutPieceConfigActions.LoadProductCategoryMappingSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CutPieceConfigActions.LoadProductCategoryMapping,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.LoadProductCategoryMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProductCategories$: Observable<Action> = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: CutPieceConfigActions.LoadProductCategories) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, null)
          .pipe(
            map(
              (productCategories: ProductCategory[]) =>
                new CutPieceConfigActions.LoadProductCategoriesSuccess(
                  productCategories
                )
            )
          );
      },
      onError: (
        action: CutPieceConfigActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedPcs$: Observable<Action> = this.dataPersistence.fetch(
    CutPieceConfigActionTypes.LOAD_SELECTED_PRODUCT_CATEGORIES,
    {
      run: (action: CutPieceConfigActions.LoadSelectedPcs) => {
        return this.cutPieceConfigService
          .loadProductCategoryMapping(action.payload)
          .pipe(
            map(
              (data: {
                response: ProductCategoryMappingList[];
                totalElements: number;
              }) =>
                new CutPieceConfigActions.LoadSelectedPcsSuccess(data.response)
            )
          );
      },
      onError: (
        action: CutPieceConfigActions.LoadSelectedPcs,
        error: HttpErrorResponse
      ) => {
        return new CutPieceConfigActions.LoadSelectedPcsFailure(
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
