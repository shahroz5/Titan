import { Injectable } from '@angular/core';

import { CnPriorityConfigActionTypes } from './cn-priority-config.actions';
import * as CnPriorityConfigActions from './cn-priority-config.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CnPriorityConfigService } from '../cn-priority-config.service';
import {
  CustomErrors,
  CnPriorityConfigList,
  CnPriorityConfigResponse,
  CnTypeList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';

@Injectable()
export class CnPriorityConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cnPriorityConfigService: CnPriorityConfigService
  ) {}

  @Effect()
  cnPriorityConfigList$: Observable<Action> = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST,
    {
      run: (action: CnPriorityConfigActions.LoadCnPriorityConfigList) => {
        return this.cnPriorityConfigService
          .getCnPriorityConfigList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (cnPriorityConfiglist: CnPriorityConfigList) =>
                new CnPriorityConfigActions.LoadCnPriorityConfigListSuccess(
                  cnPriorityConfiglist
                )
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.LoadCnPriorityConfigList,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.LoadCnPriorityConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCnPriorityConfig$: Observable<Action> = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG,
    {
      run: (action: CnPriorityConfigActions.SaveCnPriorityConfig) => {
        return this.cnPriorityConfigService
          .saveCnPriorityConfig(action.payload)
          .pipe(
            map(
              (cnPriorityConfigResponse: CnPriorityConfigResponse) =>
                new CnPriorityConfigActions.SaveCnPriorityConfigSuccess(
                  cnPriorityConfigResponse
                )
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.SaveCnPriorityConfig,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.SaveCnPriorityConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCnPriorityConfig$: Observable<Action> = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG,
    {
      run: (action: CnPriorityConfigActions.UpdateCnPriorityConfig) => {
        return this.cnPriorityConfigService
          .updateCnPriorityConfig(action.payload)
          .pipe(
            map(
              (cnPriorityConfigResponse: CnPriorityConfigResponse) =>
                new CnPriorityConfigActions.UpdateCnPriorityConfigSuccess(
                  cnPriorityConfigResponse
                )
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.UpdateCnPriorityConfig,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.UpdateCnPriorityConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME,
    {
      run: (action: CnPriorityConfigActions.SearchConfigByConfigName) => {
        return this.cnPriorityConfigService
          .searchConfigByConfigName(action.payload)
          .pipe(
            map(
              (cnPriorityConfig: CnPriorityConfigList) =>
                new CnPriorityConfigActions.SearchConfigByConfigNameSuccess(
                  cnPriorityConfig
                )
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.SearchConfigByConfigName,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.SearchConfigByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCnPriorityConfigByConfigId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID,
    {
      run: (action: CnPriorityConfigActions.LoadCnPriorityConfigByConfigId) => {
        return this.cnPriorityConfigService
          .getCnPriorityConfig(action.payload)
          .pipe(
            map(
              (cnPriorityConfig: CnPriorityConfigResponse) =>
                new CnPriorityConfigActions.LoadCnPriorityConfigByConfigIdSuccess(
                  cnPriorityConfig
                )
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.LoadCnPriorityConfigByConfigId,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.LoadCnPriorityConfigByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewCnPriorityConfigByConfigId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.LOAD_NEW_CN_PRIORITY_CONFIG_BY_CONFIG_ID,
    {
      run: (
        action: CnPriorityConfigActions.LoadNewCnPriorityConfigByConfigId
      ) => {
        return new CnPriorityConfigActions.LoadCnPriorityConfigByConfigIdSuccess(
          this.cnPriorityConfigService.getNewCnPriorityConfigByConfigId()
        );
      }
    }
  );

  @Effect()
  loadCnTypeList$: Observable<Action> = this.dataPersistence.fetch(
    CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST,
    {
      run: (action: CnPriorityConfigActions.LoadCnTypeList) => {
        return this.cnPriorityConfigService
          .getCreditNoteType()
          .pipe(
            map(
              (cnTypes: CnTypeList[]) =>
                new CnPriorityConfigActions.LoadCnTypeListSuccess(cnTypes)
            )
          );
      },
      onError: (
        action: CnPriorityConfigActions.LoadCnTypeList,
        error: HttpErrorResponse
      ) => {
        return new CnPriorityConfigActions.LoadCnTypeListFailure(
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
