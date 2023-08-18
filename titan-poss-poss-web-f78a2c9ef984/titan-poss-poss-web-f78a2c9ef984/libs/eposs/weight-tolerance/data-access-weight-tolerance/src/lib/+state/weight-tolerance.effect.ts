import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CustomErrors,
  WeightToleranceResponse,
  WeightToleranceList,
  ProductGroup,
  WeightTolerance
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as WeightTolerancesActions from './weight-tolerance.actions';
import { WeightToleranceActionTypes } from './weight-tolerance.actions';
import { WeightToleranceService } from '../weight-tolerance.service';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class WeightToleranceEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private weightToleranceService: WeightToleranceService,
    public productGroupDataService: ProductGroupDataService
  ) {}

  @Effect()
  loadProductGroups$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: WeightTolerancesActions.LoadProductGroupMapping) => {
        return this.productGroupDataService
          .getProductGroups(false)
          .pipe(
            map(
              (productGroup: ProductGroup[]) =>
                new WeightTolerancesActions.LoadProductGroupMappingSuccess(
                  productGroup
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.LoadProductGroupMapping,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.LoadProductGroupMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateIsActive$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.UPDATE_IS_ACTIVE,
    {
      run: (action: WeightTolerancesActions.UpdateIsActive) => {
        return this.weightToleranceService
          .updateIsActive(action.payload.id, action.payload.data)
          .pipe(
            map(() => new WeightTolerancesActions.UpdateIsActiveSuccess(''))
          );
      },
      onError: (
        action: WeightTolerancesActions.UpdateIsActive,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.UpdateIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadConfigList$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.LOAD_CONFIG_LIST,
    {
      run: (action: WeightTolerancesActions.LoadConfigList) => {
        return this.weightToleranceService
          .getConfigDetailsList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              configDetailsList =>
                new WeightTolerancesActions.LoadConfigListSuccess(
                  configDetailsList
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.LoadConfigList,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.LoadConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
    {
      run: (action: WeightTolerancesActions.LoadSelectedConfigDetails) => {
        return this.weightToleranceService
          .getSelectedConfigDetails(action.payload)
          .pipe(
            map(
              selectedConfigData =>
                new WeightTolerancesActions.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeWeightTolerance$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE,
    {
      run: (action: WeightTolerancesActions.RemoveWeightTolerance) => {
        return this.weightToleranceService
          .updateWeightTolerance(action.payload.id, action.payload.data)
          .pipe(
            map(
              (weightToleranceResponse: WeightToleranceResponse) =>
                new WeightTolerancesActions.RemoveWeightToleranceSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.RemoveWeightTolerance,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.RemoveWeightToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  SearchConfigDetailsByConfigName$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME,
    {
      run: (
        action: WeightTolerancesActions.SearchConfigDetailsByConfigName
      ) => {
        return this.weightToleranceService
          .searchConfigDetailsByconfigName(action.payload)
          .pipe(
            map(
              (configDetails: WeightToleranceList) =>
                new WeightTolerancesActions.SearchConfigDetailsByConfigNameSuccess(
                  configDetails
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.SearchConfigDetailsByConfigName,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.SearchConfigDetailsByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveWeightTolerances$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS,
    {
      run: (action: WeightTolerancesActions.SaveWeightTolerance) => {
        return this.weightToleranceService
          .saveWeightTolerance(
            action.payload.configDetail,
            action.payload.weightToleranceRequest
          )
          .pipe(
            map(
              (configId: string) =>
                new WeightTolerancesActions.SaveWeightToleranceSuccess(configId)
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.SaveWeightTolerance,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.SaveWeightToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadWeightToleranceByConfigId$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID,
    {
      run: (action: WeightTolerancesActions.LoadWeightToleranceByConfigid) => {
        return this.weightToleranceService
          .getWeightTolerance(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.configId,
            action.payload.productGroupCode
          )
          .pipe(
            map(
              (tolerance: WeightToleranceResponse) =>
                new WeightTolerancesActions.LoadWeightToleranceByConfigidSuccess(
                  tolerance
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.LoadWeightToleranceByConfigid,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.LoadWeightToleranceByConfigidFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTolerance$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE,
    {
      run: (action: WeightTolerancesActions.UpdateWeightTolerance) => {
        return this.weightToleranceService
          .updateWeightTolerance(action.payload.id, action.payload.data)
          .pipe(
            map(
              (weightToleranceResponse: WeightToleranceResponse) =>
                new WeightTolerancesActions.UpdateWeightToleranceSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.UpdateWeightTolerance,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.UpdateWeightToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    WeightToleranceActionTypes.LOAD_RANGE_WEIGHT,
    {
      run: (action: WeightTolerancesActions.LoadRangeWeight) => {
        return this.weightToleranceService
          .loadRangeWeight()

          .pipe(
            map(
              rangeWeight =>
                new WeightTolerancesActions.LoadRangeWeightSuccesss(rangeWeight)
            )
          );
      },
      onError: (
        action: WeightTolerancesActions.LoadRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new WeightTolerancesActions.LoadRangeWeightFailure(
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
