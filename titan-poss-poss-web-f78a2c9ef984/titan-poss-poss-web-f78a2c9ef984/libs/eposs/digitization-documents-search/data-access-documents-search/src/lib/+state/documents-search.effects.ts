import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors } from '@poss-web/shared/models';
import { DocumentsSearchService } from '../documents-search.service';
import { DocumentsSearchActionTypes } from './documents-search.actions';
import * as DocumentsSearchActions from './documents-search.actions';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class DocumentsSearchEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public documentsSearchService: DocumentsSearchService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  documentsSearchService$: Observable<Action> = this.dataPersistence.fetch(
    DocumentsSearchActionTypes.LOAD_INVOICE_LIST,
    {
      run: (action: DocumentsSearchActions.LoadInvoiceList) => {
        return this.documentsSearchService
          .getInvoiceList(
            action.payload,
            action.txnType,
            action.page,
            action.size
          )
          .pipe(
            map(data => new DocumentsSearchActions.LoadInvoiceListSuccess(data))
          );
      },
      onError: (
        action: DocumentsSearchActions.LoadInvoiceList,
        error: HttpErrorResponse
      ) => {
        return new DocumentsSearchActions.LoadInvoiceListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  DownloadDocument = this.dataPersistence.fetch(
    DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD,
    {
      run: (action: DocumentsSearchActions.DownloadDocument) => {
        return this.documentsSearchService
          .getDocumentDownloadResponse(action.payload)
          .pipe(
            map(() => new DocumentsSearchActions.DownloadDocumentSuccess())
          );
      },
      onError: (
        action: DocumentsSearchActions.DownloadDocument,
        error: HttpErrorResponse
      ) => {
        return new DocumentsSearchActions.DownloadDocumentFailure(
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
