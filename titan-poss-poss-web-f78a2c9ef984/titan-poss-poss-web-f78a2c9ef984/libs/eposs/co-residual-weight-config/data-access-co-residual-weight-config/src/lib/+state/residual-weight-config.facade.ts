import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  ResidualWeightConfigResponse,
  UpdateRangeMappingPayload,
  SaveResidualTolerancePayload,
  LoadResidualToleranceByConfigidPayload,
  LoadResidualWeightConfigListingPayload
} from '@poss-web/shared/models';
import { ResidualWeightConfigState } from './residual-weight-config.state';
import { ResidualWeightConfigSelectors } from './residual-weight-config.selector';
import * as ResidualWeightConfigActions from './residual-weight-config.actions';

@Injectable()
export class ResidualCoWeightConfigFacade {
  constructor(public store: Store<ResidualWeightConfigState>) {}

  private isLoading$ = this.store.select(
    ResidualWeightConfigSelectors.selectIsloading
  );
  private error$ = this.store.select(ResidualWeightConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    ResidualWeightConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    ResidualWeightConfigSelectors.selectHasUpdated
  );
  private isCleared$ = this.store.select(
    ResidualWeightConfigSelectors.selectIsCleared
  );
  private totalElements$ = this.store.select(
    ResidualWeightConfigSelectors.selectTotalElements
  );
  private residualWeightConfigurationList$ = this.store.select(
    ResidualWeightConfigSelectors.selectResidualWeightConfigList
  );
  private residualWeightConfiguration$ = this.store.select(
    ResidualWeightConfigSelectors.selectResidualWeightConfig
  );
  private residualWeightRanges$ = this.store.select(
    ResidualWeightConfigSelectors.selectResidualWeightRanges
  );
  private rangeMappingConfig$ = this.store.select(
    ResidualWeightConfigSelectors.selectRangeMapping
  );
  private configId$ = this.store.select(
    ResidualWeightConfigSelectors.selectConfigId
  );
  private ruleDetailsCount$ = this.store.select(
    ResidualWeightConfigSelectors.selectRuleDetailsCount
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

  getResidualWeightConfigList() {
    return this.residualWeightConfigurationList$;
  }

  getResidualWeightCOnfig() {
    return this.residualWeightConfiguration$;
  }
  getResidualWeightRanges() {
    return this.residualWeightRanges$;
  }
  getRangeMappingConfig() {
    return this.rangeMappingConfig$;
  }
  getConfigId() {
    return this.configId$;
  }
  getRuleDetailsCount() {
    return this.ruleDetailsCount$;
  }

  loadResidualWeightConfigList(
    payload: LoadResidualWeightConfigListingPayload
  ) {
    this.store.dispatch(
      new ResidualWeightConfigActions.LoadResidualWeightConfigList(payload)
    );
  }
  updateConfigIsActive(payload: ResidualWeightConfigResponse) {
    this.store.dispatch(
      new ResidualWeightConfigActions.UpdateResidualWeightConfigIsActive(
        payload
      )
    );
  }
  searchConfigByConfigName(configName: string) {
    this.store.dispatch(
      new ResidualWeightConfigActions.SearchResidualWeightConfigList(configName)
    );
  }
  saveWeightToleranceConfig(payload: SaveResidualTolerancePayload) {
    this.store.dispatch(
      new ResidualWeightConfigActions.SaveResidualWeightConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new ResidualWeightConfigActions.LoadReset());
  }
  loadResidualWeightRanges() {
    this.store.dispatch(
      new ResidualWeightConfigActions.LoadResidualRangeWeight()
    );
  }

  updateWeightTolerance(payload: UpdateRangeMappingPayload) {
    this.store.dispatch(
      new ResidualWeightConfigActions.UpdateRangeMapping(payload)
    );
  }
  loadSelectedConfigDetails(configId: string) {
    this.store.dispatch(
      new ResidualWeightConfigActions.LoadSelectedConfigDetails(configId)
    );
  }

  loadRangeMappingByConfigId(payload: LoadResidualToleranceByConfigidPayload) {
    this.store.dispatch(
      new ResidualWeightConfigActions.LoadRangeMappingByConfigid(payload)
    );
  }
  removeConfiguration(payload: UpdateRangeMappingPayload) {
    this.store.dispatch(
      new ResidualWeightConfigActions.RemoveRangeMapping(payload)
    );
  }
}
