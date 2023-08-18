import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, InvoiceListResponse } from '@poss-web/shared/models';
import {
  DocumentsSearchActionTypes,
  DownloadDocument,
  DownloadDocumentFailure,
  DownloadDocumentSuccess,
  LoadInvoiceList,
  LoadInvoiceListFailure,
  LoadInvoiceListSuccess,
  ResetDocumentsSearch
} from './documents-search.actions';

describe('Document Search Action Testing Suite', () => {
  describe('LoadInvoiceList Action Test Cases', () => {
    it('should check correct type is used for LoadInvoiceList action ', () => {
      const action = new LoadInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      );
      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.LOAD_INVOICE_LIST,
        payload: { docNo: 123 },
        txnType: 'CM',
        page: 1,
        size: 10
      });
    });
    it('should check correct type is used for LoadInvoiceListSuccess action ', () => {
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
      const action = new LoadInvoiceListSuccess(payload);

      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.LOAD_INVOICE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadInvoiceListFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadInvoiceListFailure(payload);
      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.LOAD_INVOICE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('DownloadDocument Action Test Cases', () => {
    it('should check correct type is used for DownloadDocument action ', () => {
      const action = new DownloadDocument({
        id: '123',
        locationCode: 'CPD'
      });
      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD,
        payload: { id: '123', locationCode: 'CPD' }
      });
    });
    it('should check correct type is used for DownloadDocumentSuccess action ', () => {
      const action = new DownloadDocumentSuccess();

      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_SUCCESS
      });
    });
    it('should check correct type is used for  DownloadDocumentFailure Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DownloadDocumentFailure(payload);
      expect({ ...action }).toEqual({
        type: DocumentsSearchActionTypes.DOCUMENT_DOWNLOAD_FAILURE,
        payload
      });
    });
  });

  it('should check correct type is used for ResetDocumentsSearch action ', () => {
    const action = new ResetDocumentsSearch();

    expect({ ...action }).toEqual({
      type: DocumentsSearchActionTypes.RESET_DOCUMENTS_SEARCH
    });
  });
});
