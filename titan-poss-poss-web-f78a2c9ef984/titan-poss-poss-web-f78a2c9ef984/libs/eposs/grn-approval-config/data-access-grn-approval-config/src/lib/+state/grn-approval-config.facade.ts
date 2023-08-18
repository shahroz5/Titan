import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GrnApprovalConfigState } from './grn-approval-config.state';
import * as GrnApprovalConfigActions from './grn-approval-config.actions';
import { grnApprovalConfigSelectors } from './grn-approval-config.selectors';
import {
  GrnApprovalConfigListPayload,
  GrnApprovalConfig
} from '@poss-web/shared/models';

@Injectable()
export class GrnApprovalConfigFacade {
  constructor(public store: Store<GrnApprovalConfigState>) {}

  private grnApprovalConfigList$ = this.store.select(
    grnApprovalConfigSelectors.selectGrnApprovalConfigList
  );
  private roleList$ = this.store.select(
    grnApprovalConfigSelectors.selectRoleList
  );
  private grnApprovalConfig$ = this.store.select(
    grnApprovalConfigSelectors.selectGrnApprovalConfig
  );

  private error$ = this.store.select(grnApprovalConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    grnApprovalConfigSelectors.selectHassaved
  );
  private hasUpdated$ = this.store.select(
    grnApprovalConfigSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    grnApprovalConfigSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    grnApprovalConfigSelectors.selectTotalElement
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
  getGrnApprovalConfig() {
    return this.grnApprovalConfig$;
  }
  getGrnApprovalConfigList() {
    return this.grnApprovalConfigList$;
  }

  getRoleList() {
    return this.roleList$;
  }

  loadGrnApprovalConfigList(
    grnApprovalConfigListPayload: GrnApprovalConfigListPayload
  ) {
    this.store.dispatch(
      new GrnApprovalConfigActions.LoadGrnApprovalConfigList(
        grnApprovalConfigListPayload
      )
    );
  }

  saveGrnApprovalConfig(grnApprovalConfig: GrnApprovalConfig) {
    this.store.dispatch(
      new GrnApprovalConfigActions.SaveGrnApprovalConfig(grnApprovalConfig)
    );
  }
  loadGrnApprovalConfigByRuleId(ruleId: any, ruleType: string) {
    this.store.dispatch(
      new GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleId(
        ruleId,
        ruleType
      )
    );
  }

  loadNewGrnApprovalConfigByRuleId() {
    this.store.dispatch(
      new GrnApprovalConfigActions.LoadNewGrnApprovalConfigByRuleId()
    );
  }

  updateGrnApprovalConfig(updateGrnApprovalConfig: GrnApprovalConfig) {
    this.store.dispatch(
      new GrnApprovalConfigActions.UpdateGrnApprovalConfig(
        updateGrnApprovalConfig
      )
    );
  }

  searchGrnType(grnType: string) {
    this.store.dispatch(
      new GrnApprovalConfigActions.SearchGrnApprovalConfigByGrnType(grnType)
    );
  }

  loadRoleList() {
    this.store.dispatch(new GrnApprovalConfigActions.LoadRoleList());
  }

  loadReset() {
    this.store.dispatch(new GrnApprovalConfigActions.LoadReset());
  }
}
