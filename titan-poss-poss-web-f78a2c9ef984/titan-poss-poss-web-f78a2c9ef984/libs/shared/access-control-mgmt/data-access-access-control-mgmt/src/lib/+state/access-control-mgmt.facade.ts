import { AccessControlManagementSelectors } from './access-control-mgmt.selectors';
import * as AccessControlManagementActions from './access-control-mgmt.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccessControlManagementState } from './access-control-mgmt.state';
import { ACLLoadRequest, ACLUpdateRequest } from '@poss-web/shared/models';

@Injectable()
export class AccessControlManagementFacade {
  private rolesList$ = this.store.select(
    AccessControlManagementSelectors.selectRoles
  );

  private modulesList$ = this.store.select(
    AccessControlManagementSelectors.selectModules
  );

  private subModulesList$ = this.store.select(
    AccessControlManagementSelectors.selectSubModules
  );

  private features$ = this.store.select(
    AccessControlManagementSelectors.selectFeatures
  );

  private aclList$ = this.store.select(
    AccessControlManagementSelectors.selectACL
  );

  private isLoading$ = this.store.select(
    AccessControlManagementSelectors.selectIsLoading
  );

  private error$ = this.store.select(
    AccessControlManagementSelectors.selectError
  );

  private isACLUpdateSuccess$ = this.store.select(
    AccessControlManagementSelectors.selectIsACLUpdateSuccess
  );

  constructor(private store: Store<AccessControlManagementState>) {}

  getError() {
    return this.error$;
  }
  getIsACLUpdateSuccess() {
    return this.isACLUpdateSuccess$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getRolesList() {
    return this.rolesList$;
  }

  getModulesList() {
    return this.modulesList$;
  }

  getSubModulesList() {
    return this.subModulesList$;
  }

  getFeatures() {
    return this.features$;
  }
  getACLList() {
    return this.aclList$;
  }

  resetError() {
    this.store.dispatch(new AccessControlManagementActions.ResetError());
  }

  loadRoles = () =>
    this.store.dispatch(new AccessControlManagementActions.LoadRoles());

  loadModules = (role: string) =>
    this.store.dispatch(new AccessControlManagementActions.LoadModules(role));

  loadSubModules = (groupCode: string, role: string) =>
    this.store.dispatch(
      new AccessControlManagementActions.LoadSubModules({ groupCode, role })
    );

  loadFeatures = (groupCode: string, role: string) =>
    this.store.dispatch(
      new AccessControlManagementActions.LoadFeatures({ groupCode, role })
    );

  loadACL = (data: ACLLoadRequest) =>
    this.store.dispatch(new AccessControlManagementActions.LoadAcl(data));

  updateAcl = (data: ACLUpdateRequest) => {
    this.store.dispatch(new AccessControlManagementActions.UpdateAcl(data));
  };
  clearACL = () =>
    this.store.dispatch(new AccessControlManagementActions.ClearAcl());
}
