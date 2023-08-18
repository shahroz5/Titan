import {
  CnRefundAmountDetails,
  CreditNoteDetails,
  CreditNoteSearch,
  CreditNoteSearchResult,
  CustomErrors,
  SentRequestResponse,
  TransferedCNS,
  TransferToEghs
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { sentRequestAdaptor, transferedCNsAdaptor } from './cn.entity';
import { initialState } from './cn.reducer';
import * as selectors from './cn.selector';
import { CreditNoteSelectors } from './cn.selector';
import { CreditNoteState } from './cn.state';

describe('CreditNote Selectors Testing Suite', () => {
  const search: CreditNoteSearch = {
    cnNumber: '123',
    mobileNumber: '9010462816',
    fiscalYear: '2021'
  };
  const sentRequestResponse: SentRequestResponse = {
    docNo: 12,
    fiscalYear: 2021,
    cnType: 'ADVANCE',
    amount: '1000',
    custName: 'Srinivas',
    reqDate: moment(12333),
    status: 'open',
    id: 'abc123',
    processId: 'abc',
    requestorRemarks: 'good',
    frozenRateDetails: {},
    approvalStatus: 'open',
    createdDate: moment('1233'),
    custId: 'abc456',
    cnNumber: 'abc890'
  };
  const creditNoteSearchResult: CreditNoteSearchResult[] = [
    {
      amount: 123,
      creditNoteType: 'ADVANCE',
      customerName: 'Srinivas',
      docDate: moment('123'),
      docNo: 123,
      fiscalYear: 2021,
      id: 'abc123',
      linkedTxnId: 'abc123',
      linkedTxnType: 'abc',
      locationCode: 'URB',
      mobileNumber: '9010462817',
      status: 'open',
      customerId: '2',
      frozenRateDetails: {},
      accountNumber: '12'
    }
  ];
  const creditNoteDetails: CreditNoteDetails = {
    id: 'abc123',
    docNo: 123,
    fiscalYear: 2021,
    customerName: 'Srinivas',
    customerId: 123,
    locationCode: 'URB',
    creditNoteType: 'ADVANCE',
    docDate: moment(123),
    amount: 1000,
    status: 'open',
    linkedTxnType: 'abc',
    mobileNumber: '9010462817',
    linkedTxnId: 'abc123',
    refDocNo: 123,
    refDocType: 'abc',
    workflowStatus: 'REMOVE_GOLD_RATE',
    frozenRateDetails: {}
  };

  const transferdCNs: TransferedCNS[] = [
    {
      creditNoteType: 'AdVANCE',
      amount: 1000,
      ghsDiscount: 12,
      docNo: 12,
      fiscalYear: 2021,
      customerName: 'srinivas',
      customerId: 12,
      mobileNumber: '9010462817',
      ulpId: '9010462817',
      status: 'open',
      ghsDocNo: '13'
    }
  ];
  const sentRequests = [sentRequestResponse];
  const sentRequestEntity = sentRequestAdaptor.setAll(sentRequests, {
    ...sentRequestAdaptor.getInitialState()
  });

  const trasnferedCNs = [transferdCNs];
  const trasnferedCNsEntity = transferedCNsAdaptor.setAll(transferdCNs, {
    ...transferedCNsAdaptor.getInitialState()
  });
  const calculateCnRefundAmountSuccess: CnRefundAmountDetails = {
    amount: 12345,
    deductionPercentage: '2',
    fullAdvCNPaymentMode: 'CASH',
    netRefundAmount: 12245,
    allowedRefundPaymentModes: [
      {
        description: 'CASH',
        value: 'CASH'
      }
    ],
    refundDeductionAmount: 100,
    totalTax: 100,
    utilisedAmount: 100
  };

  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: CreditNoteState = {
      ...initialState,
      error: error
    };
    expect(CreditNoteSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return the isLoading ', () => {
    const state: CreditNoteState = {
      ...initialState,
      isLoading: true
    };
    expect(CreditNoteSelectors.selectIsLoading.projector(state)).toEqual(true);
  });

  it('Should return the requestId ', () => {
    const state: CreditNoteState = {
      ...initialState,
      requestNo: 'abc123'
    };
    expect(CreditNoteSelectors.selectRequestId.projector(state)).toEqual(
      'abc123'
    );
  });

  it('Should return the search ', () => {
    const state: CreditNoteState = {
      ...initialState,
      search: search
    };
    expect(CreditNoteSelectors.selectSearch.projector(state)).toEqual(search);
  });

  it('Should return the search ', () => {
    const state: CreditNoteState = {
      ...initialState,
      count: 12
    };
    expect(CreditNoteSelectors.selectTotalCount.projector(state)).toEqual(12);
  });
  it('Should return the hasSearched ', () => {
    const state: CreditNoteState = {
      ...initialState,
      hasSearched: true
    };
    expect(CreditNoteSelectors.selectHasSearched.projector(state)).toEqual(
      true
    );
  });

  it('Should return the request ', () => {
    const state: CreditNoteState = {
      ...initialState,
      request: sentRequestResponse
    };
    expect(CreditNoteSelectors.selectRequest.projector(state)).toEqual(
      sentRequestResponse
    );
  });

  it('Should return the cnNumber ', () => {
    const state: CreditNoteState = {
      ...initialState,
      cnNumber: 123
    };
    expect(CreditNoteSelectors.selectCNNumber.projector(state)).toEqual(123);
  });

  it('Should return the requestType ', () => {
    const state: CreditNoteState = {
      ...initialState,
      requestType: 'RemoveGoldRate'
    };
    expect(CreditNoteSelectors.selectRequestType.projector(state)).toEqual(
      'RemoveGoldRate'
    );
  });

  it('Should return the sentRequestsEntity', () => {
    const state: CreditNoteState = {
      ...initialState,
      sentRequests: sentRequestEntity
    };
    expect(selectors.sentRequests.projector(state)).toEqual(sentRequestEntity);
  });

  it('Should return the sentRequests', () => {
    expect(
      CreditNoteSelectors.selectSentRequests.projector(sentRequestEntity)
    ).toEqual(sentRequests);
  });

  it('Should return the searchRequestsEntity', () => {
    const state: CreditNoteState = {
      ...initialState,
      searchRequests: sentRequestEntity
    };
    expect(selectors.searchRequests.projector(state)).toEqual(
      sentRequestEntity
    );
  });

  it('Should return the sentRequests', () => {
    expect(
      CreditNoteSelectors.selectSearchRequests.projector(sentRequestEntity)
    ).toEqual(sentRequests);
  });

  it('Should return the creditNoteSearchResult ', () => {
    const state: CreditNoteState = {
      ...initialState,
      creditNoteSearchResult: creditNoteSearchResult
    };
    expect(
      CreditNoteSelectors.selectCreditNoteSearchResult.projector(state)
    ).toEqual(creditNoteSearchResult);
  });

  it('Should return the creditNoteDetails ', () => {
    const state: CreditNoteState = {
      ...initialState,
      creditNoteDetails: creditNoteDetails
    };
    expect(
      CreditNoteSelectors.selectCreditNoteDetails.projector(state)
    ).toEqual(creditNoteDetails);
  });

  it('Should return the requestNumber ', () => {
    const payload: TransferToEghs = {
      balanceAmtCnDocNo: 123,
      amount: 12,
      cashCollected: 10,
      docNo: 12,
      id: 'abc123'
    };
    const state: CreditNoteState = {
      ...initialState,
      transferToEghs: payload
    };
    expect(
      CreditNoteSelectors.selecttransferToEghsDetails.projector(state)
    ).toEqual(payload);
  });

  it('Should return the downloadCN ', () => {
    const state: CreditNoteState = {
      ...initialState,
      downloadCN: true
    };
    expect(CreditNoteSelectors.selectDownloadCN.projector(state)).toEqual(true);
  });

  it('Should return the totalCount ', () => {
    const state: CreditNoteState = {
      ...initialState,
      totalCount: 1
    };
    expect(CreditNoteSelectors.selectCNsCount.projector(state)).toEqual(1);
  });

  it('Should return the hasCancelled ', () => {
    const state: CreditNoteState = {
      ...initialState,
      hasCancelled: true
    };
    expect(CreditNoteSelectors.selectHasCancelled.projector(state)).toEqual(
      true
    );
  });

  it('Should return the totalElements ', () => {
    const state: CreditNoteState = {
      ...initialState,
      totalElements: 1
    };
    expect(CreditNoteSelectors.selectTotalElements.projector(state)).toEqual(1);
  });

  it('Should return the transferedCNsEntity', () => {
    const state: CreditNoteState = {
      ...initialState,
      transferedCNs: trasnferedCNsEntity
    };
    expect(selectors.transferedCNs.projector(state)).toEqual(
      trasnferedCNsEntity
    );
  });

  it('Should return the transferedCNs', () => {
    expect(
      CreditNoteSelectors.selectTransfteredCNs.projector(trasnferedCNsEntity)
    ).toEqual(transferdCNs);
  });
  it('Should return the selectCnRefundAmountDetails ', () => {
    const state: CreditNoteState = {
      ...initialState,
      refundAmountDetails: calculateCnRefundAmountSuccess
    };
    expect(
      CreditNoteSelectors.selectCnRefundAmountDetails.projector(state)
    ).toEqual(calculateCnRefundAmountSuccess);
  });
});
