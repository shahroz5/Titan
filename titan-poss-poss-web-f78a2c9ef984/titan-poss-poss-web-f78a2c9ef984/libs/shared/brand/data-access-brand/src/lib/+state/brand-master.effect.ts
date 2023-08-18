import {
  CustomErrors,
  BrandMasterListing,
  BrandMasterDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrandMasterActionTypes } from './brand-master.actons';
import * as BrandMasterActions from './brand-master.actons';
import { BrandMasterService } from '../brand-master.service';

import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';

@Injectable()
export class BrandMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private brandMasterService: BrandMasterService
  ) {}

  @Effect()
  loadBrandMasterListing$ = this.dataPersistence.fetch(
    BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING,
    {
      run: (action: BrandMasterActions.LoadBrandListing) => {
        return this.brandMasterService
          .getBrandMasterList(action.payload.pageIndex, action.payload.pageSize)
          .pipe(
            map(
              (brandLists: BrandMasterListing) =>
                new BrandMasterActions.LoadBrandListingSuccess(brandLists)
            )
          );
      },
      onError: (
        action: BrandMasterActions.LoadBrandListing,
        error: HttpErrorResponse
      ) => {
        return new BrandMasterActions.LoadBrandListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchLocationByLocationCode$ = this.dataPersistence.fetch(
    BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS,
    {
      run: (action: BrandMasterActions.SearchBrandDetails) => {
        return this.brandMasterService
          .searchBrandByBrandCode(action.payload)
          .pipe(
            map(
              (brandList: BrandMasterListing) =>
                new BrandMasterActions.SearchBrandDetailsSuccess(brandList)
            )
          );
      },
      onError: (
        action: BrandMasterActions.SearchBrandDetails,
        error: HttpErrorResponse
      ) => {
        return new BrandMasterActions.SearchBrandDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBrandDetailsByBrandCode$ = this.dataPersistence.fetch(
    BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS,
    {
      run: (action: BrandMasterActions.LoadBrandDetails) => {
        return this.brandMasterService
          .getBrandDetailsByBrandCode(action.payload)
          .pipe(
            map((brandDetails: BrandMasterDetails) => {
              return new BrandMasterActions.LoadBrandDetailsSuccess(
                brandDetails
              );
            })
          );
      },
      onError: (
        action: BrandMasterActions.LoadBrandDetails,
        error: HttpErrorResponse
      ) => {
        return new BrandMasterActions.LoadBrandDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBrandMasterDetails$ = this.dataPersistence.fetch(
    BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS,
    {
      run: (action: BrandMasterActions.SaveBrandMasterDetails) => {
        return this.brandMasterService
          .saveBrandMasterDetails(action.payload)
          .pipe(
            map((brandDetailsByBrandCode: BrandMasterDetails) => {
              return new BrandMasterActions.SaveBrandMasterDetailsSuccess(
                brandDetailsByBrandCode
              );
            })
          );
      },
      onError: (
        action: BrandMasterActions.SaveBrandMasterDetails,
        error: HttpErrorResponse
      ) => {
        return new BrandMasterActions.SaveBrandMasterDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateBrandMasterDetails$ = this.dataPersistence.pessimisticUpdate(
    BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS,
    {
      run: (action: BrandMasterActions.UpdateBrandMasterDetails) => {
        return this.brandMasterService
          .updateBrandMasterDetails(action.payload)
          .pipe(
            map((brandDetailsByBrandCode: BrandMasterDetails) => {
              return new BrandMasterActions.UpdateBrandMasterDetailsSuccess(
                brandDetailsByBrandCode
              );
            })
          );
      },
      onError: (
        action: BrandMasterActions.UpdateBrandMasterDetails,
        error: HttpErrorResponse
      ) => {
        return new BrandMasterActions.UpdateBrandMasterDetailsFailure(
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
