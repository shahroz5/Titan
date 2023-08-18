import { Injectable } from '@angular/core';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';
import { GrnService } from '../grn.service';
import {
  CustomErrors,
  GrnReqStatusListResponse,
  GrnReqDetails,
  ConfirmGrnSuccessPayload,
  GrnInitResponse,
  GrnApproverSuccessList,
  GrnSendForAprovalSuccess,
  GrnHistoryResponse,
  Lov,
  GrnPriceDetailsSuccess,
  TcsCollectedResponse,
  GrnProductDetails
} from '@poss-web/shared/models';
import { GrnActionTypes } from './grn.actions';

import * as GrnActions from './grn.actions';
import {
  LocationDataService,
  LovDataService
} from '@poss-web/shared/masters/data-access-masters';
@Injectable()
@Injectable()
export class GrnEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private grnService: GrnService,
    private locationDataService: LocationDataService,
    private lovService: LovDataService
  ) {}

  @Effect()
  loadGrnHistoryDetails$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_GRN_HISTORY_DETAILS,
    {
      run: (action: GrnActions.LoadGrnHistoryDetails) => {
        return this.grnService
          .getGrnHistoryDetails(
            action.payload.size,
            action.payload.page,
            action.payload.filterOptions,
            action.payload.subTxnType,
            action.payload.txnType,
            action.payload.filterOptions.cmLocation,
            action.payload.filterOptions.searchField,
            action.payload.filterOptions.searchType
          )
          .pipe(
            map(
              (grnHistoryResponse: GrnHistoryResponse) =>
                new GrnActions.LoadGrnHistoryDetailsSuccess(grnHistoryResponse)
            )
          );
      },
      onError: (
        action: GrnActions.LoadGrnHistoryDetails,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadGrnHistoryDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  filterGrnReqStatusList$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST,
    {
      run: (action: GrnActions.FilterGrnReqStatusList) => {
        return this.grnService
          .getGrnReqStatusList(
            action.payload.page,
            action.payload.size,
            action.payload.workflowType,
            action.payload.approvalStatus,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (grnReqStatusListResponse: GrnReqStatusListResponse) =>
                new GrnActions.FilterGrnReqStatusListSuccess(
                  grnReqStatusListResponse
                )
            )
          );
      },
      onError: (
        action: GrnActions.FilterGrnReqStatusList,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.FilterGrnReqStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGrnReqStatusList$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST,
    {
      run: (action: GrnActions.LoadGrnReqStatusList) => {
        return this.grnService
          .getGrnReqStatusList(
            action.payload.page,
            action.payload.size,
            action.payload.workflowType,
            action.payload.approvalStatus,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (grnReqStatusListResponse: GrnReqStatusListResponse) =>
                new GrnActions.LoadGrnReqStatusListSuccess(
                  grnReqStatusListResponse
                )
            )
          );
      },
      onError: (
        action: GrnActions.LoadGrnReqStatusList,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadGrnReqStatusListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchGrn$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.SEARCH_GRN,
    {
      run: (action: GrnActions.SearchGrn) => {
        return this.grnService
          .searchGrn(
            action.payload.workflowType,
            action.payload.approvalStatus,
            action.payload.filterOptions
          )
          .pipe(
            map(
              (grnReqStatusListResponse: GrnReqStatusListResponse) =>
                new GrnActions.SearchGrnSuccess(grnReqStatusListResponse)
            )
          );
      },
      onError: (action: GrnActions.SearchGrn, error: HttpErrorResponse) => {
        return new GrnActions.SearchGrnFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadGrnDetailsById$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_GRN_DETAILS_BY_ID,
    {
      run: (action: GrnActions.LoadGrnDetailsById) => {
        return this.grnService
          .loadGrnDetailsById(action.payload.grnId, action.payload.creditNoteType)
          .pipe(
            map(
              (grnReqDetails: GrnReqDetails) =>
                new GrnActions.LoadGrnDetailsByIdSuccess(grnReqDetails)
            )
          );
      },
      onError: (
        action: GrnActions.LoadGrnDetailsById,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadGrnDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmGrn$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.CONFIRM_GRN,
    {
      run: (action: GrnActions.ConfirmGrn) => {
        return this.grnService
          .confirmGrn(
            action.payload.grnId,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.data
          )
          .pipe(
            map(
              (confirmGrnSuccessPayload: ConfirmGrnSuccessPayload) =>
                new GrnActions.ConfirmGrnSuccess(confirmGrnSuccessPayload)
            )
          );
      },
      onError: (action: GrnActions.ConfirmGrn, error: HttpErrorResponse) => {
        return new GrnActions.ConfirmGrnFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  initiateGrn$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.INITIATE_GRN,
    {
      run: (action: GrnActions.InitiateGrn) => {
        return this.grnService
          .initiateGrn(action.payload)
          .pipe(
            map(
              (grnResponse: GrnInitResponse) =>
                new GrnActions.InitiateGrnSuccess(grnResponse)
            )
          );
      },
      onError: (action: GrnActions.InitiateGrn, error: HttpErrorResponse) => {
        return new GrnActions.InitiateGrnFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadItem$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_ITEM,
    {
      run: (action: GrnActions.LoadItem) => {
        return this.grnService
          .loadItem(action.payload)
          .pipe(
            map(
              (itemDetails: GrnProductDetails) =>
                new GrnActions.LoadItemSuccess(itemDetails)
            )
          );
      },
      onError: (action: GrnActions.LoadItem, error: HttpErrorResponse) => {
        return new GrnActions.LoadItemFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  confirmWithoutApproval$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL,
    {
      run: (action: GrnActions.ConfirmGrnWithOutApproval) => {
        return this.grnService
          .confirmWithoutApproval(
            action.payload.subTxnType,
            action.payload.txnType,
            action.payload.data
          )
          .pipe(
            map(
              (confirmGrnSuccessPayload: ConfirmGrnSuccessPayload) =>
                new GrnActions.ConfirmGrnWithOutApprovalSuccess(
                  confirmGrnSuccessPayload
                )
            )
          );
      },
      onError: (
        action: GrnActions.ConfirmGrnWithOutApproval,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.ConfirmGrnWithOutApprovalFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sendForApproval$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.SEND_FOR_APPROVAL,
    {
      run: (action: GrnActions.SendForApproval) => {
        return this.grnService
          .sendForApproval(
            action.payload.subTxnType,
            action.payload.txnType,
            action.payload.data
          )
          .pipe(
            map(
              (req: GrnSendForAprovalSuccess) =>
                new GrnActions.SendForApprovalSuccess(req)
            )
          );
      },
      onError: (
        action: GrnActions.SendForApproval,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.SendForApprovalFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadLocationCodes$ = this.dataPersistence.fetch(
    GrnActionTypes.GET_LOCATIONS,
    {
      run: (action: GrnActions.GetLocationCodes) => {
        return this.locationDataService
          .getLocationSummaryList(
            { locationTypes: ['BTQ'] },
            false,
            null,
            null,
            ['locationCode,ASC']
          )
          .pipe(
            map(
              (locationCodes: any) =>
                new GrnActions.GetLocationCodesSuccess(locationCodes)
            )
          );
      },
      onError: (
        action: GrnActions.GetLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.GetLocationCodesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  grnApprovers$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_APPROVERS,
    {
      run: (action: GrnActions.GetApprovers) => {
        return this.grnService
          .getGrnApprovers(action.payload)
          .pipe(
            map(
              (approvers: GrnApproverSuccessList[]) =>
                new GrnActions.GetApproversSuccess(approvers)
            )
          );
      },
      onError: (action: GrnActions.GetApprovers, error: HttpErrorResponse) => {
        return new GrnActions.GetApproversFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadGrnReasons$ = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_GRN_REASONS,
    {
      run: (action: GrnActions.LoadGrnReasons) => {
        return this.lovService
          .getEnginePaymentLovs(action.payload)
          .pipe(
            map(
              (reasons: Lov[]) => new GrnActions.LoadGrnReasonsSucceess(reasons)
            )
          );
      },
      onError: (
        action: GrnActions.LoadGrnReasons,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadGrnReasonsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  grnFinalPriceDetails$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS,
    {
      run: (action: GrnActions.LoadGrnItemPriceDetails) => {
        return this.grnService
          .getGrnFinalPriceDetails(action.payload)
          .pipe(
            map(
              (grnPriceDetailsSuccess: GrnPriceDetailsSuccess) =>
                new GrnActions.LoadGrnItemPriceDetailsSuccess(
                  grnPriceDetailsSuccess
                )
            )
          );
      },
      onError: (
        action: GrnActions.LoadGrnItemPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadGrnItemPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  tcsCollectedAmount$: Observable<Action> = this.dataPersistence.fetch(
    GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT,
    {
      run: (action: GrnActions.LoadCollectedTcsAmount) => {
        return this.grnService
          .getTcsAmount(action.id)
          .pipe(
            map(
              (tcsCollectedAmount: TcsCollectedResponse) =>
                new GrnActions.LoadCollectedTcsAmountSuccess(tcsCollectedAmount)
            )
          );
      },
      onError: (
        action: GrnActions.LoadCollectedTcsAmount,
        error: HttpErrorResponse
      ) => {
        return new GrnActions.LoadCollectedTcsAmountFailure(
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
