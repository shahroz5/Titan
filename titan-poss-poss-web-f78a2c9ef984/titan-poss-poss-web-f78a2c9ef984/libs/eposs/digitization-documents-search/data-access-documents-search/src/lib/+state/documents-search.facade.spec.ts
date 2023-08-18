import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DocumentsSearchFacade } from './documents-search.facade';
import { DocumentsSearchState } from './documents-search.state';

import {
  DownloadDocument,
  LoadInvoiceList,
  ResetDocumentsSearch
} from './documents-search.actions';

describe('Gift cards facade Testing Suite', () => {
  const initialState: DocumentsSearchState = {
    invoiceListResponse: null,
    hasError: null,
    isLoading: null
  };

  let documentsSearchFacade: DocumentsSearchFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), DocumentsSearchFacade]
    });

    documentsSearchFacade = TestBed.inject(DocumentsSearchFacade);
  });

  describe('Load Invoice List', () => {
    it('should dispatch LoadInvoiceList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      documentsSearchFacade.loadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      documentsSearchFacade.getInvoiceListResponse();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Download Document', () => {
    it('should dispatch DownloadDocument action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new DownloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      documentsSearchFacade.downloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Reset Invoice List', () => {
    it('should dispatch ResetDocumentsSearch action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetDocumentsSearch();
      documentsSearchFacade.resetInvoiceList();
      documentsSearchFacade.getIsLoading();
      documentsSearchFacade.getError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
