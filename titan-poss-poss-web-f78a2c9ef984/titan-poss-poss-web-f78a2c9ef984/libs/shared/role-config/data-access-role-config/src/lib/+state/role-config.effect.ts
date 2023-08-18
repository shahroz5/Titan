import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as RoleConfigActions from './role-config.actions';
import { RoleConfigActionTypes } from './role-config.actions';
import { RoleConfigService } from '../role-config.service';
import { RoleConfigState } from './role-config.state';
import {
  RoleDetail,
  RoleCountRequestListDetail,
  CustomErrors,
  LoadLocationFormatPayload,
  LocationSummaryList
} from '@poss-web/shared/models';

@Injectable()
export class RoleConfigEffect {
  constructor(
    private service: RoleConfigService,
    private dataPersistence: DataPersistence<RoleConfigState>,
    private loggerService: LoggerService,
    private locationService: LocationDataService
  ) {}

  @Effect() loadRolesforCount$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT,
    {
      run: (action: RoleConfigActions.LoadRolesforCount) => {
        return this.service
          .loadRolesforCount(
            action.payload.isBTQUser,
            action.payload.roleType,
            action.payload.locationCode,
            action.payload.locationFormat
          )
          .pipe(
            map(
              (roles: RoleDetail[]) =>
                new RoleConfigActions.LoadRolesforCountSuccess(roles)
            )
          );
      },

      onError: (
        action: RoleConfigActions.LoadRolesforCount,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.LoadRolesforCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() roleCountChangeRequest$ = this.dataPersistence.pessimisticUpdate(
    RoleConfigActionTypes.CHANGE_ROLE_COUNT,
    {
      run: (action: RoleConfigActions.ChangeRoleCount) => {
        return this.service
          .requestRoleCountChange(
            action.payload.rolesCount,
            action.payload.remarks,
            action.payload.status,
            action.payload.locationCode,
            action.payload.requestId
          )
          .pipe(map(_ => new RoleConfigActions.ChangeRoleCountSuccess()));
      },

      onError: (
        action: RoleConfigActions.ChangeRoleCount,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.ChangeRoleCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRoleCountRequestList$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST,
    {
      run: (action: RoleConfigActions.LoadRoleCountRequestList) => {
        return this.service
          .fetchRoleCountRequestList(
            action.payload.pageNumber,
            action.payload.pageSize,
            action.payload.isBTQUser,
            action.payload.locationCodes,
            action.payload.requestSearch
          )
          .pipe(
            map(
              (roleCountRequestList: RoleCountRequestListDetail) =>
                new RoleConfigActions.LoadRoleCountRequestListSuccess(
                  roleCountRequestList
                )
            )
          );
      },

      onError: (
        action: RoleConfigActions.LoadRoleCountRequestList,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.ClearRoleCountRequestList();
      }
    }
  );

  @Effect() loadRoleRequestCount$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT,
    {
      run: (action: RoleConfigActions.LoadRoleRequestCount) => {
        return this.service
          .fetchRoleRequestCount(
            action.payload.pageNumber,
            action.payload.pageSize
          )
          .pipe(
            map(
              (roleRequestCount: number) =>
                new RoleConfigActions.LoadRoleRequestCountSuccess(
                  roleRequestCount
                )
            )
          );
      },

      onError: (
        action: RoleConfigActions.LoadRoleRequestCount,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.LoadRoleRequestCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRoleCountRequest$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST,
    {
      run: (action: RoleConfigActions.LoadRoleCountRequest) => {
        return this.service
          .fetchRoleCountRequest(
            action.payload.requestId,
            action.payload.isBTQUser
          )
          .pipe(
            map(
              (requestdata: any) =>
                new RoleConfigActions.LoadRoleCountRequestSuccess(requestdata)
            )
          );
      },

      onError: (
        action: RoleConfigActions.LoadRoleCountRequest,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.LoadRoleCountRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() location$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_LOCATION,
    {
      run: (action: RoleConfigActions.LoadLocation) => {
        return this.locationService
          .getLocationSummaryList({}, false)
          .pipe(
            map(
              (items: LocationSummaryList[]) =>
                new RoleConfigActions.LoadLocationSuccess(items)
            )
          );
      },
      onError: (
        action: RoleConfigActions.LoadLocation,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.LoadLocationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() locationformat$ = this.dataPersistence.fetch(
    RoleConfigActionTypes.LOAD_LOCATION_FORMAT,
    {
      run: (action: RoleConfigActions.LoadLocationFormat) => {
        return this.service
          .fetchLocationFormat()
          .pipe(
            map(
              (items: LoadLocationFormatPayload[]) =>
                new RoleConfigActions.LoadLocationFormatSuccess(items)
            )
          );
      },
      onError: (
        action: RoleConfigActions.LoadLocationFormat,
        error: HttpErrorResponse
      ) => {
        return new RoleConfigActions.LoadLocationFormatFailure(
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
