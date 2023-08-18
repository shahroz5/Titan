import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { weightToleranceSelectors } from './weight-tolerance.selectors';
import * as WeightToleranceActions from './weight-tolerance.actions';
import { WeightToleranceState } from './weight-tolerances.state';
import {
  UpdateWeightTolerancePayload,
  SaveWeightTolerancePayload,
  WeightToleranceListPayload,
  LoadWeightToleranceByConfigidPayload
} from '@poss-web/shared/models';

@Injectable()
export class WeightToleranceFacade {
  constructor(private store: Store<WeightToleranceState>) {}
  private isCleared$ = this.store.select(
    weightToleranceSelectors.selectIsCleared
  );
  private isLoading$ = this.store.select(
    weightToleranceSelectors.selectisLoading
  );

  private totalElements$ = this.store.select(
    weightToleranceSelectors.selectTotalElements
  );

  private configList$ = this.store.select(
    weightToleranceSelectors.selectConfigList
  );

  private selectedConfigDetails$ = this.store.select(
    weightToleranceSelectors.selectConfigDetailsByconfigId
  );
  private selectWeightTolerance$ = this.store.select(
    weightToleranceSelectors.selectWeightTolerance
  );

  private selectRangeWeight$ = this.store.select(
    weightToleranceSelectors.selectRangeWeight
  );

  private selectHasSaved$ = this.store.select(
    weightToleranceSelectors.selecthasSaved
  );

  private selectIsupdated$ = this.store.select(
    weightToleranceSelectors.selectIsupdated
  );

  private selectError$ = this.store.select(
    weightToleranceSelectors.selectError
  );

  private selectConfigId$ = this.store.select(
    weightToleranceSelectors.selectConfigId
  );

  private productGroups$ = this.store.select(
    weightToleranceSelectors.selectProductGroups
  );

  getProductGroups() {
    return this.productGroups$;
  }

  getIsCleared() {
    return this.isCleared$;
  }

  getConfigId() {
    return this.selectConfigId$;
  }

  getError() {
    return this.selectError$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getIsUpdated() {
    return this.selectIsupdated$;
  }

  getHasSaved() {
    return this.selectHasSaved$;
  }

  getRangeWeight() {
    return this.selectRangeWeight$;
  }

  getWeightToleranceByConfigId() {
    return this.selectWeightTolerance$;
  }
  getSelectedConfigDetails() {
    return this.selectedConfigDetails$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getConfigList() {
    return this.configList$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  loadConfigList(weightToleranceListPayload: WeightToleranceListPayload) {
    this.store.dispatch(
      new WeightToleranceActions.LoadConfigList(weightToleranceListPayload)
    );
  }

  loadSelectedConfigDetails(configId: string) {
    this.store.dispatch(
      new WeightToleranceActions.LoadSelectedConfigDetails(configId)
    );
  }

  loadWeightToleranceByConfigId(
    loadWeightToleranceByConfigidPayload: LoadWeightToleranceByConfigidPayload
  ) {
    this.store.dispatch(
      new WeightToleranceActions.LoadWeightToleranceByConfigid(
        loadWeightToleranceByConfigidPayload
      )
    );
  }

  loadRangeWeight() {
    this.store.dispatch(new WeightToleranceActions.LoadRangeWeight());
  }

  searchConfigDetailsByConfigName(configName: string) {
    this.store.dispatch(
      new WeightToleranceActions.SearchConfigDetailsByConfigName(configName)
    );
  }
  saveWeightTolerance(saveTolerancePayload: SaveWeightTolerancePayload) {
    this.store.dispatch(
      new WeightToleranceActions.SaveWeightTolerance(saveTolerancePayload)
    );
  }
  updateWeightTolerance(updateWeightTolerance: UpdateWeightTolerancePayload) {
    this.store.dispatch(
      new WeightToleranceActions.UpdateWeightTolerance(updateWeightTolerance)
    );
  }
  loadProductGroups() {
    this.store.dispatch(new WeightToleranceActions.LoadProductGroupMapping());
  }
  updateIsActive(updtaeIsActivePaylod: UpdateWeightTolerancePayload) {
    this.store.dispatch(
      new WeightToleranceActions.UpdateIsActive(updtaeIsActivePaylod)
    );
  }

  removeWeightTolerance(updateWeightTolerance: UpdateWeightTolerancePayload) {
    this.store.dispatch(
      new WeightToleranceActions.RemoveWeightTolerance(updateWeightTolerance)
    );
  }
  loadReset() {
    this.store.dispatch(new WeightToleranceActions.LoadReset());
  }
}
