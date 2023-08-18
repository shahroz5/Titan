import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LocationSummaryList,
  CnTransferSearchResponsePayload,
  SendRequestResponsePayload,
  CNDetailsInfo
} from '@poss-web/shared/models';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import { CreditNotetransferActionTypes } from './cn-transfer.actions';
import * as CreditNoteTransferActions from './cn-transfer.actions';
import { CreditNoteTransferService } from '../credit-note-transfer.service';

@Injectable()
export class CreditNotetransferEffects {
  readonly SORT_PARAM: string = 'locationCode,ASC';
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationDataService: LocationDataService,
    private creditNoteTransferService: CreditNoteTransferService
  ) {}
  @Effect() getLocationCodes$: Observable<Action> = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.GET_LOCATION_CODES,
    {
      run: (action: CreditNoteTransferActions.GetLocationCodes) => {
        return this.creditNoteTransferService
        .getLocationCodes(
          false,
          null,
          null,
          [this.SORT_PARAM]
        )
        .pipe(
          map(
            (data: LocationSummaryList[]) =>
              new CreditNoteTransferActions.GetLocationCodesSuccess(data)
          )
        );
      },

      onError: (
        action: CreditNoteTransferActions.GetLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.GetLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() getLegacyLocationCodes$: Observable<Action> = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.GET_LEGACY_LOCATION_CODES,
    {
      run: (action: CreditNoteTransferActions.GetLegacyLocationCodes) => {
        return this.locationDataService
        .getLocationSummaryList(
          { locationTypes: ['BTQ'], isMigartedFromLegacy: false },
          false,
          null,
          null,
          [this.SORT_PARAM]
        )
        .pipe(
          map(
            (data: LocationSummaryList[]) =>
              new CreditNoteTransferActions.GetLegacyLocationCodesSuccess(data)
          )
        );
      },

      onError: (
        action: CreditNoteTransferActions.GetLegacyLocationCodes,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.GetLegacyLocationCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchCreditNotes$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.SEARCH_CREDIT_NOTES,
    {
      run: (action: CreditNoteTransferActions.SearchCreditNotes) => {
        return this.creditNoteTransferService
          .searchCreditNotes(action.payload)
          .pipe(
            map(
              (searchResponse: CnTransferSearchResponsePayload) =>
                new CreditNoteTransferActions.SearchCreditNotesSuccess(
                  searchResponse
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.SearchCreditNotes,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.SearchCreditNotesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedCreditNoteDetailsById$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.GET_CREDIT_NOTE_DETAILS_BY_ID,
    {
      run: (action: CreditNoteTransferActions.GetCreditNoteDetailsById) => {
        return this.creditNoteTransferService
          .getCreditNotesDetailsById(action.payload)
          .pipe(
            map(
              (response: CNDetailsInfo) =>
                new CreditNoteTransferActions.GetCreditNoteDetailsByIdSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.GetCreditNoteDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.GetCreditNoteDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  raiseTransferRequest$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.RAISE_TRANSFER_REQUEST,
    {
      run: (action: CreditNoteTransferActions.RaiseTransferRequest) => {
        return this.creditNoteTransferService
          .raiseTransferRequest(action.payload)
          .pipe(
            map(
              (response: { requestNo: string }) =>
                new CreditNoteTransferActions.RaiseTransferRequestSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.RaiseTransferRequest,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.RaiseTransferRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  CNOutwardTransfer$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.LEGACY_CN_OUTWARD_TRANSFER,
    {
      run: (action: CreditNoteTransferActions.LegacyCNOutwardTransfer) => {
        return this.creditNoteTransferService
          .legacyCNOutwardTransfer(action.payload)
          .pipe(
            map(
              response =>
                new CreditNoteTransferActions.LegacyCNOutwardTransferSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.LegacyCNOutwardTransfer,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.LegacyCNOutwardTransferFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  CNInwardTransfer$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.LEGACY_CN_INWARD_TRANSFER,
    {
      run: (action: CreditNoteTransferActions.LegacyCNInwardTransfer) => {
        return this.creditNoteTransferService
          .legacyCNInwardTransfer(action.payload)
          .pipe(
            map(
              response =>
                new CreditNoteTransferActions.LegacyCNInwardTransferSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.LegacyCNInwardTransfer,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.LegacyCNInwardTransferFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSentRequests$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.LOAD_TRANSFER_REQUESTS,
    {
      run: (action: CreditNoteTransferActions.LoadTransferRequests) => {
        return this.creditNoteTransferService
          .loadRequests(action.payload)
          .pipe(
            map(
              (response: SendRequestResponsePayload) =>
                new CreditNoteTransferActions.LoadTransferRequestsSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.LoadTransferRequests,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.LoadTransferRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  inwardCn$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.INWARD_CN,
    {
      run: (action: CreditNoteTransferActions.InwardCreditNote) => {
        return this.creditNoteTransferService
          .inwardCn(action.payload)
          .pipe(
            map(
              (response: CNDetailsInfo) =>
                new CreditNoteTransferActions.InwardCreditNoteSuccess(response)
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.InwardCreditNote,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.InwardCreditNoteFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  approveOrRejectCnRequest$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.APPROVE_OR_REJECT_CN_TRANSFER,
    {
      run: (action: CreditNoteTransferActions.ApproveOrRejectCnTransfer) => {
        return this.creditNoteTransferService
          .approveOrRejectCnTransferRequest(action.payload)
          .pipe(
            map(
              (response: boolean) =>
                new CreditNoteTransferActions.ApproveOrRejectCnTransferSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.ApproveOrRejectCnTransfer,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.ApproveOrRejectCnTransferFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  cancelCN$ = this.dataPersistence.fetch(
    CreditNotetransferActionTypes.CANCEL_CN_TRANSFER_REQUEST,
    {
      run: (action: CreditNoteTransferActions.CancelCnTransferRequest) => {
        return this.creditNoteTransferService
          .cancelCN(action.payload)
          .pipe(
            map(
              (response: boolean) =>
                new CreditNoteTransferActions.CancelCnTransferRequestSuccess(
                  response
                )
            )
          );
      },
      onError: (
        action: CreditNoteTransferActions.CancelCnTransferRequest,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteTransferActions.CancelCnTransferRequestFailure(
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
