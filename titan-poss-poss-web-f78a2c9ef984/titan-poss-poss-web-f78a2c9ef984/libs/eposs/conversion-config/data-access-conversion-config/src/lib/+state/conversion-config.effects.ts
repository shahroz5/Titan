import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ConversionConfigActionTypes } from './conversion-config.actions';
import { Effect } from '@ngrx/effects';
import { ConversionConfigService } from '../conversion-config.service';
import { map } from 'rxjs/operators';
import {
  ConversionConfigList,
  CustomErrors,
  ConversionConfigByIdPayload,
  CheckBoxHeader,
  ProductGroup,
  ProductCategory
} from '@poss-web/shared/models';
import * as ConversionConfigActions from './conversion-config.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class ConversionConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private conversionConfigService: ConversionConfigService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService
  ) {}
  @Effect()
  ConversionConfigList$: Observable<Action> = this.dataPersistence.fetch(
    ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST,
    {
      run: (action: ConversionConfigActions.LoadConversionConfigList) => {
        return this.conversionConfigService
          .getConversionConfiguratonList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (conversionconfiglist: ConversionConfigList) =>
                new ConversionConfigActions.LoadConversionConfigListSuccess(
                  conversionconfiglist
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.LoadConversionConfigList,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.LoadConversionConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateConversionConfigDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS,
    {
      run: (action: ConversionConfigActions.UpdateConversionConfigDetails) => {
        return this.conversionConfigService
          .updateConversionConfigDetails(action.payload)
          .pipe(
            map(
              () =>
                new ConversionConfigActions.UpdateConversionConfigDetailsSuccess()
            )
          );
      },
      onError: (
        action: ConversionConfigActions.UpdateConversionConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.UpdateConversionConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getConversionConfigDetailsById$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID,
    {
      run: (action: ConversionConfigActions.ConversionConfigDetailsById) => {
        return this.conversionConfigService
          .getConversionConfigDetaildById(action.payload)
          .pipe(
            map(
              (conversionconfigDetailsById: ConversionConfigByIdPayload) =>
                new ConversionConfigActions.ConversionConfigDetailsByIdSuccess(
                  conversionconfigDetailsById
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.ConversionConfigDetailsById,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.ConversionConfigDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getProductGroups$: Observable<Action> = this.dataPersistence.fetch(
    ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: ConversionConfigActions.LoadProductGroups) => {
        return this.conversionConfigService
          .loadProductGroups()
          .pipe(
            map(
              (productGroups: CheckBoxHeader[]) =>
                new ConversionConfigActions.LoadProductGroupsSuccess(
                  productGroups
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getProductCategories$: Observable<Action> = this.dataPersistence.fetch(
    ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: ConversionConfigActions.LoadProductCategories) => {
        return this.conversionConfigService
          .loadProductCategories()
          .pipe(
            map(
              (productcategories: CheckBoxHeader[]) =>
                new ConversionConfigActions.LoadProductCategoriesSuccess(
                  productcategories
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    ConversionConfigActionTypes.SEARCH_CONFIG_NAME,
    {
      run: (action: ConversionConfigActions.SearchConfigName) => {
        return this.conversionConfigService
          .search(action.payload)
          .pipe(
            map(
              (searchResult: ConversionConfigList) =>
                new ConversionConfigActions.SearchConfigNameSuccess(
                  searchResult
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.SearchConfigName,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.SearchConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  saveConversionConfigValues$: Observable<Action> = this.dataPersistence.fetch(
    ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES,
    {
      run: (action: ConversionConfigActions.SaveConversionConfigValues) => {
        return this.conversionConfigService
          .saveConversionConfigValues(action.payload)
          .pipe(
            map(
              (successPayload: ConversionConfigByIdPayload) =>
                new ConversionConfigActions.SaveConversionConfigValuesSuccess(
                  successPayload
                )
            )
          );
      },
      onError: (
        action: ConversionConfigActions.SaveConversionConfigValues,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.SaveConversionConfigValuesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateToggleButton$ = this.dataPersistence.fetch(
    ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON,
    {
      run: (action: ConversionConfigActions.UpdateToggleButton) => {
        return this.conversionConfigService
          .updateToggleButton(action.payload)
          .pipe(
            map(() => new ConversionConfigActions.UpdateToggleButtonSuccess())
          );
      },
      onError: (
        action: ConversionConfigActions.UpdateToggleButton,
        error: HttpErrorResponse
      ) => {
        return new ConversionConfigActions.UpdateToggleButtonFailure(
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
  productGroups(groups: ProductGroup[]) {
    const productGroups: CheckBoxHeader[] = [];
    for (const productGroup of groups) {
      productGroups.push({
        title: productGroup.description,
        key: productGroup.productGroupCode
      });
    }
    return productGroups;
  }
  productCategories(categories: ProductCategory[]) {
    const productCategories: CheckBoxHeader[] = [];
    for (const productCateory of categories) {
      productCategories.push({
        title: productCateory.description,
        key: productCateory.productCategoryCode
      });
    }
    return productCategories;
  }
}
