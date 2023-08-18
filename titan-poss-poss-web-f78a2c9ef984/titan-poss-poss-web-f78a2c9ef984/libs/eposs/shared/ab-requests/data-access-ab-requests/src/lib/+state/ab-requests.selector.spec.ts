import { ABRequests } from '@poss-web/shared/models';
// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalList
} from '@poss-web/shared/models';

import { initialState } from './ab-requests.reducer';
import * as selectors from './ab-requests.selector';

import { AbRequestsState } from './ab-requests.state';
import { ABDetailsAdapter, ABDetailsEntity } from './ab-requests.entity';

const requestApprovalListResponse = [
  {
    approvedBy: 'Abc',
    invoiceNo: 788,
    approvedDate: null,
    approverRemarks: 'Abc',
    docDate: null,
    docNo: 89,
    fiscalYear: 89,
    headerData: null,
    customerName: 'Abc',
    totalAmount: 78999,
    locationCode: 'Abc',
    mobileNumber: 907890000,
    abDocNo: 89,
    processId: 'Abc',
    requestedBy: 'Abc',
    requestedDate: null,
    requestorRemarks: 'Abc',
    taskId: 'Abc',
    taskName: 'Abc',
    workflowType: 'Abc'
  }
];

describe('RequestApprovalState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing RequestApprovalState related Selectors', () => {
    const itemDetailsArray = requestApprovalListResponse;
    const itemDetailsEntity = ABDetailsAdapter.setAll(itemDetailsArray, {
      ...ABDetailsAdapter.getInitialState()
    });
    it('Should return Item Entity', () => {
      const state: AbRequestsState = {
        ...initialState,
        abRequests: itemDetailsEntity
      };
      expect(
        selectors.ABRequestsSelector.selectabRequests.projector(
          itemDetailsEntity
        )
      ).toEqual(itemDetailsArray);
    });

    it('selectApprovedRoRequestList Should return the ro request list', () => {
      const requestApprovalList = [
        {
          approvedBy: '',
          approvedDate: 1,
          rejectedRemarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11'
        }
      ];
      const state: AbRequestsState = {
        ...initialState,
        abRequestsDetail: requestApprovalList
      };
      expect(
        selectors.ABRequestsSelector.selectApprovedDetail.projector(state)
      ).toEqual(requestApprovalList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: AbRequestsState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ABRequestsSelector.selectLoading.projector(state)
      ).toEqual(true);
    });
    it('selectlocation Should return the true or false', () => {
      const state: AbRequestsState = {
        ...initialState,
        locations: null
      };
      expect(
        selectors.ABRequestsSelector.selectLocation.projector(state)
      ).toEqual(null);
    });
    it('selectError Should return the error object', () => {
      const state: AbRequestsState = {
        ...initialState,
        hasError: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.ABRequestsSelector.selecthasError.projector(state)
      ).toEqual(error);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: AbRequestsState = {
        ...initialState,
        abRequestsCount: 10
      };
      expect(
        selectors.ABRequestsSelector.selectabRequestCount.projector(state)
      ).toEqual(10);
    });
  });
});
