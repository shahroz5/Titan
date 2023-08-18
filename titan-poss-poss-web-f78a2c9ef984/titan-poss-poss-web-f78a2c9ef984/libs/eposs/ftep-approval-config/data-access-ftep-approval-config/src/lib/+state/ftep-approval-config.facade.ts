import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FtepApprovalConfigState } from './ftep-approval-config.state';
import * as FtepApprovalConfigActions from './ftep-approval-config.actions';
import { ftepApprovalConfigSelectors } from './ftep-approval-config.selectors';
import {
  FtepApprovalConfigListPayload,
  FtepApprovalConfig
} from '@poss-web/shared/models';

@Injectable()
export class FtepApprovalConfigFacade {
  constructor(public store: Store<FtepApprovalConfigState>) {}

  private ftepApprovalConfigList$ = this.store.select(
    ftepApprovalConfigSelectors.selectFtepApprovalConfigList
  );
  private roleList$ = this.store.select(
    ftepApprovalConfigSelectors.selectRoleList
  );
  private ftepApprovalConfig$ = this.store.select(
    ftepApprovalConfigSelectors.selectFtepApprovalConfig
  );

  private error$ = this.store.select(ftepApprovalConfigSelectors.selectError);
  private hasSaved$ = this.store.select(
    ftepApprovalConfigSelectors.selectHassaved
  );
  private hasUpdated$ = this.store.select(
    ftepApprovalConfigSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    ftepApprovalConfigSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    ftepApprovalConfigSelectors.selectTotalElement
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
  getFtepApprovalConfig() {
    return this.ftepApprovalConfig$;
  }
  getFtepApprovalConfigList() {
    return this.ftepApprovalConfigList$;
  }

  getRoleList() {
    return this.roleList$;
  }

  loadFtepApprovalConfigList(
    ftepApprovalConfigListPayload: FtepApprovalConfigListPayload
  ) {
    this.store.dispatch(
      new FtepApprovalConfigActions.LoadFtepApprovalConfigList(
        ftepApprovalConfigListPayload
      )
    );
  }

  saveFtepApprovalConfig(ftepApprovalConfig: FtepApprovalConfig) {
    this.store.dispatch(
      new FtepApprovalConfigActions.SaveFtepApprovalConfig(ftepApprovalConfig)
    );
  }
  loadFtepApprovalConfigByRuleId(ruleId: any, ruleType: string) {
    this.store.dispatch(
      new FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleId(
        ruleId,
        ruleType
      )
    );
  }

  loadNewFtepApprovalConfigByRuleId() {
    this.store.dispatch(
      new FtepApprovalConfigActions.LoadNewFtepApprovalConfigByRuleId()
    );
  }

  updateFtepApprovalConfig(updateFtepApprovalConfig: FtepApprovalConfig) {
    this.store.dispatch(
      new FtepApprovalConfigActions.UpdateFtepApprovalConfig(
        updateFtepApprovalConfig
      )
    );
  }

  searchFtepType(ftepType: string) {
    this.store.dispatch(
      new FtepApprovalConfigActions.SearchFtepApprovalConfigByFtepType(ftepType)
    );
  }

  loadRoleList() {
    this.store.dispatch(new FtepApprovalConfigActions.LoadRoleList());
  }

  loadReset() {
    this.store.dispatch(new FtepApprovalConfigActions.LoadReset());
  }
}
