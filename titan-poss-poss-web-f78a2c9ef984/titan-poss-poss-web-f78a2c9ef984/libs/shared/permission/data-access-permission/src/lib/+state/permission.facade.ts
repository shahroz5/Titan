import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AclUrlPermissionRequestBody } from '@poss-web/shared/models';
import * as PermissionActions from './permission.actions';
import { PermissionSelectors } from './permission.selectors';
import { PermissionState } from './permission.state';

@Injectable()
export class PermissionFacade {
  private selectError$ = this.store.select(PermissionSelectors.selectError);
  private selectIsLoading$ = this.store.select(
    PermissionSelectors.selectIsLoading
  );

  getPermissionforURL$ = () =>
    this.store.select(PermissionSelectors.fetchPermissionforURL); 

  getURLPermission$ = () =>
    this.store.select(PermissionSelectors.fetchURLPermission);

  getAllowedRoutes$ = () =>
    this.store.select(PermissionSelectors.fetchChildRoutes);

  constructor(private store: Store<PermissionState>) {}

  getPermissionforURL = () => this.getPermissionforURL$();

  getURLPermission = () => this.getURLPermission$();

  getAllowedRoutes = () => this.getAllowedRoutes$();

  getError() {
    return this.selectError$;
  }
  isLoading() {
    return this.selectIsLoading$;
  }
  loadUrlLevelPermissions = (requestBody: AclUrlPermissionRequestBody) =>
    this.store.dispatch(new PermissionActions.LoadUrlPermissions(requestBody));

  loadElementLevelPermissionForURL = (url: string) => {
    this.store.dispatch(
      new PermissionActions.LoadElementPermissionsForUrl(url)
    );
  };

  loadUrlSuggestion = (url: string) =>
    this.store.dispatch(new PermissionActions.LoadUrlSuggestion(url));
}
