import * as selectors from './documents-search.selectors';
import { initialState } from './documents-search.reducer';
import { DocumentsSearchState } from './documents-search.state';
import { CustomErrors, InvoiceListResponse } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Documents Search Selector Testing Suite', () => {
  it('Testing selectInvoiceListResponse selector', () => {
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
    const state: DocumentsSearchState = {
      ...initialState,
      invoiceListResponse: payload
    };
    expect(
      selectors.DocumentsSearchSelectors.selectInvoiceListResponse.projector(
        state
      )
    ).toEqual(payload);
  });
  it('Testing selectError selector', () => {
    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );
    const state: DocumentsSearchState = {
      ...initialState,
      hasError: payload
    };
    expect(
      selectors.DocumentsSearchSelectors.selectHasError.projector(state)
    ).toEqual(payload);
  });
  it('Testing selectIsLoading selector', () => {
    const state: DocumentsSearchState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.DocumentsSearchSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
});
