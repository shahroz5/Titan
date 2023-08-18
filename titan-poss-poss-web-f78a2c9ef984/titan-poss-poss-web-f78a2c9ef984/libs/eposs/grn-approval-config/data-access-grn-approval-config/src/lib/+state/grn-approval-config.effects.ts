import { Injectable } from '@angular/core';

import { GrnApprovalConfigActionTypes } from './grn-approval-config.actions';
import * as GrnApprovalConfigActions from './grn-approval-config.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { GrnApprovalConfigService } from '../grn-approval-config.service';
import {
  CustomErrors,
  GrnApprovalConfigList,
  GrnApprovalConfigResponse,
  GrnApprovalConfig,
  RoleList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';

@Injectable()
export class GrnApprovalConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private grnApprovalConfigService: GrnApprovalConfigService
  ) {}

  @Effect()
  grnApprovalConfigList$: Observable<Action> = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST,
    {
      run: (action: GrnApprovalConfigActions.LoadGrnApprovalConfigList) => {
        return this.grnApprovalConfigService
          .getGrnApprovalConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.description
          )
          .pipe(
            map(
              (grnapprovalconfiglist: GrnApprovalConfigList) =>
                new GrnApprovalConfigActions.LoadGrnApprovalConfigListSuccess(
                  grnapprovalconfiglist
                )
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.LoadGrnApprovalConfigList,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.LoadGrnApprovalConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGrnApprovalConfig$: Observable<Action> = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG,
    {
      run: (action: GrnApprovalConfigActions.SaveGrnApprovalConfig) => {
        return this.grnApprovalConfigService
          .saveGrnApprovalConfig(action.payload)
          .pipe(
            map(
              (grnApprovalConfigResponse: GrnApprovalConfigResponse) =>
                new GrnApprovalConfigActions.SaveGrnApprovalConfigSuccess(
                  grnApprovalConfigResponse
                )
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.SaveGrnApprovalConfig,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.SaveGrnApprovalConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateGrnApprovalConfig$: Observable<Action> = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG,
    {
      run: (action: GrnApprovalConfigActions.UpdateGrnApprovalConfig) => {
        return this.grnApprovalConfigService
          .updateGrnApprovalConfig(action.payload)
          .pipe(
            map(
              (grnApprovalConfigResponse: GrnApprovalConfigResponse) =>
                new GrnApprovalConfigActions.UpdateGrnApprovalConfigSuccess(
                  grnApprovalConfigResponse
                )
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.UpdateGrnApprovalConfig,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.UpdateGrnApprovalConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchGrnApprovalConfigByGrnType$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE,
    {
      run: (
        action: GrnApprovalConfigActions.SearchGrnApprovalConfigByGrnType
      ) => {
        return this.grnApprovalConfigService
          .searchGrnApprovalConfigByGrnType(action.payload)
          .pipe(
            map(
              (grnApprovalConfigList: GrnApprovalConfigList) =>
                new GrnApprovalConfigActions.SearchGrnApprovalConfigByGrnTypeSuccess(
                  grnApprovalConfigList
                )
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.SearchGrnApprovalConfigByGrnType,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.SearchGrnApprovalConfigByGrnTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadGrnApprovalConfigByRuleId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID,
    {
      run: (action: GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleId) => {
        return this.grnApprovalConfigService
          .getGrnApprovalConfig(action.ruleId, action.ruleType)
          .pipe(
            map(
              (grnApprovalConfig: GrnApprovalConfig) =>
                new GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleIdSuccess(
                  grnApprovalConfig
                )
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleId,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRoleList$: Observable<Action> = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.LOAD_ROLE_LIST,
    {
      run: (action: GrnApprovalConfigActions.LoadRoleList) => {
        return this.grnApprovalConfigService
          .getRoleList()
          .pipe(
            map(
              (roles: RoleList[]) =>
                new GrnApprovalConfigActions.LoadRoleListSuccess(roles)
            )
          );
      },
      onError: (
        action: GrnApprovalConfigActions.LoadRoleList,
        error: HttpErrorResponse
      ) => {
        return new GrnApprovalConfigActions.LoadRoleListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewGrnApprovalConfigByRuleId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GrnApprovalConfigActionTypes.LOAD_NEW_GRN_APPROVAL_CONFIG_BY_RULE_ID,
    {
      run: (
        action: GrnApprovalConfigActions.LoadNewGrnApprovalConfigByRuleId
      ) => {
        return new GrnApprovalConfigActions.LoadGrnApprovalConfigByRuleIdSuccess(
          this.grnApprovalConfigService.getNewGrnApprovalConfigByRuleId()
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
