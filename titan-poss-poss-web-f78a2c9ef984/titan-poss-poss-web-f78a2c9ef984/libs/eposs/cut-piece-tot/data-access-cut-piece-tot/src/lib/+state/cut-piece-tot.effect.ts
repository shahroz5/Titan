import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CutPieceTotActions from './cut-piece-tot.actions';
import { CustomErrors, CutPieceTot } from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CutPieceTotService } from '../cut-piece-tot.service';

@Injectable()
export class CutPieceTotEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cutPieceTotService: CutPieceTotService
  ) {}

  @Effect()
  loadCutPieceTot$ = this.dataPersistence.fetch(
    CutPieceTotActions.CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT,
    {
      run: (action: CutPieceTotActions.LoadCutPieceTot) => {
        return this.cutPieceTotService
          .getCutPieceTotDetails()
          .pipe(
            map(
              (result: CutPieceTot[]) =>
                new CutPieceTotActions.LoadCutPieceTotSuccess(result)
            )
          );
      },
      onError: (
        action: CutPieceTotActions.LoadCutPieceTot,
        error: HttpErrorResponse
      ) => {
        return new CutPieceTotActions.LoadCutPieceTotFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCutPieceTot$ = this.dataPersistence.fetch(
    CutPieceTotActions.CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT,
    {
      run: (action: CutPieceTotActions.UpdateCutPieceTot) => {
        return this.cutPieceTotService
          .editCashPaymentConfigurationDetails(
            action.payload.configId,
            action.payload.cutPieceTot
          )
          .pipe(
            map(
              (result: CutPieceTot) =>
                new CutPieceTotActions.UpdateCutPieceTotSuccess(result)
            )
          );
      },
      onError: (
        action: CutPieceTotActions.UpdateCutPieceTot,
        error: HttpErrorResponse
      ) => {
        return new CutPieceTotActions.UpdateCutPieceTotFailure(
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
