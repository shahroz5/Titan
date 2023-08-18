import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoOrderPaymentConfigState } from './co-order-config.state';
import { selectCoOrderPaymentConfigSelectors } from './co-order-config.selectors';
import * as CoOrderPaymentConfigActions from './co-order-config.actions';
import {
  CoOrderPaymentConfigReqPayload,
  UpdateCoOrderPaymentConfigPayload,
  SaveCoOrderPaymentsPayload,
  CoOrderPayementRulesRequest
} from '@poss-web/shared/models';

@Injectable()
export class CoOrderPaymentFacade {
  constructor(public store: Store<CoOrderPaymentConfigState>) {}

  private orderPaymentConfigList$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfigList
  );
  private orderPaymentConfig$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfig
  );

  private error$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectError
  );
  private hasSaved$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectHassaved
  );
  private IsUpdated$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectIsUpdated
  );
  private isLoading$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectTotalElement
  );
  private productGroups$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectProductGroups
  );

  private selectConfigId$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectConfigId
  );
  private isCleared$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectIsCleared
  );
  private orderPaymentConfigDetails = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfigDetails
  );
  private ruleDetailsCount$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectRuleDetailsCount
  );
  private allRuleDetails$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectAllRuleDetails
  );
  private selectUniqueNameCheckCount$ = this.store.select(
    selectCoOrderPaymentConfigSelectors.selectUniqueNameCheckCount
  );
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getIsUpdated() {
    return this.IsUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }
  getConfiguration() {
    return this.orderPaymentConfig$;
  }
  getConfigurationList() {
    return this.orderPaymentConfigList$;
  }
  getProductGroups() {
    return this.productGroups$;
  }

  getConfigId() {
    return this.selectConfigId$;
  }
  getIsCleared() {
    return this.isCleared$;
  }
  getCoOrderPaymentCOnfigDetails() {
    return this.orderPaymentConfigDetails;
  }
  getCoOrderPaymentRulesDetailsCount() {
    return this.ruleDetailsCount$;
  }
  getAllCoOrderPaymentRulesDetailst() {
    return this.allRuleDetails$;
  }
  getUniqueNameCheckCount() {
    return this.selectUniqueNameCheckCount$;
  }

  LoadCoOrderPaymentConfigList(payload: CoOrderPaymentConfigReqPayload) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.LoadCoOrderPaymentsConfigList(payload)
    );
  }

  loadSelectedConfigDetails(configId: string) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.LoadSelectedConfigDetails(configId)
    );
  }
  searchConfigDetailsByConfigName(configName: string) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.SearchConfigDetailsByConfigName(
        configName
      )
    );
  }
  saveConfiguration(payload: SaveCoOrderPaymentsPayload) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.SaveOderPaymentConfig(payload)
    );
  }
  updateIsActive(payload: UpdateCoOrderPaymentConfigPayload) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.UpdateConfigIsActive(payload)
    );
  }
  updateConfig(updateWeightTolerance: UpdateCoOrderPaymentConfigPayload) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.UpdateCoOrderPaymentConfig(
        updateWeightTolerance
      )
    );
  }
  removeConfiguration(payload: UpdateCoOrderPaymentConfigPayload) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.RemoveCoOrderPaymentConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new CoOrderPaymentConfigActions.LoadReset());
  }
  loadProductGroups() {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.LoadProductGroupMapping()
    );
  }
  loadCoOrderPaymentConfigById(payload: CoOrderPayementRulesRequest) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.LoadCoOrderConfigByConfigId(payload)
    );
  }
  loadAllCoOrderPaymentRulesById(payload: CoOrderPayementRulesRequest) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.LoadAllConfigRules(payload)
    );
  }
  uniqueConfigNameCheck(payload: string) {
    this.store.dispatch(
      new CoOrderPaymentConfigActions.UniqueConfigurationNameCheck(payload)
    );
  }
}
