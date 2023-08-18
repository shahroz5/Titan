import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import * as RoleManagementActions from '../+state/role-management.actions';
import { RoleManagementActionTypes } from '../+state/role-management.actions';
import { RoleManagementService } from '../role-management.service';
import { RoleManagementState } from '../+state/role-management.state';
import {
  RoleDetail,
  RoleData,
  CustomErrors,
  RoleTypesData
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class RoleManagementEffect {
  constructor(
    private service: RoleManagementService,
    private dataPersistence: DataPersistence<RoleManagementState>,
    private loggerService: LoggerService
  ) {}

  @Effect() loadRoles$ = this.dataPersistence.fetch(
    RoleManagementActionTypes.LOAD_ROLES,
    {
      run: (action: RoleManagementActions.LoadRoles) => {
        return this.service
          .loadRoles(action.payload)
          .pipe(
            map(
              (roledetails: RoleData) =>
                new RoleManagementActions.LoadRolesSuccess(roledetails)
            )
          );
      },

      onError: (
        action: RoleManagementActions.LoadRoles,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.LoadRolesSuccess({
          roles: [],
          totalRoles: 0
        });
      }
    }
  );

  @Effect() fetchRole$ = this.dataPersistence.fetch(
    RoleManagementActionTypes.FETCH_ROLE,
    {
      run: (action: RoleManagementActions.FetchRole) => {
        return this.service
          .fetchRole(action.payload)
          .pipe(
            map(
              (role: RoleDetail) =>
                new RoleManagementActions.FetchRoleSuccess(role)
            )
          );
      },

      onError: (
        action: RoleManagementActions.FetchRole,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.FetchRoleFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() UpdateRole$ = this.dataPersistence.pessimisticUpdate(
    RoleManagementActionTypes.UPDATE_ROLE,
    {
      run: (action: RoleManagementActions.UpdateRole) => {
        return this.service
          .updateRole(action.payload.roleCode, action.payload.data)
          .pipe(
            map(
              _ =>
                new RoleManagementActions.UpdateRoleSuccess(
                  action.payload.roleCode
                )
            )
          );
      },

      onError: (
        action: RoleManagementActions.UpdateRole,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.UpdateRoleFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() addRole$ = this.dataPersistence.pessimisticUpdate(
    RoleManagementActionTypes.ADD_ROLE,
    {
      run: (action: RoleManagementActions.AddRole) => {
        return this.service
          .addRole(action.payload)
          .pipe(
            map(
              _ =>
                new RoleManagementActions.AddRoleSuccess(
                  action.payload.roleCode
                )
            )
          );
      },

      onError: (
        action: RoleManagementActions.AddRole,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.AddRoleFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() locationformat$ = this.dataPersistence.fetch(
    RoleManagementActionTypes.LOAD_LOCATION_FORMAT,
    {
      run: (action: RoleManagementActions.LoadLocationFormat) => {
        return this.service
          .fetchLocationFormat()
          .pipe(
            map(
              (items: Map<string, string>) =>
                new RoleManagementActions.LoadLocationFormatSuccess(items)
            )
          );
      },
      onError: (
        action: RoleManagementActions.LoadLocationFormat,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.LoadLocationFormatFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRoleTypes$ = this.dataPersistence.fetch(
    RoleManagementActionTypes.LOAD_ROLE_TYPES,
    {
      run: (action: RoleManagementActions.LoadRoleTypes) => {
        return this.service
          .fetchRoletypesList()
          .pipe(
            map(
              (items: RoleTypesData[]) =>
                new RoleManagementActions.LoadRoleTypesSuccess(items)
            )
          );
      },
      onError: (
        action: RoleManagementActions.LoadRoleTypes,
        error: HttpErrorResponse
      ) => {
        return new RoleManagementActions.LoadRoleTypesFailure(
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
