import { DocumentsSearchState } from './documents-search.state';
import {
  initialState,
  DocumentsSearchReducer
} from './documents-search.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './documents-search.actions';
import { InvoiceListResponse } from '@poss-web/shared/models';

describe('DocumentsSearch reducer Testing Suite', () => {
  describe('Testing Get Customer Details For DocumentsSearch Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_INVOICE_LIST', () => {
      const action = new actions.LoadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });
    it('LOAD_INVOICE_LIST_SUCCESS should return Invoice List response', () => {
      const payload: InvoiceListResponse = {
        pageNumber: 1,
        pageSize: 10,
        results: [
          {
            customerId: 123,
            docDate: '123456789',
            docNo: 123,
            documentId: '456-abc',
            documentName: 'CM.pdf',
            fiscalYear: 2021,
            locationCode: 'CPD',
            status: 'CONFIRMED',
            subTxnType: 'NEW_CM',
            transactionId: 'xyz-123-abc-456',
            txnType: 'CM'
          }
        ],
        totalElements: 20,
        totalPages: 2
      };
      const action = new actions.LoadInvoiceListSuccess(payload);
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.invoiceListResponse).toBe(payload);
    });
    it('LOAD_INVOICE_LIST_FAILURE should return error', () => {
      const action = new actions.LoadInvoiceListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.hasError.message).toEqual('some error');
    });
  });

  describe('Testing Document Download Functionality', () => {
    beforeEach(() => {});
    it('Testing DOCUMENT_DOWNLOAD', () => {
      const action = new actions.DownloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    });
    it('DOCUMENT_DOWNLOAD_SUCCESS should download file', () => {
      const action = new actions.DownloadDocumentSuccess();
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });
    it('DOCUMENT_DOWNLOAD_FAILURE should return error', () => {
      const action = new actions.DownloadDocumentFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: DocumentsSearchState = DocumentsSearchReducer(
        initialState,
        action
      );
      expect(result.hasError.message).toEqual('some error');
    });
  });

  it('RESET_DOCUMENTS_SEARCH should reset state', () => {
    const action = new actions.ResetDocumentsSearch();
    const result: DocumentsSearchState = DocumentsSearchReducer(
      initialState,
      action
    );
    expect(result.invoiceListResponse).toBe(null);
  });
});
