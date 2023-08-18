import { LoggerService } from '@poss-web/shared/util-logger';
import { HttpErrorResponse } from '@angular/common/http';

import * as SubBrandMasterActions from './subbrand.actions';
import { SubBrandMasterActionTypes } from './subbrand.actions';
import { SubbrandService } from '../subbrand.service';
import {
  BrandListing,
  BrandMaster,
  CustomErrors,
  BrandSummary
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BrandDataService } from '@poss-web/shared/masters/data-access-masters';

import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
@Injectable()
export class SubBrandMasterEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private subBrandMasterService: SubbrandService,
    private brandDataService: BrandDataService
  ) {}

  @Effect() loadSubBrandMasterListing$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING,
    {
      run: (action: SubBrandMasterActions.LoadSubBrandListing) => {
        return this.subBrandMasterService
          .getSubBrandMasterList(
            action.payload.pageEvent.pageIndex,
            action.payload.pageEvent.pageSize,
            action.payload.parentBrandCode
          )
          .pipe(
            map(
              (brandLists: BrandListing) =>
                new SubBrandMasterActions.LoadSubBrandListingSuccess(brandLists)
            )
          );
      },
      onError: (
        action: SubBrandMasterActions.LoadSubBrandListing,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.LoadSubBrandListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchSubBrandByBrandCode$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE,
    {
      run: (action: SubBrandMasterActions.SearchSubBrandByBrandCode) => {
        return this.subBrandMasterService
          .searchSubBrandByBrandCode(
            action.payload.brandCode,
            action.payload.parentBrandCode
          )
          .pipe(
            map(
              (brandList: BrandListing) =>
                new SubBrandMasterActions.SearchSubBrandByBrandCodeSuccess(
                  brandList
                )
            )
          );
      },
      onError: (
        action: SubBrandMasterActions.SearchSubBrandByBrandCode,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.SearchSubBrandByBrandCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveSubBrandMasterDetails$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS,
    {
      run: (action: SubBrandMasterActions.SaveSubBrandMasterDetails) => {
        return this.subBrandMasterService
          .saveSubBrandMasterDetails(action.payload)
          .pipe(
            map(() => {
              return new SubBrandMasterActions.SaveSubBrandMasterDetailsSuccess();
            })
          );
      },
      onError: (
        action: SubBrandMasterActions.SaveSubBrandMasterDetails,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.SaveSubBrandMasterDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updatesubBrandMasterDetails$ = this.dataPersistence.pessimisticUpdate(
    SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS,
    {
      run: (action: SubBrandMasterActions.UpdateSubBrandMasterDetails) => {
        return this.subBrandMasterService
          .updateSubBrandMasterDetails(
            action.payload.data,
            action.payload.brandCode
          )
          .pipe(
            map(() => {
              return new SubBrandMasterActions.UpdateSubBrandMasterDetailsSuccess();
            })
          );
      },
      onError: (
        action: SubBrandMasterActions.UpdateSubBrandMasterDetails,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.UpdateSubBrandMasterDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateIsActive$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.UPDATE_IS_ACTIVE,
    {
      run: (action: SubBrandMasterActions.UpdateIsActive) => {
        return this.subBrandMasterService
          .updateIsActive(action.payload.brandCode, action.payload.isActive)
          .pipe(
            map(
              (locationCodes: { id: string; description: string }[]) =>
                new SubBrandMasterActions.UpdateIsActiveSuccess('')
            )
          );
      },
      onError: (
        action: SubBrandMasterActions.UpdateIsActive,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.UpdateIsActiveFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSubBrandDetailsByBrandCode$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE,
    {
      run: (action: SubBrandMasterActions.LoadSubrandDetailsByBrandCode) => {
        return this.subBrandMasterService
          .getSubBrandDetailsBySubBrandCode(action.payload)
          .pipe(
            map(
              (brandDetails: BrandMaster) =>
                new SubBrandMasterActions.LoadSubrandDetailsByBrandCodeSuccess(
                  brandDetails
                )
            )
          );
      },
      onError: (
        action: SubBrandMasterActions.LoadSubrandDetailsByBrandCode,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.LoadSubrandDetailsByBrandCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadParentBrand$ = this.dataPersistence.fetch(
    SubBrandMasterActionTypes.LOAD_PARENT_BRANDS,
    {
      run: (action: SubBrandMasterActions.LoadParenBrands) => {
        return this.brandDataService
          .getBrandSummary(false)
          .pipe(
            map(
              (parentBrands: BrandSummary[]) =>
                new SubBrandMasterActions.LoadParenBrandsSuccess(parentBrands)
            )
          );
      },
      onError: (
        action: SubBrandMasterActions.LoadParenBrands,
        error: HttpErrorResponse
      ) => {
        return new SubBrandMasterActions.LoadParenBrandsFailure(
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
