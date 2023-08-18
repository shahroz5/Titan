import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrderPaymentConfigState } from './order-config.state';
import { selectOrderPaymentConfigSelectors } from './order-config.selectors';
import * as OrderPaymentConfigActions from './order-config.actions';
import {
  OrderPaymentConfigReqPayload,
  UpdateOrderPaymentConfigPayload,
  SaveOrderPaymentsPayload,
  OrderPayementRulesRequest
} from '@poss-web/shared/models';

@Injectable()
export class OrderPaymentFacade {
  constructor(public store: Store<OrderPaymentConfigState>) {}

  private orderPaymentConfigList$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectOrderPaymentConfigList
  );
  private orderPaymentConfig$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectOrderPaymentConfig
  );

  private error$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectError
  );
  private hasSaved$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectHassaved
  );
  private IsUpdated$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectIsUpdated
  );
  private isLoading$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectTotalElement
  );
  private productGroups$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectProductGroups
  );

  private selectConfigId$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectConfigId
  );
  private isCleared$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectIsCleared
  );
  private orderPaymentConfigDetails = this.store.select(
    selectOrderPaymentConfigSelectors.selectOrderPaymentConfigDetails
  );
  private ruleDetailsCount$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectRuleDetailsCount
  );
  private allRuleDetails$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectAllRuleDetails
  );
  private selectUniqueNameCheckCount$ = this.store.select(
    selectOrderPaymentConfigSelectors.selectUniqueNameCheckCount
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
  getOrderPaymentCOnfigDetails() {
    return this.orderPaymentConfigDetails;
  }
  getOrderPaymentRulesDetailsCount() {
    return this.ruleDetailsCount$;
  }
  getAllOrderPaymentRulesDetailst() {
    return this.allRuleDetails$;
  }
  getUniqueNameCheckCount() {
    return this.selectUniqueNameCheckCount$;
  }

  LoadOrderPaymentConfigList(payload: OrderPaymentConfigReqPayload) {
    this.store.dispatch(
      new OrderPaymentConfigActions.LoadOrderPaymentsConfigList(payload)
    );
  }

  loadSelectedConfigDetails(configId: string) {
    this.store.dispatch(
      new OrderPaymentConfigActions.LoadSelectedConfigDetails(configId)
    );
  }
  searchConfigDetailsByConfigName(configName: string) {
    this.store.dispatch(
      new OrderPaymentConfigActions.SearchConfigDetailsByConfigName(configName)
    );
  }
  saveConfiguration(payload: SaveOrderPaymentsPayload) {
    this.store.dispatch(
      new OrderPaymentConfigActions.SaveOderPaymentConfig(payload)
    );
  }
  updateIsActive(payload: UpdateOrderPaymentConfigPayload) {
    this.store.dispatch(
      new OrderPaymentConfigActions.UpdateConfigIsActive(payload)
    );
  }
  updateConfig(updateWeightTolerance: UpdateOrderPaymentConfigPayload) {
    this.store.dispatch(
      new OrderPaymentConfigActions.UpdateOrderPaymentConfig(
        updateWeightTolerance
      )
    );
  }
  removeConfiguration(payload: UpdateOrderPaymentConfigPayload) {
    this.store.dispatch(
      new OrderPaymentConfigActions.RemoveOrderPaymentConfig(payload)
    );
  }
  loadReset() {
    this.store.dispatch(new OrderPaymentConfigActions.LoadReset());
  }
  loadProductGroups() {
    this.store.dispatch(
      new OrderPaymentConfigActions.LoadProductGroupMapping()
    );
  }
  loadOrderPaymentConfigById(payload: OrderPayementRulesRequest) {
    this.store.dispatch(
      new OrderPaymentConfigActions.LoadOrderConfigByConfigId(payload)
    );
  }
  loadAllOrderPaymentRulesById(payload: OrderPayementRulesRequest) {
    this.store.dispatch(
      new OrderPaymentConfigActions.LoadAllConfigRules(payload)
    );
  }
  uniqueConfigNameCheck(payload: string) {
    this.store.dispatch(
      new OrderPaymentConfigActions.UniqueConfigurationNameCheck(payload)
    );
  }
}
