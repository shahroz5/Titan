import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { CommonState } from './common.state';

import { CommonActionTypes } from './common.actions';
import * as CommonActions from './common.actions';
import { CommonService } from '../common.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbToleranceConfigMetalType,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import {
  ItemDataService,
  LocationDataService,
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { LoggerService } from '@poss-web/shared/util-logger';
import { PrinterService } from '@poss-web/shared/util-common';

@Injectable()
export class CommonEffects {
  constructor(
    private dataPersistence: DataPersistence<CommonState>,
    private commonService: CommonService,
    private loggerService: LoggerService,
    private locationDataService: LocationDataService,
    private productGroupDataService: ProductGroupDataService,
    private itemDataService: ItemDataService,
    private printerService: PrinterService,
    private lovDataService: LovDataService
  ) {}

  @Effect()
  loadABStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: CommonActions.LoadABStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new CommonActions.LoadABStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: CommonActions.LoadABStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  loadCOStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CO_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: CommonActions.LoadCOStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new CommonActions.LoadCOStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: CommonActions.LoadCOStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCOStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCMStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: CommonActions.LoadCMStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new CommonActions.LoadCMStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: CommonActions.LoadCMStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTEPStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_TEP_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: CommonActions.LoadTEPStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new CommonActions.LoadTEPStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: CommonActions.LoadTEPStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadTEPStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFailedInvoices$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_FAILED_INVOICE,
    {
      run: (action: CommonActions.LoadFaileInvoicesDeatils) => {
        return this.commonService
          .getFailedInvoices()
          .pipe(
            map(
              (invoices: string[]) =>
                new CommonActions.LoadFaileInvoicesDeatilsSuccess(invoices)
            )
          );
      },
      onError: (
        action: CommonActions.LoadFaileInvoicesDeatils,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadFaileInvoicesDeatilsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCopiedInvoices$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_COPIED_INVOICE_DOCUMENT,
    {
      run: (action: CommonActions.LoadCopiedInvoicesDocument) => {
        return this.commonService
          .getCopiedInvoices()
          .pipe(
            map(
              (invoices) =>
                new CommonActions.LoadCopiedInvoicesDocumentSuccess(true)
            )
          );
      },
      onError: (
        action: CommonActions.LoadCopiedInvoicesDocument,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCopiedInvoicesDocumentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  triggerFailedInvoices$ = this.dataPersistence.fetch(
    CommonActionTypes.TRIGGER_FAILED_INVOICE,
    {
      run: (action: CommonActions.TriggerFailedInvoicesDetails) => {
        return this.commonService
          .triggerFailedInvoices()
          .pipe(
            map(
              (failedInvoices: any) =>
                new CommonActions.TriggerFailedInvoicesDetailsSuccess()
            )
          );
      },

      onError: (
        action: CommonActions.TriggerFailedInvoicesDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.TriggerFailedInvoicesDetailsFailure();
      }
    }
  );

  @Effect()
  loadGRFStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_GRF_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: CommonActions.LoadGRFStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new CommonActions.LoadGRFStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: CommonActions.LoadGRFStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadGRFStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABPgDesc$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_PG_DESC,
    {
      run: (action: CommonActions.LoadABPgDesc) => {
        return this.productGroupDataService
          .getProductGroupDescription()
          .pipe(map((data: {}) => new CommonActions.LoadABPgDescSuccess(data)));
      },
      onError: (
        action: CommonActions.LoadABPgDesc,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABPgDescFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadCMPgDesc$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_PG_DESC,
    {
      run: (action: CommonActions.LoadCMPgDesc) => {
        return this.productGroupDataService
          .getProductGroupDescription()
          .pipe(map((data: {}) => new CommonActions.LoadCMPgDescSuccess(data)));
      },
      onError: (
        action: CommonActions.LoadCMPgDesc,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMPgDescFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadBCPgDesc$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_BILL_CANCELLATION_PG_DESC,
    {
      run: (action: CommonActions.LoadBillCancellationPgDesc) => {
        return this.productGroupDataService
          .getProductGroupDescription()
          .pipe(
            map(
              (data: {}) =>
                new CommonActions.LoadBillCancellationPgDescSuccess(data)
            )
          );
      },
      onError: (
        action: CommonActions.LoadBillCancellationPgDesc,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadBillCancellationPgDescFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadGRNPgDesc$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_GRN_PG_DESC,
    {
      run: (action: CommonActions.LoadGRNPgDesc) => {
        return this.productGroupDataService
          .getProductGroupDescription()
          .pipe(
            map((data: {}) => new CommonActions.LoadGRNPgDescSuccess(data))
          );
      },
      onError: (
        action: CommonActions.LoadGRNPgDesc,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadGRNPgDescFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadABImageUrl$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_IMAGE_URL,
    {
      run: (action: CommonActions.LoadABImageUrl) => {
        return this.itemDataService.getItemUrlByCode(action.payload).pipe(
          map(
            (data: any) =>
              new CommonActions.LoadABImageUrlSuccess({
                itemCode: action.payload,
                imageUrl: data
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadABImageUrl,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABImageUrlFailure({
          itemCode: action.payload,
          imageUrl: []
        });
      }
    }
  );

  @Effect()
  loadCMImageUrl$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_IMAGE_URL,
    {
      run: (action: CommonActions.LoadCMImageUrl) => {
        return this.itemDataService.getItemUrlByCode(action.payload).pipe(
          map(
            (data: any) =>
              new CommonActions.LoadCMImageUrlSuccess({
                itemCode: action.payload,
                imageUrl: data
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadCMImageUrl,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMImageUrlFailure({
          itemCode: action.payload,
          imageUrl: []
        });
      }
    }
  );
  @Effect()
  loadBillCancellationImageUrl$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_BILL_CANCELLATION_IMAGE_URL,
    {
      run: (action: CommonActions.LoadBillCancellationImageUrl) => {
        return this.itemDataService.getItemUrlByCode(action.payload).pipe(
          map(
            (data: any) =>
              new CommonActions.LoadBillCancellationImageUrlSuccess({
                itemCode: action.payload,
                imageUrl: data
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadBillCancellationImageUrl,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadBillCancellationImageUrlFailure({
          itemCode: action.payload,
          imageUrl: []
        });
      }
    }
  );
  @Effect()
  loadGRNImageUrl$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_GRN_IMAGE_URL,
    {
      run: (action: CommonActions.LoadGRNImageUrl) => {
        return this.itemDataService.getItemUrlByCode(action.payload).pipe(
          map(
            (data: any) =>
              new CommonActions.LoadGRNImageUrlSuccess({
                itemCode: action.payload,
                imageUrl: data
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadGRNImageUrl,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadGRNImageUrlFailure({
          itemCode: action.payload,
          imageUrl: []
        });
      }
    }
  );

  @Effect()
  loasCashPaymentConfigDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_MAX_CASH_LIMIT,
    {
      run: (action: CommonActions.LoadMaxCashLimit) => {
        return this.commonService
          .getMaximumCashLimit(action.payload)
          .pipe(
            map(
              (amount: string) =>
                new CommonActions.LoadMaxCashLimitSuccess(amount)
            )
          );
      },
      onError: (
        action: CommonActions.LoadMaxCashLimit,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadMaxCashLimitFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadMetalTypes$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_METAL_TYPES,
    {
      run: (action: CommonActions.LoadMetalTypes) => {
        return this.commonService
          .loadMetalTypes()
          .pipe(
            map(
              (metalTypes: AbToleranceConfigMetalType[]) =>
                new CommonActions.LoadMetalTypesSuccess(metalTypes)
            )
          );
      },
      onError: (
        action: CommonActions.LoadMetalTypes,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadMetalTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_TOLERANCE,
    {
      run: (action: CommonActions.LoadTolerance) => {
        return this.commonService.loadTolerance(action.payload).pipe(
          map(
            (tolerance: {}) =>
              new CommonActions.LoadToleranceSuccess({
                data: tolerance,
                itemType: action.payload.ruleRequestList.metalType
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadToleranceFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadABTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_TOLERANCE,
    {
      run: (action: CommonActions.LoadABTolerance) => {
        return this.commonService.loadTolerance(action.payload).pipe(
          map(
            (tolerance: {}) =>
              new CommonActions.LoadABToleranceSuccess({
                data: tolerance,
                itemType: action.payload.ruleRequestList.metalType
              })
          )
        );
      },
      onError: (
        action: CommonActions.LoadABTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCMGrfTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_GRF_TOLERANCE,
    {
      run: (action: CommonActions.LoadCMGrfTolerance) => {
        return this.commonService
          .loadTolerance(action.payload)
          .pipe(
            map(
              (tolerance: {}) =>
                new CommonActions.LoadCMGrfToleranceSuccess(tolerance)
            )
          );
      },
      onError: (
        action: CommonActions.LoadCMGrfTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMGrfToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABGrfTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_GRF_TOLERANCE,
    {
      run: (action: CommonActions.LoadABGrfTolerance) => {
        return this.commonService
          .loadTolerance(action.payload)
          .pipe(
            map(
              (tolerance: {}) =>
                new CommonActions.LoadABGrfToleranceSuccess(tolerance)
            )
          );
      },
      onError: (
        action: CommonActions.LoadABGrfTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABGrfToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCMGrnTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_GRN_TOLERANCE,
    {
      run: (action: CommonActions.LoadCMGrnTolerance) => {
        return this.commonService
          .loadTolerance(action.payload)
          .pipe(
            map(
              (tolerance: {}) =>
                new CommonActions.LoadCMGrnToleranceSuccess(tolerance)
            )
          );
      },
      onError: (
        action: CommonActions.LoadCMGrnTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMGrnToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABGrnTolerance$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_GRN_TOLERANCE,
    {
      run: (action: CommonActions.LoadABGrnTolerance) => {
        return this.commonService
          .loadTolerance(action.payload)
          .pipe(
            map(
              (tolerance: {}) =>
                new CommonActions.LoadABGrnToleranceSuccess(tolerance)
            )
          );
      },
      onError: (
        action: CommonActions.LoadABGrnTolerance,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABGrnToleranceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() abOccasionList$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_AB_OCCASIONS,
    {
      run: (action: CommonActions.LoadABOccasions) => {
        return this.lovDataService
          .getSalesLovs(action.payload)
          .pipe(
            map((data: Lov[]) => new CommonActions.LoadABOccasionsSuccess(data))
          );
      },

      onError: (
        action: CommonActions.LoadABOccasions,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadABOccasionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() cmOccasionList$: Observable<Action> = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_CM_OCCASIONS,
    {
      run: (action: CommonActions.LoadCMOccasions) => {
        return this.lovDataService
          .getSalesLovs(action.payload)
          .pipe(
            map((data: Lov[]) => new CommonActions.LoadCMOccasionsSuccess(data))
          );
      },

      onError: (
        action: CommonActions.LoadCMOccasions,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadCMOccasionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Inventory Image Loading
  @Effect() loadImageCatalogueDetails$ = this.dataPersistence.fetch(
    CommonActionTypes.LOAD_IMAGE_CATALOGUE_DETAILS,
    {
      run: (action: CommonActions.LoadImageCatalogueDetails, state) => {
        return this.commonService
          .getImageCatalogueDetails()
          .pipe(
            map(
              (loadImageResponse: any) =>
                new CommonActions.LoadImageCatalogueDetailsSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: CommonActions.LoadImageCatalogueDetails,
        error: HttpErrorResponse
      ) => {
        return new CommonActions.LoadImageCatalogueDetailsFailure(
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
