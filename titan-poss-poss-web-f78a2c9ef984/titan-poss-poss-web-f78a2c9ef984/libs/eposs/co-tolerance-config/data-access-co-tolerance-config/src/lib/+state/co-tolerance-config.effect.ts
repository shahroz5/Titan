import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { map, mergeMap } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  CoToleranceConfigResponse,
  CoToleranceWeightRange,
  CoToleranceConfigMetalType,
  CoToleranceConfigDetailsResPayload,
  COToleranceUpdateRangeMappingPayload
} from '@poss-web/shared/models';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CoToleranceConfigService } from '../co-tolerance-config.service';
import { CoToleranceConfigActionTypes } from './co-tolerance-config.actions';
import * as CoToleranceConfigAction from './co-tolerance-config.actions';

@Injectable()
export class CoToleranceConfigEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public coToleranceConfigService: CoToleranceConfigService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadResidualWeightConfigList$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST,
    {
      run: (action: CoToleranceConfigAction.LoadCoToleranceConfigList) => {
        return this.coToleranceConfigService
          .getCoToleranceConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.orderType,
            action.payload.description
          )
          .pipe(
            map(
              (payload: {
                data: CoToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new CoToleranceConfigAction.LoadCoToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.LoadCoToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.LoadCoToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST,
    {
      run: (action: CoToleranceConfigAction.SearchCoToleranceConfigList) => {
        return this.coToleranceConfigService
          .searchConfigByConfigName(action.payload)
          .pipe(
            map(
              (payload: {
                data: CoToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new CoToleranceConfigAction.SearchCoToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.SearchCoToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.SearchCoToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
    {
      run: (action: CoToleranceConfigAction.LoadSelectedConfigDetails) => {
        return this.coToleranceConfigService
          .getSelectedConfigDetails(
            action.payload.configId,
            action.payload.ruleType
          )
          .pipe(
            map(
              selectedConfigData =>
                new CoToleranceConfigAction.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfig$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE,
    {
      run: (
        action: CoToleranceConfigAction.UpdateCoToleranceConfigIsActive
      ) => {
        return this.coToleranceConfigService
          .updateConfig(action.payload)
          .pipe(
            map(
              (payload: CoToleranceConfigResponse) =>
                new CoToleranceConfigAction.UpdateCoToleranceConfigIsActiveSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.UpdateCoToleranceConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.UpdateCoToleranceConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT,
    {
      run: (action: CoToleranceConfigAction.LoadCoToleranceRangeWeight) => {
        return this.coToleranceConfigService
          .loadRangeWeight()
          .pipe(
            map(
              (rangeWeight: CoToleranceWeightRange[]) =>
                new CoToleranceConfigAction.LoadCoToleranceRangeWeightSuccess(
                  rangeWeight
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.LoadCoToleranceRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.LoadCoToleranceRangeWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SaveResidualWeightConfig$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG,
    {
      run: (action: CoToleranceConfigAction.SaveCoToleranceConfig) => {
        return this.coToleranceConfigService
          .saveConfig(
            action.payload.configDetail,
            action.payload.residualTolerance,
            action.payload.ruleType
          )
          .pipe(
            mergeMap((response: any) => {
              const newActions: any[] = [
                new CoToleranceConfigAction.SaveCoToleranceConfigSuccess(
                  response
                )
              ];
              if (response.ruleId) {
                const payload: COToleranceUpdateRangeMappingPayload = {
                  id: response.ruleId.toString(),
                  data: action.payload.residualTolerance,
                  ruleType: action.payload.ruleType
                };
                newActions.push(
                  new CoToleranceConfigAction.UpdateRangeMapping(payload)
                );
              }
              return newActions;
            })
          );
      },
      onError: (
        action: CoToleranceConfigAction.SaveCoToleranceConfig,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.SaveCoToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappingByConfigId$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
    {
      run: (action: CoToleranceConfigAction.LoadRangeMappingByConfigId) => {
        return this.coToleranceConfigService
          .getConfigMapping(action.payload)
          .pipe(
            map(
              (payload: CoToleranceConfigDetailsResPayload) =>
                new CoToleranceConfigAction.LoadRangeMappingByConfigIdSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.LoadRangeMappingByConfigId,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.LoadRangeMappingByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateRangeMapping$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
    {
      run: (action: CoToleranceConfigAction.UpdateRangeMapping) => {
        return this.coToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.data,
            action.payload.ruleType
          )
          .pipe(
            map(
              (payload: any) =>
                new CoToleranceConfigAction.UpdateRangeMappingSuccess(payload)
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.UpdateRangeMapping,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.UpdateRangeMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  remove$ = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG,
    {
      run: (action: CoToleranceConfigAction.RemoveCoToleranceConfig) => {
        return this.coToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.data,
            action.payload.ruleType
          )
          .pipe(
            map(
              (weightToleranceResponse: any) =>
                new CoToleranceConfigAction.RemoveCoToleranceConfigSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.RemoveCoToleranceConfig,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.RemoveCoToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMetalTypes$: Observable<Action> = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: CoToleranceConfigAction.LoadMetalTypes) => {
        return this.coToleranceConfigService
          .loadMetalTypes()
          .pipe(
            map(
              (metalTypes: CoToleranceConfigMetalType[]) =>
                new CoToleranceConfigAction.LoadMetalTypesSuccess(metalTypes)
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.LoadMetalTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  UniqueNameCheck$: Observable<Action> = this.dataPersistence.fetch(
    CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK,
    {
      run: (action: CoToleranceConfigAction.UniqueConfigurationNameCheck) => {
        return this.coToleranceConfigService
          .uniqueConfigNameCheck(action.payload)
          .pipe(
            map(
              (count: number) =>
                new CoToleranceConfigAction.UniqueConfigurationNameCheckSuccess(
                  count
                )
            )
          );
      },
      onError: (
        action: CoToleranceConfigAction.UniqueConfigurationNameCheck,
        error: HttpErrorResponse
      ) => {
        return new CoToleranceConfigAction.UniqueConfigurationNameCheckFailure(
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
