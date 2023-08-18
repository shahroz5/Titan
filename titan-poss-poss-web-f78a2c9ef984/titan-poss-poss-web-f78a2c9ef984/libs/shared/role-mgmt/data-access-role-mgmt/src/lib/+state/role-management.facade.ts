import * as RoleManagementActions from '../+state/role-management.actions';
import { RoleManagementSelectors } from '../+state/role-management.selectors';
import { RolesPage } from '@poss-web/shared/models';
import { RoleManagementState } from './role-management.state';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class RoleManagementFacade {
  private rolesList$ = this.store.select(RoleManagementSelectors.loadRoles);

  private roleTypesList$ = this.store.select(
    RoleManagementSelectors.loadRoleTypes
  );

  private totalRoles$ = this.store.select(RoleManagementSelectors.totalRoles);

  private selectError$ = this.store.select(RoleManagementSelectors.selectError);

  private fetchRole$ = this.store.select(RoleManagementSelectors.fetchRole);

  private isLoading$ = this.store.select(RoleManagementSelectors.isLoading);

  private addUpdateRole$ = this.store.select(
    RoleManagementSelectors.addUpdateRole
  );

  private fetchLocationFormats$ = this.store.select(
    RoleManagementSelectors.fetchLocationFormats
  );

  constructor(private store: Store<RoleManagementState>) {}

  getRolesList = () => this.rolesList$;

  getRoleTypesList = () => this.roleTypesList$;

  getTotalRoles = () => this.totalRoles$;

  fetchRoleDetails = () => this.fetchRole$;

  getAddUpdateRoleStatus = () => this.addUpdateRole$;

  isLoading = () => this.isLoading$;

  getError = () => this.selectError$;

  fetchLocationFormats = () => this.fetchLocationFormats$;

  loadRoles = (rolesPage: RolesPage) =>
    this.store.dispatch(new RoleManagementActions.LoadRoles(rolesPage));

  updateRole = (roleCode: string, data: any) =>
    this.store.dispatch(
      new RoleManagementActions.UpdateRole({ roleCode, data })
    );

  addRole = (data: any) =>
    this.store.dispatch(new RoleManagementActions.AddRole(data));

  clearRole = () =>
    this.store.dispatch(new RoleManagementActions.ClearSearchedRoles());

  fetchRole = (data: string) =>
    this.store.dispatch(new RoleManagementActions.FetchRole(data));

  loadlocationformats = () =>
    this.store.dispatch(new RoleManagementActions.LoadLocationFormat());

  loadRoleTypes = () =>
    this.store.dispatch(new RoleManagementActions.LoadRoleTypes());
}
