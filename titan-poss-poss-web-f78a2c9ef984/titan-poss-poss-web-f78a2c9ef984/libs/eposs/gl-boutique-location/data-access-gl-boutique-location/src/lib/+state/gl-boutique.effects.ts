import { DataPersistence } from '@nrwl/angular';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  GlBoutiqueLocationSuccessPayload,
  GlBoutiqueLocationList
} from '@poss-web/shared/models';
import * as GlBoutiqueLocationActions from './gl-botique.action';
import { GlBoutiqueLocationService } from '../gl-boutique-location.service';
@Injectable()
export class GlBoutiqueLocationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private glBoutiqueLocationService: GlBoutiqueLocationService
  ) {}

  @Effect()
  loadGlBoutiqueDetails$ = this.dataPersistence.fetch(
    GlBoutiqueLocationActions.GlBoutiqueLocationActionTypes
      .LOAD_GL_BTQ_LOCATION_LIST,
    {
      run: (action: GlBoutiqueLocationActions.LoadGlBoutiqueList) => {
        return this.glBoutiqueLocationService
          .getGlBoutiqueLocationList(action.payload)
          .pipe(
            map(
              (glBoutiqueLocationList: GlBoutiqueLocationSuccessPayload) =>
                new GlBoutiqueLocationActions.LoadGlBoutiqueListSuccess(
                  glBoutiqueLocationList
                )
            )
          );
      },
      onError: (
        action: GlBoutiqueLocationActions.LoadGlBoutiqueList,
        error: HttpErrorResponse
      ) => {
        return new GlBoutiqueLocationActions.LoadGlBoutiqueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGlBoutiqueDetailsBylocationCode$ = this.dataPersistence.fetch(
    GlBoutiqueLocationActions.GlBoutiqueLocationActionTypes
      .LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE,
    {
      run: (
        action: GlBoutiqueLocationActions.LoadGlBoutiqueListByLocationCode
      ) => {
        return this.glBoutiqueLocationService
          .getGlBoutiqueLocationDetailsByLocationCode(action.payload)
          .pipe(
            map(
              (glBoutiqueLocation: GlBoutiqueLocationList) =>
                new GlBoutiqueLocationActions.LoadGlBoutiqueListByLocationCodeSuccess(
                  glBoutiqueLocation
                )
            )
          );
      },
      onError: (
        action: GlBoutiqueLocationActions.LoadGlBoutiqueListByLocationCode,
        error: HttpErrorResponse
      ) => {
        return new GlBoutiqueLocationActions.LoadGlBoutiqueListByLocationCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGlBoutiqueFormDetails$ = this.dataPersistence.pessimisticUpdate(
    GlBoutiqueLocationActions.GlBoutiqueLocationActionTypes
      .SAVE_GL_BTQ_LOCATION_DETAILS,
    {
      run: (action: GlBoutiqueLocationActions.SaveGlBoutqueLocationDetails) => {
        return this.glBoutiqueLocationService
          .saveGlBoutiqueLocationDetails(action.payload)
          .pipe(
            map((saveData: GlBoutiqueLocationList) => {
              return new GlBoutiqueLocationActions.SaveGlBoutqueLocationDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: GlBoutiqueLocationActions.SaveGlBoutqueLocationDetails,
        error: HttpErrorResponse
      ) => {
        return new GlBoutiqueLocationActions.SaveGlBoutqueLocationDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editGlBoutiqueDetails$ = this.dataPersistence.pessimisticUpdate(
    GlBoutiqueLocationActions.GlBoutiqueLocationActionTypes
      .EDIT_GL_BTQ_LOCATION_DETAILS,
    {
      run: (action: GlBoutiqueLocationActions.EditGlBoutqueLocationDetails) => {
        return this.glBoutiqueLocationService
          .editGlBoutiqueLocationDetails(action.payload)
          .pipe(
            map((saveData: GlBoutiqueLocationList) => {
              return new GlBoutiqueLocationActions.EditGlBoutqueLocationDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: GlBoutiqueLocationActions.EditGlBoutqueLocationDetails,
        error: HttpErrorResponse
      ) => {
        return new GlBoutiqueLocationActions.EditGlBoutqueLocationDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchGlBoutiqueDetails$ = this.dataPersistence.fetch(
    GlBoutiqueLocationActions.GlBoutiqueLocationActionTypes
      .SEARCH_BY_LOCATION_CODE,
    {
      run: (action: GlBoutiqueLocationActions.SearchByLocationCode) => {
        return this.glBoutiqueLocationService
          .getGlBoutiqueLocationSearchResult(action.payload)
          .pipe(
            map(
              (SearchResult: GlBoutiqueLocationList[]) =>
                new GlBoutiqueLocationActions.SearchByLocationCodeSuccess(
                  SearchResult
                )
            )
          );
      },
      onError: (
        action: GlBoutiqueLocationActions.SearchByLocationCode,
        error: HttpErrorResponse
      ) => {

        return new GlBoutiqueLocationActions.LoadGlBoutiqueListSuccess({
          glBoutiqueLocationListing: [],
          totalElements: 0
        });
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
