import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PurityActionTypes } from './purity.actions';
import * as PurityActions from './purity.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PurityService } from '../purity.service';
import {
  PurityListResult,
  MaterialType,
  Purity,
  CustomErrors
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

@Injectable()
export class PurityEffects {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public purityService: PurityService,
    public loggerService: LoggerService
  ) { }

  @Effect()
  loadPurityList$ = this.dataPersistence.fetch(
    PurityActionTypes.LOAD_PURITY_LISTING,
    {
      run: (action: PurityActions.LoadPurityList) => {
        return this.purityService
          .getPurityList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.searchValue
          )
          .pipe(
            map(
              (purityListResult: PurityListResult) =>
                new PurityActions.LoadPurityListSuccess(purityListResult)
            )
          );
      },
      onError: (
        action: PurityActions.LoadPurityList,
        error: HttpErrorResponse
      ) => {
        return new PurityActions.LoadPurityListFailure(
          this.errorHandler(error)
        );
      }
    }
  );



  @Effect() loadMetalTypes$ = this.dataPersistence.fetch(
    PurityActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: PurityActions.LoadMetalTypes) => {
        return this.purityService
          .loadMetalTypes()
          .pipe(
            map(
              (metalType: MaterialType[]) =>
                new PurityActions.LoadMetalTypesSuccess(metalType)
            )
          );
      },
      onError: (
        action: PurityActions.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new PurityActions.LoadMetalTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadPurityByMaterialCode$ = this.dataPersistence.fetch(
    PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY,
    {
      run: (action: PurityActions.LoadPurityByMaterialCodeAndPurity) => {
        return this.purityService
          .loadPurityByMaterialCodeAndPurity(
            action.payload.materialCode,
            action.payload.purity
          )
          .pipe(
            map(
              (purity: Purity[]) =>
                new PurityActions.LoadPurityByMaterialCodeAndPuritySuccess(
                  purity
                )
            )
          );
      },
      onError: (
        action: PurityActions.LoadPurityByMaterialCodeAndPurity,
        error: HttpErrorResponse
      ) => {
        return new PurityActions.LoadPurityByMaterialCodeAndPurityFailure(
          this.errorHandler(error)
        );
      }
    }
  );



  @Effect() updatePurityDetails$ = this.dataPersistence.pessimisticUpdate(
    PurityActionTypes.UPDATE_PURITY_DETAIL,
    {
      run: (action: PurityActions.UpdatePurity) => {
        return this.purityService
          .updatePurity(action.payload)
          .pipe(map(() => new PurityActions.UpdatePuritySuccess()));
      },
      onError: (
        action: PurityActions.UpdatePurity,
        error: HttpErrorResponse
      ) => {
        return new PurityActions.UpdatePurityFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() savePurity$ = this.dataPersistence.fetch(
    PurityActionTypes.CREATE_PURITY,
    {
      run: (action: PurityActions.CreatePurity) => {
        return this.purityService
          .savePurity(action.payload)
          .pipe(map(() => new PurityActions.CreatePuritySuccess()));
      },
      onError: (
        action: PurityActions.CreatePurity,
        error: HttpErrorResponse
      ) => {
        return new PurityActions.CreatePurityFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
