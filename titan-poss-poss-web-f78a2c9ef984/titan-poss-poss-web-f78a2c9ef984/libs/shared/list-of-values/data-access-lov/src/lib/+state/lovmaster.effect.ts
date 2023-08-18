import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as LovMasterActions from './lovmaster.actons';

import { LoggerService } from '@poss-web/shared/util-logger';
import {
  LovMasterType,
  LoadLovListingSuccessPayload,
  LovMaster,
  CustomErrors,
  LovMasterTypeMain
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LovMasterService } from '../lov-master.service';

@Injectable()
export class LovMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private lovMasterService: LovMasterService
  ) {}

  @Effect()
  loadLovMasterTypes$ = this.dataPersistence.fetch(
    LovMasterActions.LovActionTypes.LOAD_LOV_TYPES,
    {
      run: (action: LovMasterActions.LoadLovTypes) => {
        return this.lovMasterService
          .getLovMasterType()
          .pipe(
            map(
              (lovMasterListing: LovMasterType[]) =>
                new LovMasterActions.LoadLovTypesSuccess(lovMasterListing)
            )
          );
      },
      onError: (
        action: LovMasterActions.LoadLovTypes,
        error: HttpErrorResponse
      ) => {
        return new LovMasterActions.LoadLovTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLovMasterTypesMain$ = this.dataPersistence.fetch(
    LovMasterActions.LovActionTypes.LOAD_LOV_TYPES_MAIN,
    {
      run: (action: LovMasterActions.LoadLovTypesMain) => {
        return this.lovMasterService
          .getLovMasterTypeMain()
          .pipe(
            map(
              (lovMasterListing: LovMasterTypeMain[]) =>
                new LovMasterActions.LoadLovTypesMainSuccess(lovMasterListing)
            )
          );
      },
      onError: (
        action: LovMasterActions.LoadLovTypesMain,
        error: HttpErrorResponse
      ) => {
        return new LovMasterActions.LoadLovTypesMainFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadLovMasterList$ = this.dataPersistence.fetch(
    LovMasterActions.LovActionTypes.LOAD_LOV_LISTING,
    {
      run: (action: LovMasterActions.LoadLovListing) => {
        return this.lovMasterService
          .getLovMasterList(action.payload)
          .pipe(
            map(
              (lovMasterListing: LoadLovListingSuccessPayload) =>
                new LovMasterActions.LoadLovListingSuccess(lovMasterListing)
            )
          );
      },
      onError: (
        action: LovMasterActions.LoadLovListing,
        error: HttpErrorResponse
      ) => {
        return new LovMasterActions.LoadLovListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveLovFormDetails$ = this.dataPersistence.pessimisticUpdate(
    LovMasterActions.LovActionTypes.SAVE_LOV_TOWN,
    {
      run: (action: LovMasterActions.SaveLovFormDetails) => {
        return this.lovMasterService.createLovFormDetails(action.payload).pipe(
          map((saveData: LovMaster) => {
            return new LovMasterActions.SaveLovFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: LovMasterActions.SaveLovFormDetails,
        error: HttpErrorResponse
      ) => {
        return new LovMasterActions.SaveLovFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editLovFormDetails$ = this.dataPersistence.pessimisticUpdate(
    LovMasterActions.LovActionTypes.EDIT_LOV_TOWN,
    {
      run: (action: LovMasterActions.EditLovFormDetails) => {
        return this.lovMasterService.saveLovFormDetails(action.payload).pipe(
          map((saveData: LoadLovListingSuccessPayload) => {
            return new LovMasterActions.EditLovFormDetailsSuccess(saveData);
          })
        );
      },
      onError: (
        action: LovMasterActions.EditLovFormDetails,
        error: HttpErrorResponse
      ) => {
        return new LovMasterActions.EditLovFormDetailsFailure(
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
