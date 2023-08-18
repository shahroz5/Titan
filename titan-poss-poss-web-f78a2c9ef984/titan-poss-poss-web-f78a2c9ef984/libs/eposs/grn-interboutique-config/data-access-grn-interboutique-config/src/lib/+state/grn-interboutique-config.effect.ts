import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as GrnInterboutiqueConfigActions from './grn-interboutique-config.actions';
import { CustomErrors, GrnInterboutiqueConfig } from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GrnInterboutiqueConfigService } from '../grn-interboutique-config.service';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';

@Injectable()
export class GrnInterboutiqueConfigEffect {
  constructor(
    private dataPersistence: DataPersistence<GrnInterboutiqueConfigState>,
    private loggerService: LoggerService,
    private grnInterboutiqueConfigService: GrnInterboutiqueConfigService
  ) {}

  @Effect()
  loadGrnInterboutiqueConfig$ = this.dataPersistence.fetch(
    GrnInterboutiqueConfigActions.GrnInterboutiqueConfigActionTypes
      .LOAD_GRN_INTERBOUTIQUE_CONFIG,
    {
      run: (
        action: GrnInterboutiqueConfigActions.LoadGrnInterboutiqueConfig
      ) => {
        return this.grnInterboutiqueConfigService
          .getGrnInterboutiqueConfigDetails(action.payload)
          .pipe(
            map(
              (data: GrnInterboutiqueConfig) =>
                new GrnInterboutiqueConfigActions.LoadGrnInterboutiqueConfigSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: GrnInterboutiqueConfigActions.LoadGrnInterboutiqueConfig,
        error: HttpErrorResponse
      ) => {
        return new GrnInterboutiqueConfigActions.LoadGrnInterboutiqueConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addNewGrnInterboutiqueConfig$ = this.dataPersistence.fetch(
    GrnInterboutiqueConfigActions.GrnInterboutiqueConfigActionTypes
      .ADDNEW_GRN_INTERBOUTIQUE_CONFIG,
    {
      run: (
        action: GrnInterboutiqueConfigActions.AddNewGrnInterboutiqueConfig
      ) => {
        return this.grnInterboutiqueConfigService
          .addNewGrnInterboutiqueConfigDetails(action.payload)
          .pipe(
            map(
              (data: GrnInterboutiqueConfig) =>
                new GrnInterboutiqueConfigActions.AddNewGrnInterboutiqueConfigSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: GrnInterboutiqueConfigActions.AddNewGrnInterboutiqueConfig,
        error: HttpErrorResponse
      ) => {
        return new GrnInterboutiqueConfigActions.AddNewGrnInterboutiqueConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editGrnInterboutiqueConfig$ = this.dataPersistence.fetch(
    GrnInterboutiqueConfigActions.GrnInterboutiqueConfigActionTypes
      .EDIT_GRN_INTERBOUTIQUE_CONFIG,
    {
      run: (
        action: GrnInterboutiqueConfigActions.EditGrnInterboutiqueConfig
      ) => {
        return this.grnInterboutiqueConfigService
          .editGrnInterboutiqueConfigDetails(
            action.payload.ruleId,
            action.payload.grnInterboutiqueConfig
          )
          .pipe(
            map(
              (data: GrnInterboutiqueConfig) =>
                new GrnInterboutiqueConfigActions.EditGrnInterboutiqueConfigSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: GrnInterboutiqueConfigActions.EditGrnInterboutiqueConfig,
        error: HttpErrorResponse
      ) => {
        return new GrnInterboutiqueConfigActions.EditGrnInterboutiqueConfigFailure(
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
