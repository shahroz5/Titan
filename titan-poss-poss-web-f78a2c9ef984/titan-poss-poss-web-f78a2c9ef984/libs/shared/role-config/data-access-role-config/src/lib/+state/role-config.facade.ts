import * as RoleConfigActions from './role-config.actions';
import { RoleConfigSelectors } from './role-config.selectors';
import { RoleCountRequest } from '@poss-web/shared/models';
import { RoleConfigState } from './role-config.state';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class RoleConfigFacade {
  private rolesList$ = this.store.select(RoleConfigSelectors.loadRoles);

  private selectError$ = this.store.select(RoleConfigSelectors.selectError);

  private fetchRequestedRoles$ = this.store.select(
    RoleConfigSelectors.fetchRequestedRoles
  );

  private roleCountChanged$ = this.store.select(
    RoleConfigSelectors.roleCountChanged
  );

  private fetchRoleCountRequestList$ = this.store.select(
    RoleConfigSelectors.fetchRoleCountRequestList
  );

  private fetchRoleCountRequestListLength$ = this.store.select(
    RoleConfigSelectors.fetchRoleCountRequestListLength
  );

  private fetchLocations$ = this.store.select(
    RoleConfigSelectors.fetchLocations
  );

  private fetchLocationFormats$ = this.store.select(
    RoleConfigSelectors.fetchLocationFormats
  );

  private isLoading$ = this.store.select(RoleConfigSelectors.isLoading);

  private getRoleCountRequest$ = this.store.select(
    RoleConfigSelectors.fetchRoleCountRequest
  );

  constructor(private store: Store<RoleConfigState>) {}

  getRolesList() {
    return this.rolesList$;
  }

  getRequestedRoles() {
    return this.fetchRequestedRoles$;
  }

  getRoleCountRequest() {
    return this.getRoleCountRequest$;
  }

  fetchRoleCountRequestList() {
    return this.fetchRoleCountRequestList$;
  }

  fetchRoleCountRequestListLength() {
    return this.fetchRoleCountRequestListLength$;
  }

  fetchLocations() {
    return this.fetchLocations$;
  }

  fetchLocationFormats() {
    return this.fetchLocationFormats$;
  }

  isLoading() {
    return this.isLoading$;
  }

  isRoleCountChanged() {
    return this.roleCountChanged$;
  }

  getError() {
    return this.selectError$;
  }

  loadRolesforCount = (
    isBTQUser: boolean,
    roleType?: string,
    locationCode?: string,
    locationFormat?: string
  ) =>
    this.store.dispatch(
      new RoleConfigActions.LoadRolesforCount({
        isBTQUser,
        roleType,
        locationCode,
        locationFormat
      })
    );

  requestRoleCountChange = (
    rolesCount?: RoleCountRequest[],
    remarks?: string,
    status?: string,
    locationCode?: string,
    requestId?: string
  ) =>
    this.store.dispatch(
      new RoleConfigActions.ChangeRoleCount({
        remarks,
        rolesCount,
        locationCode,
        requestId,
        status
      })
    );

  roleCountRequestList = (data: {
    pageNumber: number;
    pageSize: number;
    isBTQUser: boolean;
    locationCodes: string[];
    requestSearch: string;
  }) =>
    this.store.dispatch(new RoleConfigActions.LoadRoleCountRequestList(data));

  resetRoleCountRequestList = () =>
    this.store.dispatch(new RoleConfigActions.ResetRoleCountRequestList());

  loadRoleCountRequest = (requestId: string, isBTQUser: boolean) =>
    this.store.dispatch(
      new RoleConfigActions.LoadRoleCountRequest({
        requestId,
        isBTQUser
      })
    );

  clearRoleCountRequestList = () =>
    this.store.dispatch(new RoleConfigActions.ClearRoleCountRequestList());

  loadRoleRequestCount = () =>
    this.store.dispatch(
      new RoleConfigActions.LoadRoleRequestCount({
        pageNumber: 0,
        pageSize: 4
      })
    );

  loadlocations = () =>
    this.store.dispatch(new RoleConfigActions.LoadLocation());

  loadlocationformats = () =>
    this.store.dispatch(new RoleConfigActions.LoadLocationFormat());
}
