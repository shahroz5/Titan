import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType
} from '@poss-web/shared/models';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { BgrToleranceConfigService } from '../bgr-tolerance-config.service';
import { BgrToleranceConfigActionTypes } from './bgr-tolerance-config.actions';
import * as BgrToleranceConfigAction from './bgr-tolerance-config.actions';
import { BgrToleranceConfigFacade } from './bgr-tolerance-config.facade';

@Injectable()
export class BgrToleranceConfigEffect {
  configIdInSlabValidationFailure = null;
  constructor(
    public dataPersistence: DataPersistence<any>,
    public bgrToleranceConfigService: BgrToleranceConfigService,
    public loggerService: LoggerService,
    private bgrToleranceConfigFacade: BgrToleranceConfigFacade
  ) {}

  @Effect()
  loadBgrToleranceConfigList$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST,
    {
      run: (action: BgrToleranceConfigAction.LoadBgrToleranceConfigList) => {
        return this.bgrToleranceConfigService
          .getBgrToleranceConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description,
            action.payload.orderType
          )
          .pipe(
            map(
              (payload: {
                data: AbToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new BgrToleranceConfigAction.LoadBgrToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.LoadBgrToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.LoadBgrToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST,
    {
      run: (action: BgrToleranceConfigAction.SearchBgrToleranceConfigList) => {
        return this.bgrToleranceConfigService
          .searchConfigByConfigName(action.payload, action.ruleType)
          .pipe(
            map(
              (payload: {
                data: AbToleranceConfigResponse[];
                totalElements: number;
              }) =>
                new BgrToleranceConfigAction.SearchBgrToleranceConfigListSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.SearchBgrToleranceConfigList,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.SearchBgrToleranceConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedConfigDetails$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS,
    {
      run: (action: BgrToleranceConfigAction.LoadSelectedConfigDetails) => {
        return this.bgrToleranceConfigService
          .getSelectedConfigDetails(action.payload, action.ruleType)
          .pipe(
            map(
              selectedConfigData =>
                new BgrToleranceConfigAction.LoadSelectedConfigDetailsSuccess(
                  selectedConfigData
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.LoadSelectedConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.LoadSelectedConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateConfig$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE,
    {
      run: (
        action: BgrToleranceConfigAction.UpdateBgrToleranceConfigIsActive
      ) => {
        return this.bgrToleranceConfigService
          .updateConfig(action.payload)
          .pipe(
            map(
              (payload: AbToleranceConfigResponse) =>
                new BgrToleranceConfigAction.UpdateBgrToleranceConfigIsActiveSuccess(
                  payload
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.UpdateBgrToleranceConfigIsActive,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.UpdateBgrToleranceConfigIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRangeWeight$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT,
    {
      run: (action: BgrToleranceConfigAction.LoadBgrToleranceRangeWeight) => {
        return this.bgrToleranceConfigService
          .loadRangeWeight()
          .pipe(
            map(
              (rangeWeight: AbToleranceWeightRange[]) =>
                new BgrToleranceConfigAction.LoadBgrToleranceRangeWeightSuccess(
                  rangeWeight
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.LoadBgrToleranceRangeWeight,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.LoadBgrToleranceRangeWeightFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  SaveResidualWeightConfig$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG,
    {
      run: (action: BgrToleranceConfigAction.SaveBgrToleranceConfig) => {
        return this.bgrToleranceConfigService
          .saveConfig(
            action.payload.configDetail,
            action.payload.residualTolerance
          )
          .pipe(
            map((response: AbToleranceConfigResponse) => {
              return new BgrToleranceConfigAction.SaveBgrToleranceConfigSuccess(
                response
              );
            })
          );
      },
      onError: (
        action: BgrToleranceConfigAction.SaveBgrToleranceConfig,
        error: HttpErrorResponse
      ) => {
        this.bgrToleranceConfigFacade.updateConfigId(
          this.bgrToleranceConfigService.configIdInValidationFailureScenario
        );
        return new BgrToleranceConfigAction.SaveBgrToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappingByConfigId$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID,
    {
      run: (action: BgrToleranceConfigAction.LoadRangeMappingByConfigId) => {
        return this.bgrToleranceConfigService
          .getConfigMapping(action.payload, action.ruleType)
          .pipe(
            map((payload: any) => {
              return new BgrToleranceConfigAction.LoadRangeMappingByConfigIdSuccess(
                payload
              );
            })
          );
      },
      onError: (
        action: BgrToleranceConfigAction.LoadRangeMappingByConfigId,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.LoadRangeMappingByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  updateRangeMapping$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING,
    {
      run: (action: BgrToleranceConfigAction.UpdateRangeMapping) => {
        return this.bgrToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.ruleType,
            action.payload.data
          )
          .pipe(
            map(
              (payload: any) =>
                new BgrToleranceConfigAction.UpdateRangeMappingSuccess(payload)
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.UpdateRangeMapping,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.UpdateRangeMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  remove$ = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG,
    {
      run: (action: BgrToleranceConfigAction.RemoveBgrToleranceConfig) => {
        return this.bgrToleranceConfigService
          .UpdateConfigMapping(
            action.payload.id,
            action.payload.ruleType,
            action.payload.data
          )
          .pipe(
            map(
              (weightToleranceResponse: any) =>
                new BgrToleranceConfigAction.RemoveBgrToleranceConfigSuccess(
                  weightToleranceResponse
                )
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.RemoveBgrToleranceConfig,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.RemoveBgrToleranceConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMetalTypes$: Observable<Action> = this.dataPersistence.fetch(
    BgrToleranceConfigActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: BgrToleranceConfigAction.LoadMetalTypes) => {
        return this.bgrToleranceConfigService
          .loadMetalTypes()
          .pipe(
            map(
              (metalTypes: AbToleranceConfigMetalType[]) =>
                new BgrToleranceConfigAction.LoadMetalTypesSuccess(metalTypes)
            )
          );
      },
      onError: (
        action: BgrToleranceConfigAction.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new BgrToleranceConfigAction.LoadMetalTypesFailure(
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
