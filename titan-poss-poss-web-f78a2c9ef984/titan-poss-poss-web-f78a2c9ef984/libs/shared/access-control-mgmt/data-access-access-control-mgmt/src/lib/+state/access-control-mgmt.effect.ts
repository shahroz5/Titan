import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { AccessControlManagementState } from './access-control-mgmt.state';
import { AccessControlManagementActionTypes } from './access-control-mgmt.actions';
import * as AccessControlManagementActions from './access-control-mgmt.actions';
import {
  CustomErrors,
  ACLModuleDetails,
  ACLDetails,
  ACLRole
} from '@poss-web/shared/models';
import { AccessControlManagementService } from '../access-control-mgmt.service';

@Injectable()
export class AccessControlManagementEffect {
  constructor(
    private service: AccessControlManagementService,
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<AccessControlManagementState>
  ) {}

  @Effect() loadRoles$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.LOAD_ROLES,
    {
      run: (action: AccessControlManagementActions.LoadRoles) => {
        return this.service
          .loadRoles()
          .pipe(
            map(
              (roles: ACLRole[]) =>
                new AccessControlManagementActions.LoadRolesSuccess(roles)
            )
          );
      },

      onError: (
        action: AccessControlManagementActions.LoadRoles,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.LoadRolesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadModules$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.LOAD_MODULES,
    {
      run: (action: AccessControlManagementActions.LoadModules) => {
        return this.service
          .loadModules(action.payload)
          .pipe(
            map(
              (modules: ACLModuleDetails[]) =>
                new AccessControlManagementActions.LoadModulesSuccess(modules)
            )
          );
      },

      onError: (
        action: AccessControlManagementActions.LoadModules,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.LoadModulesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSubModules$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.LOAD_SUB_MODULES,
    {
      run: (action: AccessControlManagementActions.LoadSubModules) => {
        return this.service
          .loadSubModules(action.payload.groupCode, action.payload.role)
          .pipe(
            map(
              (submodules: ACLModuleDetails[]) =>
                new AccessControlManagementActions.LoadSubModulesSuccess(
                  submodules
                )
            )
          );
      },

      onError: (
        action: AccessControlManagementActions.LoadSubModules,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.LoadSubModulesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFeatures$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.LOAD_FEATURES,
    {
      run: (action: AccessControlManagementActions.LoadFeatures) => {
        return this.service
          .loadSubModules(action.payload.groupCode, action.payload.role)
          .pipe(
            map(
              (features: ACLModuleDetails[]) =>
                new AccessControlManagementActions.LoadFeaturesSuccess(features)
            )
          );
      },

      onError: (
        action: AccessControlManagementActions.LoadFeatures,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.LoadFeaturesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadACL$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.LOAD_ACL,
    {
      run: (action: AccessControlManagementActions.LoadAcl) => {
        return this.service
          .loadACL(action.payload.aclGroupCode, action.payload.roleCode)
          .pipe(
            map(
              (acl: ACLDetails[]) =>
                new AccessControlManagementActions.LoadAclSuccess(acl)
            )
          );
      },

      onError: (
        action: AccessControlManagementActions.LoadAcl,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.LoadAclFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateACL$ = this.dataPersistence.fetch(
    AccessControlManagementActionTypes.UPDATE_ACL,
    {
      run: (action: AccessControlManagementActions.UpdateAcl) => {
        return this.service
          .updateACL(
            action.payload.roleCode,
            action.payload.addedAclCodes,
            action.payload.removedAclCodes
          )
          .pipe(
            map(() => new AccessControlManagementActions.UpdateAclSuccess())
          );
      },

      onError: (
        action: AccessControlManagementActions.UpdateAcl,
        error: HttpErrorResponse
      ) => {
        return new AccessControlManagementActions.UpdateAclFailure(
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
