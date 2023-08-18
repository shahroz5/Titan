import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { BgrToleranceConfigState } from './bgr-tolerance-config.state';
import { BgrToleranceConfigSelectors } from './bgr-tolerance-config.selector';
import * as BgrToleranceConfigActions from './bgr-tolerance-config.actions';
import {
  AbToleranceConfigResponse,
  SaveAbTolerancePayload,
  ABToleranceUpdateRangeMappingPayload
} from '@poss-web/shared/models';
@Injectable()
export class BgrToleranceConfigFacade {
  constructor(public store: Store<BgrToleranceConfigState>) {}

  private isLoading$ = this.store.select(
    BgrToleranceConfigSelectors.selectIsloading
  );
  private error$ = this.store.select(BgrToleranceConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    BgrToleranceConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    BgrToleranceConfigSelectors.selectHasUpdated
  );
  private isCleared$ = this.store.select(
    BgrToleranceConfigSelectors.selectIsCleared
  );
  private totalElements$ = this.store.select(
    BgrToleranceConfigSelectors.selectTotalElements
  );
  private bgrToleranceConfigurationList$ = this.store.select(
    BgrToleranceConfigSelectors.selectBgrToleranceConfigList
  );
  private bgrToleranceConfiguration$ = this.store.select(
    BgrToleranceConfigSelectors.selectBgrToleranceConfig
  );
  private residualWeightRanges$ = this.store.select(
    BgrToleranceConfigSelectors.selectResidualWeightRanges
  );
  private toleranceConfig$ = this.store.select(
    BgrToleranceConfigSelectors.selectToleranceConfigMapping
  );
  private configId$ = this.store.select(
    BgrToleranceConfigSelectors.selectConfigId
  );
  private selectMetalType$ = this.store.select(
    BgrToleranceConfigSelectors.selectMetalTypes
  );
  private getConfigIdInSlabValidationFailure$ = this.store.select(
    BgrToleranceConfigSelectors.selectConfigIdInValidationSlabFailure
  );
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getIsCleared() {
    return this.isCleared$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getBgrToleranceConfigList() {
    return this.bgrToleranceConfigurationList$;
  }

  getAbToleranceConfig() {
    return this.bgrToleranceConfiguration$;
  }
  getWeightRanges() {
    return this.residualWeightRanges$;
  }
  getToleranceConfig() {
    return this.toleranceConfig$;
  }
  getConfigId() {
    return this.configId$;
  }
  getMetalTypes() {
    return this.selectMetalType$;
  }
  loadBgrToleranceConfigList(payload: any) {
    this.store.dispatch(
      new BgrToleranceConfigActions.LoadBgrToleranceConfigList(payload)
    );
  }
  updateConfigIsActive(payload: AbToleranceConfigResponse) {
    this.store.dispatch(
      new BgrToleranceConfigActions.UpdateBgrToleranceConfigIsActive(payload)
    );
  }
  searchConfigByConfigName(configName: string, ruleType: string) {
    this.store.dispatch(
      new BgrToleranceConfigActions.SearchBgrToleranceConfigList(
        configName,
        ruleType
      )
    );
  }
  saveToleranceConfig(payload: SaveAbTolerancePayload) {
    this.store.dispatch(
      new BgrToleranceConfigActions.SaveBgrToleranceConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new BgrToleranceConfigActions.LoadReset());
  }
  loadBgrTolerancelWeightRanges() {
    this.store.dispatch(
      new BgrToleranceConfigActions.LoadBgrToleranceRangeWeight()
    );
  }

  updateBgrTolerance(payload: ABToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new BgrToleranceConfigActions.UpdateRangeMapping(payload)
    );
  }
  loadSelectedConfigDetails(configId: string, ruleType: string) {
    this.store.dispatch(
      new BgrToleranceConfigActions.LoadSelectedConfigDetails(
        configId,
        ruleType
      )
    );
  }

  loadBgrMappingByConfigId(configId, ruleType) {
    this.store.dispatch(
      new BgrToleranceConfigActions.LoadRangeMappingByConfigId(
        configId,
        ruleType
      )
    );
  }
  removeConfiguration(payload: ABToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new BgrToleranceConfigActions.RemoveBgrToleranceConfig(payload)
    );
  }
  loadMetalTypes() {
    this.store.dispatch(new BgrToleranceConfigActions.LoadMetalTypes());
  }

  updateConfigId(configId: number) {
    this.store.dispatch(new BgrToleranceConfigActions.UpdateConfigId(configId));
  }

  getConfigIdInValidationSlabFailure() {
    return this.getConfigIdInSlabValidationFailure$;
  }
}
