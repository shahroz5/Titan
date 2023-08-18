import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as AppVersionDashboardActions from './app-version-dashboard.actions';
import {
  AllAppVersionsList,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  CustomErrors,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { AppVersionDashboardActionTypes } from './app-version-dashboard.actions';
import { AppVersionDashboardState } from './app-version-dashboard.state';
import { AppVersionDashboardService } from '../app-version-dashboard.service';

@Injectable()
export class AppVersionDashboardEffect {
  constructor(
    private service: AppVersionDashboardService,
    private dataPersistence: DataPersistence<AppVersionDashboardState>,
    private loggerService: LoggerService
  ) {}

  @Effect() getAppVersions$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS,
    {
      run: (action: AppVersionDashboardActions.GetAppVersions) => {
        return this.service
          .getAppVersions()
          .pipe(
            map(
              (data: AppVersionsList) =>
                new AppVersionDashboardActions.GetAppVersionsSuccess(data)
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.GetAppVersions,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.GetAppVersionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() listAllApplicationVersions$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.LIST_ALL_APPLICATION_VERSIONS,
    {
      run: (action: AppVersionDashboardActions.ListAllApplicationVersions) => {
        return this.service
          .listAllApplicationVersions()
          .pipe(
            map(
              (data: AllAppVersionsList) =>
                new AppVersionDashboardActions.ListAllApplicationVersionsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.ListAllApplicationVersions,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.ListAllApplicationVersionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getAppVersionsByStatus$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.GET_APPLICATION_VERSIONS_BY_STATUS,
    {
      run: (action: AppVersionDashboardActions.GetAppVersionsByStatus) => {
        return this.service
          .getAppVersionsByStatus(action.payload)
          .pipe(
            map(
              (data: AppVersionDataByStatusResponse) =>
                new AppVersionDashboardActions.GetAppVersionsByStatusSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.GetAppVersionsByStatus,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.GetAppVersionsByStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getStatusList$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.GET_APPVERSION_STATUS_LIST,
    {
      run: (action: AppVersionDashboardActions.GetStatusList) => {
        return this.service
          .getStatusList()
          .pipe(
            map(
              (data: SelectDropDownOption[]) =>
                new AppVersionDashboardActions.GetStatusListSuccess(data)
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.GetStatusList,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.GetStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() addApplicationVersion$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.ADD_APP_VERSION,
    {
      run: (action: AppVersionDashboardActions.AddApplicationVersion) => {
        return this.service
          .addApplicationVersion(action.payload)
          .pipe(
            map(
              (data: any) =>
                new AppVersionDashboardActions.AddApplicationVersionSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.AddApplicationVersion,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.AddApplicationVersionFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() publishAllAppVersions$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.PUBLISH_APP_VERSIONS,
    {
      run: (action: AppVersionDashboardActions.PublishAllAppVersions) => {
        return this.service
          .publishAllAppVersions()
          .pipe(
            map(
              _ => new AppVersionDashboardActions.PublishAllAppVersionsSuccess()
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.PublishAllAppVersions,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.PublishAllAppVersionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() deleteAppVersionById$ = this.dataPersistence.fetch(
    AppVersionDashboardActionTypes.DELETE_APP_VERSION_BY_ID,
    {
      run: (action: AppVersionDashboardActions.DeleteAppVersionById) => {
        return this.service
          .deleteAppVersionById(action.payload)
          .pipe(
            map(
              _ => new AppVersionDashboardActions.DeleteAppVersionByIdSuccess()
            )
          );
      },
      onError: (
        action: AppVersionDashboardActions.DeleteAppVersionById,
        error: HttpErrorResponse
      ) => {
        return new AppVersionDashboardActions.DeleteAppVersionByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
