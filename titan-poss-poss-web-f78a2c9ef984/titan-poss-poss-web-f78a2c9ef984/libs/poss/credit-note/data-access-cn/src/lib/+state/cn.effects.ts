import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';

import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  CnRefundAmountDetails,
  CreditNoteDetails,
  CreditNoteSearchResult,
  CustomErrors,
  SentRequestResponse,
  TransferedCNS,
  TransferToEghs
} from '@poss-web/shared/models';
import { CreditNoteActionTypes } from './cn.actions';
import { CreditNoteService } from '../cn.service';
import * as CreditNoteActions from './cn.actions';
@Injectable()
export class CreditNoteEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private creditNoteService: CreditNoteService
  ) {}

  @Effect()
  searchCreditNote$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.SEARCH_CREDIT_NOTES,
    {
      run: (action: CreditNoteActions.SearchCreditNotes) => {
        return this.creditNoteService
          .searchCreditNotes(action.payload)
          .pipe(
            map(
              (searchResponse: {
                searchResult: CreditNoteSearchResult[];
                count: number;
              }) =>
                new CreditNoteActions.SearchCreditNotesSuccess(searchResponse)
            )
          );
      },
      onError: (
        action: CreditNoteActions.SearchCreditNotes,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.SearchCreditNotesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  creditNoteDetailsById$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CREDIT_NOTE_DETAILS_BY_ID,
    {
      run: (action: CreditNoteActions.CreditNoteDetailsById) => {
        return this.creditNoteService
          .loadCreditNote(action.payload)
          .pipe(
            map(
              (creditNoteDetails: CreditNoteDetails) =>
                new CreditNoteActions.CreditNoteDetailsByIdSuccess(
                  creditNoteDetails
                )
            )
          );
      },
      onError: (
        action: CreditNoteActions.CreditNoteDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.CreditNoteDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sentRequest$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.RAISE_REQUEST,
    {
      run: (action: CreditNoteActions.RaiseRequest) => {
        return this.creditNoteService
          .raiseRequest(action.payload)
          .pipe(
            map(
              (requestId: string) =>
                new CreditNoteActions.RaiseRequestSuccess(requestId)
            )
          );
      },
      onError: (
        action: CreditNoteActions.RaiseRequest,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.RaiseRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSentRequests$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.LOAD_SENT_REQUESTS,
    {
      run: (action: CreditNoteActions.LoadSentRequests) => {
        return this.creditNoteService
          .loadSentRequests(action.payload)
          .pipe(
            map(
              (response: {
                requestSentResponse: SentRequestResponse[];
                count: number;
              }) => new CreditNoteActions.LoadSentRequestsSuccess(response)
            )
          );
      },
      onError: (
        action: CreditNoteActions.LoadSentRequests,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.LoadSentRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchRequest$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.SEARCH_REQUEST,
    {
      run: (action: CreditNoteActions.SearchRequst) => {
        return this.creditNoteService
          .loadSentRequests(action.payload)
          .pipe(
            map(
              (response: {
                requestSentResponse: SentRequestResponse[];
                count: number;
              }) => new CreditNoteActions.SearchRequstSuccess(response)
            )
          );
      },
      onError: (
        action: CreditNoteActions.SearchRequst,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.SearchRequstFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmRequestType$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CONFIGRM_REQUEST_TYPE,
    {
      run: (action: CreditNoteActions.ConfirmRequestType) => {
        return this.creditNoteService
          .confirmRequest(action.payload)
          .pipe(
            map(
              (cnNumber: number) =>
                new CreditNoteActions.ConfirmRequestTypeSuccess(cnNumber)
            )
          );
      },
      onError: (
        action: CreditNoteActions.ConfirmRequestType,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.ConfirmRequestTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRequest$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.LOAD_REQUEST_BY_ID,
    {
      run: (action: CreditNoteActions.LoadRequestById) => {
        return this.creditNoteService
          .loadRequestById(action.payload)
          .pipe(
            map(
              (response: SentRequestResponse) =>
                new CreditNoteActions.LoadRequestByIdSuccess(response)
            )
          );
      },
      onError: (
        action: CreditNoteActions.LoadRequestById,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.LoadRequestByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  transfetToEghs$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.TRANSFER_TO_EGHS,
    {
      run: (action: CreditNoteActions.TransfetToEghs) => {
        return this.creditNoteService
          .transferToEghs(action.payload)
          .pipe(
            map(
              (data: TransferToEghs) =>
                new CreditNoteActions.TransfetToEghsSuccess(data)
            )
          );
      },
      onError: (
        action: CreditNoteActions.TransfetToEghs,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.TransfetToEghsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadTransferedCNS$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.LOAD_TRANSFERED_CNS,
    {
      run: (action: CreditNoteActions.LoadTransferedCNS) => {
        return this.creditNoteService
          .loadTransferedCNs()
          .pipe(
            map(
              (transferedCNs: {
                transferedCNs: TransferedCNS[];
                totalCount: number;
              }) =>
                new CreditNoteActions.LoadTransferedCNSSuccess(transferedCNs)
            )
          );
      },
      onError: (
        action: CreditNoteActions.LoadTransferedCNS,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.LoadTransferedCNSFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  downloadCN$ = this.dataPersistence.fetch(CreditNoteActionTypes.DOWNLOAD_CN, {
    run: (action: CreditNoteActions.DownloadCN) => {
      return this.creditNoteService
        .downloadCN(action.payload)
        .pipe(map(() => new CreditNoteActions.DownloadCNSuccess()));
    },
    onError: (
      action: CreditNoteActions.DownloadCN,
      error: HttpErrorResponse
    ) => {
      return new CreditNoteActions.DownloadCNFailure(this.errorHandler(error));
    }
  });

  @Effect()
  cancelRequest$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CANCEL_REQUEST,
    {
      run: (action: CreditNoteActions.CancelRequest) => {
        return this.creditNoteService
          .cancelRequest(action.payload)
          .pipe(map(() => new CreditNoteActions.CancelRequestSuccess()));
      },
      onError: (
        action: CreditNoteActions.CancelRequest,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.CancelRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  searchTransferedCN$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.SEARCH_TRANSFERED_CNS,
    {
      run: (action: CreditNoteActions.SearchTrasnferedCN) => {
        return this.creditNoteService
          .searchTransferedCN(action.payload)
          .pipe(
            map(
              (transferedCNs: {
                searchResult: CreditNoteSearchResult[];
                count: number;
              }) =>
                new CreditNoteActions.SearchTrasnferedCNSuccess(transferedCNs)
            )
          );
      },
      onError: (
        action: CreditNoteActions.SearchTrasnferedCN,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.SearchTransferedCNFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  calculateCnRefundAmount$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CALCULATE_CN_REFUND_AMOUNT,
    {
      run: (action: CreditNoteActions.CalculateCnRefundAmount) => {
        return this.creditNoteService
          .calculateCnRefundAmount(action.payload)
          .pipe(
            map(
              (data: CnRefundAmountDetails) =>
                new CreditNoteActions.CalculateCnRefundAmountSuccess(data)
            )
          );
      },
      onError: (
        action: CreditNoteActions.CalculateCnRefundAmount,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.CalculateCnRefundAmountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  cancelAutoApprovedCn$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CANCEL_AUTO_APPROVED_CN,
    {
      run: (action: CreditNoteActions.CancelAutoApprovedCn) => {
        return this.creditNoteService
          .cancelAutoApprovedCn(action.payload)
          .pipe(
            map(
              (cnNumber: number) =>
                new CreditNoteActions.CancelAutoApprovedCnSuccess(cnNumber)
            )
          );
      },
      onError: (
        action: CreditNoteActions.CancelAutoApprovedCn,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.CancelAutoApprovedCnFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  cancelRequestApprovedCn$ = this.dataPersistence.fetch(
    CreditNoteActionTypes.CANCEL_REQUEST_APPROVED_CN,
    {
      run: (action: CreditNoteActions.CancelRequestApprovedCn) => {
        return this.creditNoteService
          .cancelRequestApprovedCn(action.payload)
          .pipe(
            map(
              (cnNumber: number) =>
                new CreditNoteActions.CancelRequestApprovedCnSuccess(cnNumber)
            )
          );
      },
      onError: (
        action: CreditNoteActions.CancelRequestApprovedCn,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteActions.CancelRequestApprovedCnFailure(
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
