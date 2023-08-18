import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CnPriorityConfigState } from './cn-priority-config.state';
import * as CnPriorityConfigActions from './cn-priority-config.actions';
import { cnPriorityConfigSelectors } from './cn-priority-config.selectors';
import {
  CnPriorityConfigListPayload,
  CnPriorityConfig
} from '@poss-web/shared/models';

@Injectable()
export class CnPriorityConfigFacade {
  constructor(public store: Store<CnPriorityConfigState>) {}

  private cnPriorityConfigList$ = this.store.select(
    cnPriorityConfigSelectors.selectCnPriorityConfigList
  );
  private cnPriorityConfig$ = this.store.select(
    cnPriorityConfigSelectors.selectCnPriorityConfig
  );

  private cnTypeList$ = this.store.select(
    cnPriorityConfigSelectors.selectCnTypeList
  );

  private error$ = this.store.select(cnPriorityConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    cnPriorityConfigSelectors.selectHassaved
  );
  private hasUpdated$ = this.store.select(
    cnPriorityConfigSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    cnPriorityConfigSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    cnPriorityConfigSelectors.selectTotalElement
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
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }
  getCnPriorityConfig() {
    return this.cnPriorityConfig$;
  }
  getCnPriorityConfigList() {
    return this.cnPriorityConfigList$;
  }
  getCnTypeList() {
    return this.cnTypeList$;
  }

  loadCnPriorityConfigList(
    cnPriorityConfigListPayload: CnPriorityConfigListPayload
  ) {
    this.store.dispatch(
      new CnPriorityConfigActions.LoadCnPriorityConfigList(
        cnPriorityConfigListPayload
      )
    );
  }

  saveCnPriorityConfig(cnPriorityConfig: CnPriorityConfig) {
    this.store.dispatch(
      new CnPriorityConfigActions.SaveCnPriorityConfig(cnPriorityConfig)
    );
  }
  loadCnPriorityConfigByConfigId(configId: string) {
    this.store.dispatch(
      new CnPriorityConfigActions.LoadCnPriorityConfigByConfigId(configId)
    );
  }

  loadNewCnPriorityConfigByConfigId() {
    this.store.dispatch(
      new CnPriorityConfigActions.LoadNewCnPriorityConfigByConfigId()
    );
  }

  updateCnPriorityConfig(updateCnPriorityConfig: CnPriorityConfig) {
    this.store.dispatch(
      new CnPriorityConfigActions.UpdateCnPriorityConfig(updateCnPriorityConfig)
    );
  }

  loadCnTypeList() {
    this.store.dispatch(new CnPriorityConfigActions.LoadCnTypeList());
  }

  searchConfig(configName: string) {
    this.store.dispatch(
      new CnPriorityConfigActions.SearchConfigByConfigName(configName)
    );
  }
  loadReset() {
    this.store.dispatch(new CnPriorityConfigActions.LoadReset());
  }
}
