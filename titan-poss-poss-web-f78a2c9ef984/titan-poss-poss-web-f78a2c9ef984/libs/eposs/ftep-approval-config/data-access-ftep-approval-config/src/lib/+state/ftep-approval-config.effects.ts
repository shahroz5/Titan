import { Injectable } from '@angular/core';

import { FtepApprovalConfigActionTypes } from './ftep-approval-config.actions';
import * as FtepApprovalConfigActions from './ftep-approval-config.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FtepApprovalConfigService } from '../ftep-approval-config.service';
import {
  CustomErrors,
  FtepApprovalConfigList,
  FtepApprovalConfigResponse,
  FtepApprovalConfig,
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
export class FtepApprovalConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private ftepApprovalConfigService: FtepApprovalConfigService
  ) {}

  @Effect()
  ftepApprovalConfigList$: Observable<Action> = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST,
    {
      run: (action: FtepApprovalConfigActions.LoadFtepApprovalConfigList) => {
        return this.ftepApprovalConfigService
          .getFtepApprovalConfigList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ftepapprovalconfiglist: FtepApprovalConfigList) =>
                new FtepApprovalConfigActions.LoadFtepApprovalConfigListSuccess(
                  ftepapprovalconfiglist
                )
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.LoadFtepApprovalConfigList,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.LoadFtepApprovalConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveFtepApprovalConfig$: Observable<Action> = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG,
    {
      run: (action: FtepApprovalConfigActions.SaveFtepApprovalConfig) => {
        return this.ftepApprovalConfigService
          .saveFtepApprovalConfig(action.payload)
          .pipe(
            map(
              (ftepApprovalConfigResponse: FtepApprovalConfigResponse) =>
                new FtepApprovalConfigActions.SaveFtepApprovalConfigSuccess(
                  ftepApprovalConfigResponse
                )
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.SaveFtepApprovalConfig,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.SaveFtepApprovalConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateFtepApprovalConfig$: Observable<Action> = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG,
    {
      run: (action: FtepApprovalConfigActions.UpdateFtepApprovalConfig) => {
        return this.ftepApprovalConfigService
          .updateFtepApprovalConfig(action.payload)
          .pipe(
            map(
              (ftepApprovalConfigResponse: FtepApprovalConfigResponse) =>
                new FtepApprovalConfigActions.UpdateFtepApprovalConfigSuccess(
                  ftepApprovalConfigResponse
                )
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.UpdateFtepApprovalConfig,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.UpdateFtepApprovalConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchFtepApprovalConfigByFtepType$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE,
    {
      run: (
        action: FtepApprovalConfigActions.SearchFtepApprovalConfigByFtepType
      ) => {
        return this.ftepApprovalConfigService
          .searchFtepApprovalConfigByFtepType(action.payload)
          .pipe(
            map(
              (ftepApprovalConfigList: FtepApprovalConfigList) =>
                new FtepApprovalConfigActions.SearchFtepApprovalConfigByFtepTypeSuccess(
                  ftepApprovalConfigList
                )
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.SearchFtepApprovalConfigByFtepType,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.SearchFtepApprovalConfigByFtepTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadFtepApprovalConfigByRuleId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID,
    {
      run: (
        action: FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleId
      ) => {
        return this.ftepApprovalConfigService
          .getFtepApprovalConfig(action.ruleId, action.ruleType)
          .pipe(
            map(
              (ftepApprovalConfig: FtepApprovalConfig) =>
                new FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleIdSuccess(
                  ftepApprovalConfig
                )
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleId,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRoleList$: Observable<Action> = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.LOAD_ROLE_LIST,
    {
      run: (action: FtepApprovalConfigActions.LoadRoleList) => {
        return this.ftepApprovalConfigService
          .getRoleList()
          .pipe(
            map(
              (roles: RoleList[]) =>
                new FtepApprovalConfigActions.LoadRoleListSuccess(roles)
            )
          );
      },
      onError: (
        action: FtepApprovalConfigActions.LoadRoleList,
        error: HttpErrorResponse
      ) => {
        return new FtepApprovalConfigActions.LoadRoleListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewFtepApprovalConfigByRuleId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    FtepApprovalConfigActionTypes.LOAD_NEW_FTEP_APPROVAL_CONFIG_BY_RULE_ID,
    {
      run: (
        action: FtepApprovalConfigActions.LoadNewFtepApprovalConfigByRuleId
      ) => {
        return new FtepApprovalConfigActions.LoadFtepApprovalConfigByRuleIdSuccess(
          this.ftepApprovalConfigService.getNewFtepApprovalConfigByRuleId()
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
