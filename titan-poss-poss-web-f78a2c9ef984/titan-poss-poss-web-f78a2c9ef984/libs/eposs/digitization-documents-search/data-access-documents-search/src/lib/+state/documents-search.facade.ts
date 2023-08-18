import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DocumentsSearchState } from './documents-search.state';
import * as DocumentsSearchActions from './documents-search.actions';
import { DocumentsSearchSelectors } from './documents-search.selectors';
import {
  CustomErrors,
  FileData,
  InvoiceListPayload,
  InvoiceListResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class DocumentsSearchFacade {
  constructor(private store: Store<DocumentsSearchState>) {}

  private invoiceListResponse$ = this.store.select(
    DocumentsSearchSelectors.selectInvoiceListResponse
  );

  private isLoading$ = this.store.select(
    DocumentsSearchSelectors.selectIsLoading
  );

  private hasError$ = this.store.select(
    DocumentsSearchSelectors.selectHasError
  );

  loadInvoiceList(
    invoiceListPayload: InvoiceListPayload,
    txnType: string,
    page: number,
    size: number
  ) {
    this.store.dispatch(
      new DocumentsSearchActions.LoadInvoiceList(
        invoiceListPayload,
        txnType,
        page,
        size
      )
    );
  }

  downloadDocument(payload: FileData) {
    this.store.dispatch(new DocumentsSearchActions.DownloadDocument(payload));
  }

  resetInvoiceList() {
    this.store.dispatch(new DocumentsSearchActions.ResetDocumentsSearch());
  }

  getInvoiceListResponse(): Observable<InvoiceListResponse> {
    return this.invoiceListResponse$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getError(): Observable<CustomErrors> {
    return this.hasError$;
  }
}
