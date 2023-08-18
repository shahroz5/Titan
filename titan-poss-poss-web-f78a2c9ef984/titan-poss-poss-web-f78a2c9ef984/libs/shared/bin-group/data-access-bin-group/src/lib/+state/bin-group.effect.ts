import { Injectable } from '@angular/core';
import * as BinGroupActions from './bin-group.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { BinGroupActionTypes } from './bin-group.actions';
import { BinGroupService } from '../bin-group.service';
import {
  LoadBinGroupDetailsListingSuccessPayload,
  BinGroupDetails,
  CustomErrors
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
@Injectable()
export class BinGroupEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private binGroupService: BinGroupService
  ) {}

  @Effect()
  loadBinGroupDetails$ = this.dataPersistence.fetch(
    BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS,
    {
      run: (action: BinGroupActions.LoadBinGroupDetails) => {
        return this.binGroupService
          .getbinGroupDetails(action.payload)
          .pipe(
            map(
              (binGroupDetails: LoadBinGroupDetailsListingSuccessPayload) =>
                new BinGroupActions.LoadBinGroupDetailsSuccess(binGroupDetails)
            )
          );
      },
      onError: (
        action: BinGroupActions.LoadBinGroupDetails,
        error: HttpErrorResponse
      ) => {
        return new BinGroupActions.LoadBinGroupDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBinGroupDetailsByBinGroupCode$ = this.dataPersistence.fetch(
    BinGroupActionTypes.LOAD_BIN_GROUP_DETAILS_BY_BIN_GROUPCODE,
    {
      run: (action: BinGroupActions.LoadBinGroupByBinGroupCode) => {
        return this.binGroupService
          .getBinGroupByBinGroupCode(action.payload)
          .pipe(
            map(
              (binGroupDetailsByBinGroupCode: BinGroupDetails) =>
                new BinGroupActions.LoadBinGroupByBinGroupCodeSuccess(
                  binGroupDetailsByBinGroupCode
                )
            )
          );
      },
      onError: (
        action: BinGroupActions.LoadBinGroupByBinGroupCode,
        error: HttpErrorResponse
      ) => {
        return new BinGroupActions.LoadBinGroupByBinGroupCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBinGroupFormDetails$ = this.dataPersistence.pessimisticUpdate(
    BinGroupActionTypes.SAVE_BINGROUP_FORM_DETAILS,
    {
      run: (action: BinGroupActions.SaveBinGroupFormDetails) => {
        return this.binGroupService
          .saveBinGroupFormDetails(action.payload)
          .pipe(
            map((saveData: BinGroupDetails) => {
              return new BinGroupActions.SaveBinGroupFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: BinGroupActions.SaveBinGroupFormDetails,
        error: HttpErrorResponse
      ) => {
        return new BinGroupActions.SaveBinGroupFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editBinGroupFormDetails$ = this.dataPersistence.pessimisticUpdate(
    BinGroupActionTypes.EDIT_BINGROUP_FORM_DETAILS,
    {
      run: (action: BinGroupActions.EditBinGroupFormDetails) => {
        return this.binGroupService
          .editBinGroupFormDetails(action.payload)
          .pipe(
            map((saveData: BinGroupDetails) => {
              return new BinGroupActions.EditBinGroupFormDetailsSuccess(
                saveData
              );
            })
          );
      },
      onError: (
        action: BinGroupActions.EditBinGroupFormDetails,
        error: HttpErrorResponse
      ) => {
        return new BinGroupActions.EditBinGroupFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchBinGroupByBinCode$ = this.dataPersistence.fetch(
    BinGroupActionTypes.SEARCH_BINGROUP_BY_BINGROUPCODE,
    {
      run: (action: BinGroupActions.SearchByBinGroupCode) => {
        return this.binGroupService
          .searchBinGroupByBinGroupCode(action.payload)
          .pipe(
            map(
              (binGroupList: LoadBinGroupDetailsListingSuccessPayload) =>
                new BinGroupActions.SearchByBinGroupCodeSuccess(binGroupList)
            )
          );
      },
      onError: (
        action: BinGroupActions.SearchByBinGroupCode,
        error: HttpErrorResponse
      ) => {
        return new BinGroupActions.SearchByBinGroupCodeFailure(
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
