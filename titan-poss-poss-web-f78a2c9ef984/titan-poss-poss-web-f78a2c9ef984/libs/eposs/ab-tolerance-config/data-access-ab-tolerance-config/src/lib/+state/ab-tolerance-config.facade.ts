import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AbToleranceConfigState } from './ab-tolerance-config.state';
import { AbToleranceConfigSelectors } from './ab-tolerance-config.selector';
import * as AbToleranceConfigActions from './ab-tolerance-config.actions';
import {
  AbToleranceConfigResponse,
  SaveAbTolerancePayload,
  ABToleranceUpdateRangeMappingPayload,
  LoadAbToleranceConfigReqPayload,
  AbToleranceConfigDetailsReqPayload
} from '@poss-web/shared/models';
@Injectable()
export class AbToleranceConfigFacade {
  constructor(public store: Store<AbToleranceConfigState>) {}

  private isLoading$ = this.store.select(
    AbToleranceConfigSelectors.selectIsloading
  );
  private error$ = this.store.select(AbToleranceConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    AbToleranceConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    AbToleranceConfigSelectors.selectHasUpdated
  );
  private isCleared$ = this.store.select(
    AbToleranceConfigSelectors.selectIsCleared
  );
  private totalElements$ = this.store.select(
    AbToleranceConfigSelectors.selectTotalElements
  );
  private abToleranceConfigurationList$ = this.store.select(
    AbToleranceConfigSelectors.selectAbToleranceConfigList
  );
  private abToleranceConfiguration$ = this.store.select(
    AbToleranceConfigSelectors.selectAbToleranceConfig
  );
  private residualWeightRanges$ = this.store.select(
    AbToleranceConfigSelectors.selectResidualWeightRanges
  );
  private toleranceConfig$ = this.store.select(
    AbToleranceConfigSelectors.selectToleranceConfigMapping
  );
  private configId$ = this.store.select(
    AbToleranceConfigSelectors.selectConfigId
  );
  private selectMetalType$ = this.store.select(
    AbToleranceConfigSelectors.selectMetalTypes
  );
  private selectUniqueNameCheckCount$ = this.store.select(
    AbToleranceConfigSelectors.selectUniqueNameCheckCount
  );
  private selectRuleDetalsTotalCount$ = this.store.select(
    AbToleranceConfigSelectors.selectRuleDetailsTotalCount
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

  getAbToleranceConfigList() {
    return this.abToleranceConfigurationList$;
  }

  getAbToleranceConfig() {
    return this.abToleranceConfiguration$;
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
  getUniqueNameCheckCount() {
    return this.selectUniqueNameCheckCount$;
  }
  getRuleDetailsTotalCount() {
    return this.selectRuleDetalsTotalCount$;
  }
  loadAbToleranceConfigList(payload: LoadAbToleranceConfigReqPayload) {
    this.store.dispatch(
      new AbToleranceConfigActions.LoadAbToleranceConfigList(payload)
    );
  }
  updateConfigIsActive(payload: AbToleranceConfigResponse) {
    this.store.dispatch(
      new AbToleranceConfigActions.UpdateAbToleranceConfigIsActive(payload)
    );
  }
  searchConfigByConfigName(payload: { configName: string; ruleType: string }) {
    this.store.dispatch(
      new AbToleranceConfigActions.SearchAbToleranceConfigList(payload)
    );
  }
  saveToleranceConfig(payload: SaveAbTolerancePayload) {
    this.store.dispatch(
      new AbToleranceConfigActions.SaveAbToleranceConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new AbToleranceConfigActions.LoadReset());
  }
  loadAbTolerancelWeightRanges() {
    this.store.dispatch(
      new AbToleranceConfigActions.LoadAbToleranceRangeWeight()
    );
  }

  updateAbTolerance(payload: ABToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new AbToleranceConfigActions.UpdateRangeMapping(payload)
    );
  }
  loadSelectedConfigDetails(payload: { configId: string; ruleType: string }) {
    this.store.dispatch(
      new AbToleranceConfigActions.LoadSelectedConfigDetails(payload)
    );
  }

  loadAbMappingByConfigId(payload: AbToleranceConfigDetailsReqPayload) {
    this.store.dispatch(
      new AbToleranceConfigActions.LoadRangeMappingByConfigId(payload)
    );
  }
  removeConfiguration(payload: ABToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new AbToleranceConfigActions.RemoveAbToleranceConfig(payload)
    );
  }
  loadMetalTypes() {
    this.store.dispatch(new AbToleranceConfigActions.LoadMetalTypes());
  }
  uniqueConfigNameCheck(payload: string) {
    this.store.dispatch(
      new AbToleranceConfigActions.UniqueConfigurationNameCheck(payload)
    );
  }
}
