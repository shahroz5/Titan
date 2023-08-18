import {
  AddVersionRequestModel,
  AppVersionByStatusRequestPayloadWithQueryParams,
} from '@poss-web/shared/models';
import * as AppVersionDashboardAction from './app-version-dashboard.actions';
import { AppVersionDashboardSelectors } from './app-version-dashboard.selectors';
import { AppVersionDashboardState } from './app-version-dashboard.state';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class AppVersionDashboardFacade {
  private isLoading$ = this.store.select(
    AppVersionDashboardSelectors.isLoading
  );
  private selectError$ = this.store.select(
    AppVersionDashboardSelectors.selectError
  );
  private getAppVersionData$ = this.store.select(
    AppVersionDashboardSelectors.appVersions
  );
  private possUiVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.possUiVersionsList
  );
  private apiVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.apiVersionsList
  );
  private dbVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.dbVersionsList
  );
  private appVersionDataByStatus$ = this.store.select(
    AppVersionDashboardSelectors.appVersionDataByStatus
  );
  private appVersionListCount$ = this.store.select(
    AppVersionDashboardSelectors.appVersionListCount
  );
  private isNewAppVersionAdded$ = this.store.select(
    AppVersionDashboardSelectors.isNewAppVersionAdded
  );
  private appVersionStatusList$ = this.store.select(
    AppVersionDashboardSelectors.appVersionStatusList
  );
  private isAppVersionsPublished$ = this.store.select(
    AppVersionDashboardSelectors.isAppVersionsPublished
  );
  private isAppVersionDeleted$ = this.store.select(
    AppVersionDashboardSelectors.isAppVersionDeleted
  );
  private allPossUiVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.allPossUiVersionsList
  );
  private allEpossUiVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.allEpossUiVersionsList
  );
  private allApiVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.allApiVersionsList
  );
  private allDbVersionsList$ = this.store.select(
    AppVersionDashboardSelectors.allDbVersionsList
  );

  constructor(private store: Store<AppVersionDashboardState>) {}

  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.selectError$;
  }
  getAppVersionData() {
    return this.getAppVersionData$;
  }
  getPossUiVersionsList() {
    return this.possUiVersionsList$;
  }
  getApiVersionsList() {
    return this.apiVersionsList$;
  }
  getDbVersionsList() {
    return this.dbVersionsList$;
  }
  getAppVersionDataByStatus() {
    return this.appVersionDataByStatus$;
  }
  getAppVersionListCount() {
    return this.appVersionListCount$;
  }

  getIsNewAppVersionAdded() {
    return this.isNewAppVersionAdded$;
  }
  getAppVersionStatusList() {
    return this.appVersionStatusList$;
  }
  getIsAppVersionsPublished() {
    return this.isAppVersionsPublished$;
  }
  getIsAppVersionDeleted() {
    return this.isAppVersionDeleted$;
  }
  getAllPossUiVersionsList() {
    return this.allPossUiVersionsList$;
  }
  getAllApiVersionsList() {
    return this.allApiVersionsList$;
  }
  getAllDbVersionsList() {
    return this.allDbVersionsList$;
  }

  //Below Actions
  loadApplicationVersions() {
    this.store.dispatch(new AppVersionDashboardAction.GetAppVersions());
  }
  loadAllApplicationVersionsList() {
    this.store.dispatch(
      new AppVersionDashboardAction.ListAllApplicationVersions()
    );
  }
  loadAllApplicationVersionsByStatus(
    request: AppVersionByStatusRequestPayloadWithQueryParams
  ) {
    this.store.dispatch(
      new AppVersionDashboardAction.GetAppVersionsByStatus(request)
    );
  }
  loadStatusList() {
    this.store.dispatch(new AppVersionDashboardAction.GetStatusList());
  }
  addApplicationVersion = (requestPayload: AddVersionRequestModel) =>
    this.store.dispatch(
      new AppVersionDashboardAction.AddApplicationVersion(requestPayload)
    );
  publishAllAppVersions() {
    this.store.dispatch(new AppVersionDashboardAction.PublishAllAppVersions());
  }
  deleteAppVersionById(appVersionId: number) {
    this.store.dispatch(
      new AppVersionDashboardAction.DeleteAppVersionById(appVersionId)
    );
  }
  resetState() {
    this.store.dispatch(new AppVersionDashboardAction.Reset());
  }
}
