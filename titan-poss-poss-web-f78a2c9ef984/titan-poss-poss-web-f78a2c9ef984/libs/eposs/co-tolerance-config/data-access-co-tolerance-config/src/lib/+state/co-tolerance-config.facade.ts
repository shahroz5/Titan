import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { CoToleranceConfigState } from './co-tolerance-config.state';
import { CoToleranceConfigSelectors } from './co-tolerance-config.selector';
import * as CoToleranceConfigActions from './co-tolerance-config.actions';
import {
  CoToleranceConfigResponse,
  SaveCoTolerancePayload,
  COToleranceUpdateRangeMappingPayload,
  LoadCoToleranceConfigReqPayload,
  CoToleranceConfigDetailsReqPayload
} from '@poss-web/shared/models';
@Injectable()
export class CoToleranceConfigFacade {
  constructor(public store: Store<CoToleranceConfigState>) {}

  private isLoading$ = this.store.select(
    CoToleranceConfigSelectors.selectIsloading
  );
  private error$ = this.store.select(CoToleranceConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    CoToleranceConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    CoToleranceConfigSelectors.selectHasUpdated
  );
  private isCleared$ = this.store.select(
    CoToleranceConfigSelectors.selectIsCleared
  );
  private totalElements$ = this.store.select(
    CoToleranceConfigSelectors.selectTotalElements
  );
  private coToleranceConfigurationList$ = this.store.select(
    CoToleranceConfigSelectors.selectCoToleranceConfigList
  );
  private coToleranceConfiguration$ = this.store.select(
    CoToleranceConfigSelectors.selectCoToleranceConfig
  );
  private residualWeightRanges$ = this.store.select(
    CoToleranceConfigSelectors.selectResidualWeightRanges
  );
  private toleranceConfig$ = this.store.select(
    CoToleranceConfigSelectors.selectToleranceConfigMapping
  );
  private configId$ = this.store.select(
    CoToleranceConfigSelectors.selectConfigId
  );
  private selectMetalType$ = this.store.select(
    CoToleranceConfigSelectors.selectMetalTypes
  );
  private selectUniqueNameCheckCount$ = this.store.select(
    CoToleranceConfigSelectors.selectUniqueNameCheckCount
  );
  private selectRuleDetalsTotalCount$ = this.store.select(
    CoToleranceConfigSelectors.selectRuleDetailsTotalCount
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

  getCoToleranceConfigList() {
    return this.coToleranceConfigurationList$;
  }

  getCoToleranceConfig() {
    return this.coToleranceConfiguration$;
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
  loadCoToleranceConfigList(payload: LoadCoToleranceConfigReqPayload) {
    this.store.dispatch(
      new CoToleranceConfigActions.LoadCoToleranceConfigList(payload)
    );
  }
  updateConfigIsActive(payload: CoToleranceConfigResponse) {
    this.store.dispatch(
      new CoToleranceConfigActions.UpdateCoToleranceConfigIsActive(payload)
    );
  }
  searchConfigByConfigName(payload: { configName: string; ruleType: string }) {
    this.store.dispatch(
      new CoToleranceConfigActions.SearchCoToleranceConfigList(payload)
    );
  }
  saveToleranceConfig(payload: SaveCoTolerancePayload) {
    this.store.dispatch(
      new CoToleranceConfigActions.SaveCoToleranceConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new CoToleranceConfigActions.LoadReset());
  }
  loadCoTolerancelWeightRanges() {
    this.store.dispatch(
      new CoToleranceConfigActions.LoadCoToleranceRangeWeight()
    );
  }

  updateCoTolerance(payload: COToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new CoToleranceConfigActions.UpdateRangeMapping(payload)
    );
  }
  loadSelectedConfigDetails(payload: { configId: string; ruleType: string }) {
    this.store.dispatch(
      new CoToleranceConfigActions.LoadSelectedConfigDetails(payload)
    );
  }

  loadCoMappingByConfigId(payload: CoToleranceConfigDetailsReqPayload) {
    this.store.dispatch(
      new CoToleranceConfigActions.LoadRangeMappingByConfigId(payload)
    );
  }
  removeConfiguration(payload: COToleranceUpdateRangeMappingPayload) {
    this.store.dispatch(
      new CoToleranceConfigActions.RemoveCoToleranceConfig(payload)
    );
  }
  loadMetalTypes() {
    this.store.dispatch(new CoToleranceConfigActions.LoadMetalTypes());
  }
  uniqueConfigNameCheck(payload: string) {
    this.store.dispatch(
      new CoToleranceConfigActions.UniqueConfigurationNameCheck(payload)
    );
  }
}
