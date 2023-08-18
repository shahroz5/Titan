import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as ResidualWeightConfigAction from './residual-weight-config.actions';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  ResidualWeightConfigResponse,
  ResidualWeightRange,
  ResidualWeightToleranceResponse
} from '@poss-web/shared/models';
import { ResidualWeightConfigActionTypes } from './residual-weight-config.actions';
import { ResidualWeightConfigService } from '../residual-weight-config.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ResidualWeightConfigEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public residualWeightConfigService: ResidualWeightConfigService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadResidualWeightConfigList$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST,
    {
      run: (
        action: ResidualWeightConfigAction.LoadResidualWeightConfigList
      ) => {
        return this.residualWeightConfigService
          .getResidualWeightConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              (payload: {
                data: ResidualWeightConfigResponse[];
                totalElements: number;
              }) =>
                new ResidualWeightConfigAction.LoadResidualWeightConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.LoadResidualWeightConfigList,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.LoadResidualWeightConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST,
    {
      run: (
        action: ResidualWeightConfigAction.SearchResidualWeightConfigList
      ) => {
        return this.residualWeightConfigService
          .searchConfigByConfigName(action.payload)
          .pipe(
            map(
              (payload: {
                data: ResidualWeightConfigResponse[];
                totalElements: number;
              }) =>
                new ResidualWeightConfigAction.SearchResidualWeightConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.SearchResidualWeightConfigList,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.SearchResidualWeightConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SaveResidualWeightConfig$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG,
    {
      run: (action: ResidualWeightConfigAction.SaveResidualWeightConfig) => {
        return this.residualWeightConfigService
          .saveResidualWeightConfig(
            action.payload.configDetail,
            action.payload.residualTolerance
          )
          .pipe(
            map(
              (response: ResidualWeightConfigResponse) =>
                new ResidualWeightConfigAction.SaveResidualWeightConfigSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.SaveResidualWeightConfig,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.SaveResidualWeightConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateResidualWeightConfig$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE,
    {
      run: (
        action: ResidualWeightConfigAction.UpdateResidualWeightConfigIsActive
      ) => {
        return this.residualWeightConfigService
          .updateResidualWeightConfig(action.payload)
          .pipe(
            map(
              (payload: ResidualWeightConfigResponse) =>
                new ResidualWeightConfigAction.UpdateResidualWeightConfigIsActiveSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.UpdateResidualWeightConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.UpdateResidualWeightConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT,
    {
      run: (action: ResidualWeightConfigAction.LoadResidualRangeWeight) => {
        return this.residualWeightConfigService
          .loadRangeWeight()
          .pipe(
            map(
              (rangeWeight: ResidualWeightRange[]) =>
                new ResidualWeightConfigAction.LoadResidualRangeWeightSuccesss(
                  rangeWeight
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.LoadResidualRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.LoadResidualRangeWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  configDetails$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
    {
      run: (action: ResidualWeightConfigAction.LoadSelectedConfigDetails) => {
        return this.residualWeightConfigService
          .selectedConfigDetails(action.payload)
          .pipe(
            map(
              (payload: any) =>
                new ResidualWeightConfigAction.LoadSelectedConfigDetailsSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadrangeMappingByConfigId$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
    {
      run: (action: ResidualWeightConfigAction.LoadRangeMappingByConfigid) => {
        return this.residualWeightConfigService
          .getRangeMapping(action.payload)
          .pipe(
            map(
              (payload: ResidualWeightToleranceResponse) =>
                new ResidualWeightConfigAction.LoadRangeMappingByConfigidSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.LoadRangeMappingByConfigid,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.LoadRangeMappingByConfigidFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateRangeMapping$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING,
    {
      run: (action: ResidualWeightConfigAction.UpdateRangeMapping) => {
        return this.residualWeightConfigService
          .UpdateRangeMapping(action.payload.id, action.payload.data)
          .pipe(
            map(
              (payload: any) =>
                new ResidualWeightConfigAction.UpdateRangeMappingSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.UpdateRangeMapping,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.UpdateRangeMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  remove$ = this.dataPersistence.fetch(
    ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT,
    {
      run: (action: ResidualWeightConfigAction.RemoveRangeMapping) => {
        return this.residualWeightConfigService
          .UpdateRangeMapping(action.payload.id, action.payload.data)
          .pipe(
            map(
              (weightToleranceResponse: any) =>
                new ResidualWeightConfigAction.RemoveRangeMappingSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: ResidualWeightConfigAction.RemoveRangeMapping,
        error: HttpErrorResponse
      ) => {
        return new ResidualWeightConfigAction.RemoveRangeMappingFailure(
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
