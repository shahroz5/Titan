import {
  CNDetailsInfo,
  CustomerPayload,
  LegacyInwardTransferResponsePayload,
  LegacyOutwardTransferResponsePayload,
  LocationSummaryList
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { Moment } from 'moment';
import { requestsAdaptor, RequestsEnity } from './cn-transfer.entity';
import { initialState } from './cn-transfer.reducer';
import * as selectors from './cn-transfer.selector';
import { CreditNoteTransferState } from './cn-transfer.state';
describe('CN Transfer Selector Testing Suite', () => {
  const addCNDetailstToEntities = <T extends CNDetailsInfo>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const createCnTransaferResponse = (
    amount: number,

    approvalLevel?: number,
    approvalStatus?: string,
    approverLocationCode?: string,
    customerId?: number,
    docDate?: Moment,
    id?: string,
    locationCode?: string,
    processId?: string,
    approverRemarks?: string,
    creditNoteType?: string,
    docNo?: number,
    mobileNumber?: string,
    fiscalYear?: number,
    status?: string,
    customerName?: string,
    headerData?: {},
    approvedDate?: Moment,
    taskId?: string,
    approvedBy?: string,
    refDocNo?: number,
    linkedTxnId?: string,
    linkedTxnType?: string,
    refDocType?: string,

    requestedBy?: string
  ): CNDetailsInfo => {
    return {
      amount,
      approvalLevel,
      approvalStatus,
      approverLocationCode,
      customerId,
      docDate,
      id,
      locationCode,
      processId,
      approverRemarks,
      creditNoteType,
      docNo,
      mobileNumber,
      fiscalYear,
      status,
      customerName,
      headerData,
      approvedDate,
      taskId,
      approvedBy,
      linkedTxnId,
      refDocNo,
      linkedTxnType,
      refDocType,
      requestedBy
    };
  };
  const cnDetails1 = createCnTransaferResponse(
    1000,
    null,
    'PENDING',
    'CPD',
    60,
    moment(),
    '1234',
    'PTU',
    '12345678',
    'remarks',
    'ADV',
    444,
    '9745512430',
    2021,
    'PENDING',
    'Joe',
    {},
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );

  const cnDetailsArray = [cnDetails1];
  const cnTransferRequests: RequestsEnity = {
    ids: [cnDetails1.processId],
    entities: addCNDetailstToEntities(cnDetailsArray)
  };

  describe('should return the GetLocationCodes related selector values', () => {
    it('selectLocationCodes Should return the config  list', () => {
      const payload: LocationSummaryList[] = [
        { description: 'CPD', locationCode: 'CPD' }
      ];

      const state: CreditNoteTransferState = {
        ...initialState,
        locationCodes: payload
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectLocationCodes.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectError Should return the error object', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectError.projector(state)
      ).toEqual({
        error: null,
        timeStamp: '',
        traceId: '',
        code: '',
        message: ''
      });
    });
    it('selectIsLoading Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('selectCreditNoteSearchResult Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        creditNoteSearchResult: [
          {
            amount: 1000,
            creditNoteType: 'ADV',
            customerName: 'Joe',
            docDate: moment(1626394585),
            docNo: 10,
            fiscalYear: 2021,
            id: '12345678',
            linkedTxnId: null,
            linkedTxnType: null,
            locationCode: 'PTU',
            mobileNumber: '9745512430',
            status: 'OPEN'
          }
        ]
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectCreditNoteSearchResult.projector(
          state
        )
      ).toEqual([
        {
          amount: 1000,
          creditNoteType: 'ADV',
          customerName: 'Joe',
          docDate: moment(1626394585),
          docNo: 10,
          fiscalYear: 2021,
          id: '12345678',
          linkedTxnId: null,
          linkedTxnType: null,
          locationCode: 'PTU',
          mobileNumber: '9745512430',
          status: 'OPEN'
        }
      ]);
    });
    it('selectCreditNoteSearchResultCount Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        searchCount: 10
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectCreditNoteSearchResultCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectCreditNoteDetails Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        creditNoteDetails: {
          amount: 1000,
          approvalLevel: null,
          approvalStatus: 'PENDING',
          approverLocationCode: 'CPD',
          customerId: 60,
          docDate: moment(1626394585),
          id: '1234',
          locationCode: 'PTU',
          processId: '12345678',
          approverRemarks: 'remarks',
          creditNoteType: 'ADV',
          docNo: 444,
          mobileNumber: '9745512430',
          fiscalYear: 2021,
          status: 'PENDING',
          customerName: 'Joe',
          headerData: {},
          approvedDate: null,
          taskId: null,
          approvedBy: null,
          linkedTxnId: null,
          refDocNo: null,
          linkedTxnType: null,
          refDocType: null,
          requestedBy: null
        }
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectCreditNoteDetails.projector(
          state
        )
      ).toEqual({
        amount: 1000,
        approvalLevel: null,
        approvalStatus: 'PENDING',
        approverLocationCode: 'CPD',
        customerId: 60,
        docDate: moment(1626394585),
        id: '1234',
        locationCode: 'PTU',
        processId: '12345678',
        approverRemarks: 'remarks',
        creditNoteType: 'ADV',
        docNo: 444,
        mobileNumber: '9745512430',
        fiscalYear: 2021,
        status: 'PENDING',
        customerName: 'Joe',
        headerData: {},
        approvedDate: null,
        taskId: null,
        approvedBy: null,
        linkedTxnId: null,
        refDocNo: null,
        linkedTxnType: null,
        refDocType: null,
        requestedBy: null
      });
    });
    it('selectRaisedRequestNo Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        raisedRequestNo: '111111'
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectRaisedRequestNo.projector(
          state
        )
      ).toEqual('111111');
    });
    it('selectlegacyOutwardTransferResponsePayload Should return value from the state', () => {
      const payload: LegacyOutwardTransferResponsePayload = {
        status: true,
        errorMessage: ''
      }
      const state: CreditNoteTransferState = {
        ...initialState,
        legacyOutwardTransferResponsePayload: payload
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectlegacyOutwardTransferResponsePayload.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectlegacyOutwardTransferResponsePayload Should return value from the state', () => {
      const payload: LegacyInwardTransferResponsePayload = {
        docNo: 123
      }
      const state: CreditNoteTransferState = {
        ...initialState,
        legacyInwardTransferResponsePayload: payload
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectlegacyInwardTransferResponsePayload.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectRaisedRequestsTotalCount Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        requestsCount: 11
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectRaisedRequestsTotalCount.projector(
          state
        )
      ).toEqual(11);
    });
    it('selectHasCnRequestUpdateStatus Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        hasCnUpdateRequestStatus: true
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectHasCnRequestUpdateStatus.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectCnUpdateResponse Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        creditNoteUpdateResponse: {
          amount: 1000,
          approvalLevel: null,
          approvalStatus: 'PENDING',
          approverLocationCode: 'CPD',
          customerId: 60,
          docDate: moment(1626394585),
          id: '1234',
          locationCode: 'PTU',
          processId: '12345678',
          approverRemarks: 'remarks',
          creditNoteType: 'ADV',
          docNo: 444,
          mobileNumber: '9745512430',
          fiscalYear: 2021,
          status: 'PENDING',
          customerName: 'Joe',
          headerData: {},
          approvedDate: null,
          taskId: null,
          approvedBy: null,
          linkedTxnId: null,
          refDocNo: null,
          linkedTxnType: null,
          refDocType: null,
          requestedBy: null
        }
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectCnUpdateResponse.projector(
          state
        )
      ).toEqual({
        amount: 1000,
        approvalLevel: null,
        approvalStatus: 'PENDING',
        approverLocationCode: 'CPD',
        customerId: 60,
        docDate: moment(1626394585),
        id: '1234',
        locationCode: 'PTU',
        processId: '12345678',
        approverRemarks: 'remarks',
        creditNoteType: 'ADV',
        docNo: 444,
        mobileNumber: '9745512430',
        fiscalYear: 2021,
        status: 'PENDING',
        customerName: 'Joe',
        headerData: {},
        approvedDate: null,
        taskId: null,
        approvedBy: null,
        linkedTxnId: null,
        refDocNo: null,
        linkedTxnType: null,
        refDocType: null,
        requestedBy: null
      });
    });
    it('selectIsApporvedOrRejected Should return value from the state', () => {
      const state: CreditNoteTransferState = {
        ...initialState,
        isApprovedOrRejected: true
      };
      expect(
        selectors.CreditNoteTransferSelectors.selectIsApporvedOrRejected.projector(
          state
        )
      ).toEqual(true);
    });
    // it('should return the razorpayPaymentRequests entity', () => {
    // const state: CreditNoteTransferState = {
    //   ...initialState,
    //   raisedRequests: cnTransferRequests
    // };
    //   const payment = requestsAdaptor.setAll(cnDetailsArray, {
    //     ...requestsAdaptor.getInitialState()
    //   });
    //   expect(selectors.raisedTransferRequests.projector(state)).toEqual(
    //     payment
    //   );
    // });
    // it('should return the selectRazorpayPaymentRequests selector', () => {
    //   expect(
    //     selectors.CreditNoteTransferSelectors.selectRaisedRequests.projector(
    //       cnTransferRequests
    //     )
    //   ).toEqual(cnDetailsArray);
    // });
  });
});
