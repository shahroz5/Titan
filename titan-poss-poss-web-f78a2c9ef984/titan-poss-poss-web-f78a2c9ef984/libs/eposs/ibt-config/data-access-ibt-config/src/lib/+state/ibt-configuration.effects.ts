import { Injectable } from '@angular/core';

import { IbtConfigurationActionTypes } from './ibt-configuration.actions';
import * as IbtConfigurationActions from './ibt-configuration.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { IbtConfigurationService } from '../ibt-configuration.service';
import {
  CustomErrors,
  IbtConfigurationList,
  IbtConfigurationResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';

@Injectable()
export class IbtConfigurationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private ibtConfigurationService: IbtConfigurationService
  ) {}

  @Effect()
  ibtConfigurationList$: Observable<Action> = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST,
    {
      run: (action: IbtConfigurationActions.LoadIbtConfigurationList) => {
        return this.ibtConfigurationService
          .getIbtConfiguratonList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibtconfiglist: IbtConfigurationList) =>
                new IbtConfigurationActions.LoadIbtConfigurationListSuccess(
                  ibtconfiglist
                )
            )
          );
      },
      onError: (
        action: IbtConfigurationActions.LoadIbtConfigurationList,
        error: HttpErrorResponse
      ) => {
        return new IbtConfigurationActions.LoadIbtConfigurationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveIbtConfiguration$: Observable<Action> = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION,
    {
      run: (action: IbtConfigurationActions.SaveIbtConfiguration) => {
        return this.ibtConfigurationService
          .saveIbtConfiguration(action.payload)
          .pipe(
            map(
              (ibtConfigurationResponse: IbtConfigurationResponse) =>
                new IbtConfigurationActions.SaveIbtConfigurationSuccess(
                  ibtConfigurationResponse
                )
            )
          );
      },
      onError: (
        action: IbtConfigurationActions.SaveIbtConfiguration,
        error: HttpErrorResponse
      ) => {
        return new IbtConfigurationActions.SaveIbtConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateIbtConfiguration$: Observable<Action> = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION,
    {
      run: (action: IbtConfigurationActions.UpdateIbtConfiguration) => {
        return this.ibtConfigurationService
          .updateIbtConfiguration(action.payload)
          .pipe(
            map(
              (ibtConfigurationResponse: IbtConfigurationResponse) =>
                new IbtConfigurationActions.UpdateIbtConfigurationSuccess(
                  ibtConfigurationResponse
                )
            )
          );
      },
      onError: (
        action: IbtConfigurationActions.UpdateIbtConfiguration,
        error: HttpErrorResponse
      ) => {
        return new IbtConfigurationActions.UpdateIbtConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchConfigByConfigName$: Observable<Action> = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME,
    {
      run: (action: IbtConfigurationActions.SearchConfigByConfigName) => {
        return this.ibtConfigurationService
          .searchConfigByConfigName(action.payload)
          .pipe(
            map(
              (ibtConfiguration: IbtConfigurationList) =>
                new IbtConfigurationActions.SearchConfigByConfigNameSuccess(
                  ibtConfiguration
                )
            )
          );
      },
      onError: (
        action: IbtConfigurationActions.SearchConfigByConfigName,
        error: HttpErrorResponse
      ) => {
        return new IbtConfigurationActions.SearchConfigByConfigNameFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadIbtConfigurationByConfigId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID,
    {
      run: (action: IbtConfigurationActions.LoadIbtConfigurationByConfigId) => {
        return this.ibtConfigurationService
          .getIbtConfiguration(action.payload)
          .pipe(
            map(
              (ibtConfiguration: IbtConfigurationResponse) =>
                new IbtConfigurationActions.LoadIbtConfigurationByConfigIdSuccess(
                  ibtConfiguration
                )
            )
          );
      },
      onError: (
        action: IbtConfigurationActions.LoadIbtConfigurationByConfigId,
        error: HttpErrorResponse
      ) => {
        return new IbtConfigurationActions.LoadIbtConfigurationByConfigIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewIbtConfigurationsByConfigId$: Observable<
    Action
  > = this.dataPersistence.fetch(
    IbtConfigurationActionTypes.LOAD_NEW_IBT_CONFIGURATION_BY_CONFIG_ID,
    {
      run: (
        action: IbtConfigurationActions.LoadNewIbtConfigurationByConfigId
      ) => {
        return new IbtConfigurationActions.LoadIbtConfigurationByConfigIdSuccess(
          this.ibtConfigurationService.getNewIbtConfigurationByConfigId()
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
