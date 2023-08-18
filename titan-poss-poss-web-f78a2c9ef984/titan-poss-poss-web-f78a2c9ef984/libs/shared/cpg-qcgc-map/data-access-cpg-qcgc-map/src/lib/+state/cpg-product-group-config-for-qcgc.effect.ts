import { DataPersistence } from '@nrwl/angular';

import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import * as CPGProductGroupConfigForQCGCActions from './cpg-product-group-config-for-qcgc.actions';
import {
  CustomErrors,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCListingResult,
  CPGProductGroupConfigForQCGCDetails
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CPGQCGCMapService } from '../cpg-qcgc-map.service';

@Injectable()
export class CPGProductGroupConfigForQCGCEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cpgQCGCMapService: CPGQCGCMapService
  ) {}

  @Effect()
  loadStateTaxConfigurationListing$ = this.dataPersistence.fetch(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCListing
      ) => {
        return this.cpgQCGCMapService
          .getCPGProductGroupConfigurationList(action.payload)
          .pipe(
            map(
              (listingData: CPGProductGroupConfigForQCGCListingResult) =>
                new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCListingSuccess(
                  listingData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCListing,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCListingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // searchStateTaxConfigurationDetails$ = this.dataPersistence.fetch(
  //   CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
  //     .SEARCH_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_LISTING,
  //   {
  //     run: (
  //       action: CPGProductGroupConfigForQCGCActions.SearchCPGProductGroupConfigForQCGCListing
  //     ) => {
  //       return this.cpgQCGCMapService
  //         .getCPGProductGroupConfigurationDetails(action.payload)
  //         .pipe(
  //           map((detailsData: CPGProductGroupConfigForQCGCDetails) => {
  //             return new CPGProductGroupConfigForQCGCActions.SearchCPGProductGroupConfigForQCGCListingSuccess(
  //               [detailsData]
  //             );
  //           })
  //         );
  //     },
  //     onError: (
  //       action: CPGProductGroupConfigForQCGCActions.SearchCPGProductGroupConfigForQCGCListing,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new CPGProductGroupConfigForQCGCActions.SearchCPGProductGroupConfigForQCGCListingFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );


  @Effect()
  loadStateTaxConfigurationDetails$ = this.dataPersistence.fetch(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCDetails
      ) => {
        return this.cpgQCGCMapService
          .getCPGProductGroupConfigurationDetails(action.payload)
          .pipe(
            map(
              (detailsData: CPGProductGroupConfigForQCGCDetails) =>
                new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCDetailsSuccess(
                  detailsData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCDetails,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveStateTaxConfigurationDetails$ = this.dataPersistence.pessimisticUpdate(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCDetails
      ) => {
        return this.cpgQCGCMapService
          .saveCPGProductGroupConfigurationDetails(action.payload)
          .pipe(
            map(
              (saveData: CPGProductGroupConfigForQCGCDetails) =>
                new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCDetailsSuccess(
                  saveData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCDetails,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editStateTaxConfigurationDetails$ = this.dataPersistence.pessimisticUpdate(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .EDIT_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_DETAILS,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.EditCPGProductGroupConfigForQCGCDetails
      ) => {
        return this.cpgQCGCMapService
          .editCPGProductGroupConfigurationDetails(action.payload)
          .pipe(
            map(
              (saveData: CPGProductGroupConfigForQCGCDetails) =>
                new CPGProductGroupConfigForQCGCActions.EditCPGProductGroupConfigForQCGCDetailsSuccess(
                  saveData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.EditCPGProductGroupConfigForQCGCDetails,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.EditCPGProductGroupConfigForQCGCDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  LoadStateTaxConfigurationMapping$ = this.dataPersistence.fetch(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .LOAD_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCMapping
      ) => {
        return this.cpgQCGCMapService
          .getCPGProductGroupConfigurationMapping(action.payload)
          .pipe(
            map(
              (detailsData: ProductGroupMappingOption[]) =>
                new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCMappingSuccess(
                  detailsData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCMapping,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.LoadCPGProductGroupConfigForQCGCMappingFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveStateTaxConfigurationMapping$ = this.dataPersistence.pessimisticUpdate(
    CPGProductGroupConfigForQCGCActions.CPGProductGroupConfigForQCGCActionTypes
      .SAVE_CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_MAPPING,
    {
      run: (
        action: CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCMapping
      ) => {
        return this.cpgQCGCMapService
          .saveCPGProductGroupConfigurationMapping(
            action.payload.data,
            action.payload.id
          )
          .pipe(
            map(
              (saveData: ProductGroupMappingOption[]) =>
                new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCMappingSuccess(
                  saveData
                )
            )
          );
      },
      onError: (
        action: CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCMapping,
        error: HttpErrorResponse
      ) => {
        return new CPGProductGroupConfigForQCGCActions.SaveCPGProductGroupConfigForQCGCMappingFailure(
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
