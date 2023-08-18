import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { map, mergeMap } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType,
  AbToleranceConfigDetailsResPayload,
  ABToleranceUpdateRangeMappingPayload
} from '@poss-web/shared/models';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { AbToleranceConfigService } from '../ab-tolerance-config.service';
import { AbToleranceConfigActionTypes } from './ab-tolerance-config.actions';
import * as AbToleranceConfigAction from './ab-tolerance-config.actions';

@Injectable()
export class AbToleranceConfigEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public abToleranceConfigService: AbToleranceConfigService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadResidualWeightConfigList$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST,
    {
      run: (action: AbToleranceConfigAction.LoadAbToleranceConfigList) => {
        return this.abToleranceConfigService
          .getAbToleranceConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.orderType,
            action.payload.description
          )
          .pipe(
            map(
              (payload: {
                data: AbToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new AbToleranceConfigAction.LoadAbToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.LoadAbToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.LoadAbToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST,
    {
      run: (action: AbToleranceConfigAction.SearchAbToleranceConfigList) => {
        return this.abToleranceConfigService
          .searchConfigByConfigName(action.payload)
          .pipe(
            map(
              (payload: {
                data: AbToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new AbToleranceConfigAction.SearchAbToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.SearchAbToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.SearchAbToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
    {
      run: (action: AbToleranceConfigAction.LoadSelectedConfigDetails) => {
        return this.abToleranceConfigService
          .getSelectedConfigDetails(
            action.payload.configId,
            action.payload.ruleType
          )
          .pipe(
            map(
              selectedConfigData =>
                new AbToleranceConfigAction.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfig$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE,
    {
      run: (
        action: AbToleranceConfigAction.UpdateAbToleranceConfigIsActive
      ) => {
        return this.abToleranceConfigService
          .updateConfig(action.payload)
          .pipe(
            map(
              (payload: AbToleranceConfigResponse) =>
                new AbToleranceConfigAction.UpdateAbToleranceConfigIsActiveSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.UpdateAbToleranceConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.UpdateAbToleranceConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT,
    {
      run: (action: AbToleranceConfigAction.LoadAbToleranceRangeWeight) => {
        return this.abToleranceConfigService
          .loadRangeWeight()
          .pipe(
            map(
              (rangeWeight: AbToleranceWeightRange[]) =>
                new AbToleranceConfigAction.LoadAbToleranceRangeWeightSuccess(
                  rangeWeight
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.LoadAbToleranceRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.LoadAbToleranceRangeWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SaveResidualWeightConfig$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG,
    {
      run: (action: AbToleranceConfigAction.SaveAbToleranceConfig) => {
        return this.abToleranceConfigService
          .saveConfig(
            action.payload.configDetail,
            action.payload.residualTolerance,
            action.payload.ruleType
          )
          .pipe(
            mergeMap((response: any) => {
            const newActions: any[] = [
              new AbToleranceConfigAction.SaveAbToleranceConfigSuccess(
                response
              )
              
            ]
            if (response.ruleId) {
              let payload : ABToleranceUpdateRangeMappingPayload = {
                id: response.ruleId.toString(),
                data: action.payload.residualTolerance,
                ruleType: action.payload.ruleType
              }
              newActions.push(new AbToleranceConfigAction.UpdateRangeMapping(payload));
            }
            return newActions
          })
          );
      },
      onError: (
        action: AbToleranceConfigAction.SaveAbToleranceConfig,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.SaveAbToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappingByConfigId$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
    {
      run: (action: AbToleranceConfigAction.LoadRangeMappingByConfigId) => {
        return this.abToleranceConfigService
          .getConfigMapping(action.payload)
          .pipe(
            map(
              (payload: AbToleranceConfigDetailsResPayload) =>
                new AbToleranceConfigAction.LoadRangeMappingByConfigIdSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.LoadRangeMappingByConfigId,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.LoadRangeMappingByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateRangeMapping$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
    {
      run: (action: AbToleranceConfigAction.UpdateRangeMapping) => {
        return this.abToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.data,
            action.payload.ruleType
          )
          .pipe(
            map(
              (payload: any) =>
                new AbToleranceConfigAction.UpdateRangeMappingSuccess(payload)
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.UpdateRangeMapping,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.UpdateRangeMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  remove$ = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG,
    {
      run: (action: AbToleranceConfigAction.RemoveAbToleranceConfig) => {
        return this.abToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.data,
            action.payload.ruleType
          )
          .pipe(
            map(
              (weightToleranceResponse: any) =>
                new AbToleranceConfigAction.RemoveAbToleranceConfigSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.RemoveAbToleranceConfig,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.RemoveAbToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMetalTypes$: Observable<Action> = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: AbToleranceConfigAction.LoadMetalTypes) => {
        return this.abToleranceConfigService
          .loadMetalTypes()
          .pipe(
            map(
              (metalTypes: AbToleranceConfigMetalType[]) =>
                new AbToleranceConfigAction.LoadMetalTypesSuccess(metalTypes)
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.LoadMetalTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  UniqueNameCheck$: Observable<Action> = this.dataPersistence.fetch(
    AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK,
    {
      run: (action: AbToleranceConfigAction.UniqueConfigurationNameCheck) => {
        return this.abToleranceConfigService
          .uniqueConfigNameCheck(action.payload)
          .pipe(
            map(
              (count: number) =>
                new AbToleranceConfigAction.UniqueConfigurationNameCheckSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: AbToleranceConfigAction.UniqueConfigurationNameCheck,
        error: HttpErrorResponse
      ) => {
        return new AbToleranceConfigAction.UniqueConfigurationNameCheckFailure(
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
