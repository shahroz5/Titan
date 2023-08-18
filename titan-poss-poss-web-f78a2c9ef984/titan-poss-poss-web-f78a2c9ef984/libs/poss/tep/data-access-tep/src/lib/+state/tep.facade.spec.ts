import {
  ClearSearchList,
  SetDropownValues,
  ResetValues,
  SetSearchValues,
  LoadRequests,
  SetRefundDropownValues,
  ResetSearchValues,
  LoadWorkflowDeatils,
  ApproveRefundOrderDeatils,
  SetHistoryTEPSearchParamDetails,
  LoadRefundOrderDeatils,
  LoadRefundRequests,
  LoadTEPHistory,
  SearchTEP,
  GetTepItemConfiguration
} from './tep.actions';
import { TEPRequestState } from './tep.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { TEPRequestFacade } from './tep.facade';
import {
  TEPRefundStatusListAdapter,
  TEPRequestStatusListAdapter
} from './tep.entity';
import * as moment from 'moment';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  CustomErrors,
  RequestPayload,
  ABRequestStatusList,
  ABRequestStatusDownValues,
  ABSearchValues,
  AdvanceBookingSearchPayload,
  workflowPayload,
  RefundStatusCount,
  RefundRequestPayload,
  GetTepItemConfiguratonResponse,
  TEPSearchResponse,
  HistorySearchParamDetails,
  AdvanceHistoryItemsRequestPayload
} from '@poss-web/shared/models';

import { ErrorEnums } from '@poss-web/shared/util-error';

const requestPayload: RequestPayload = {
  httpMethod: 'string',
  relativeUrl: '',
  reqBody: {
    dateRangeType: 'string',
    docNo: 1,
    endDate: moment(),
    fiscalYear: 1,
    startDate: moment()
  },
  requestParams: {
    page: 1,
    size: 0,
    workflowType: 's',
    approvalStatus: 'string',
    sort: 'any'
  }
};
const advanceBookingSearchPayload: AdvanceBookingSearchPayload = {
  docNo: 0,
  page: 0,
  size: 8,
  subTxnType: '',
  txnType: '',
  fiscalYear: 2015
};
const aBRequestStatusDownValues: ABRequestStatusDownValues = {
  status: '',
  type: ''
};
const aBSearchValues: ABSearchValues = {
  doNo: 0,
  fiscalYear: 2016,
  function: '',
  phNo: 810539193
};
const aBRequestStatusList: ABRequestStatusList = {
  pageNumber: 0,
  pageSize: 8,
  response: {},
  results: [],
  totalElements: 8,
  totalPages: 1
};
const WorkflowPayload: workflowPayload = { processId: '', workflowType: '' };
const refundStatusCount: RefundStatusCount = {
  refundList: [],
  totalElements: 1
};
const refundRequestPayload: RefundRequestPayload = {
  id: '',
  txnType: '',
  status: ''
};
const getTepItemConfiguratonResponse: GetTepItemConfiguratonResponse = {
  isCMMandatory: true,
  isQuantityEditable: true,
  isTepAllowed: true,
  isTEPSaleBin: true,
  isCutPieceTepAllowed: true,
  isFVTAllowed: true,
  tepOfferDetails: {
    type: '',
    data: {
      deductionPercent: 0,
      flatTepExchangeValue: 0,
      isWeightToleranceAllowed: true,
      approvedBy: '',
      reasonForException: ''
    }
  },
  goldDeductionPercent: 0,
  silverDeductionPercent: 0,
  platinumDeductionPercent: 0,
  ucpDeductionPercent: 0,
  ucpDeductionFlatValue: [],
  isStoneChargesApplicable: true,
  stoneDeductionPercent: 0,
  cmUnavailableDeductionPercent: 0,
  recoverDiscountPercent: 0,
  refundDeductionPercent: 0,
  weightTolerancePercent: 0,
  isProportionedValue: true,
  typeOfExchange: '',
  isInterBrandTepAllowed: true,
  fvtDeductionPercent: 0,
  tepGeneralCodeConfig: {
    allowedProductGroups: [],
    isCMMandatory: true,
    isValuationAtStore: true
  },
  tepCutPieceConfig: {
    cutPieceItemCode: '',
    weightTolerancePercent: 0
  }
};
const tEPSearchResponse: TEPSearchResponse = { TEPList: [], totalElements: 8 };
const historySearchParamDetails: HistorySearchParamDetails = { cnDocNo: 9 };
const advanceHistoryItemsRequestPayload: AdvanceHistoryItemsRequestPayload = {
  docNo: 4
};

describe('TEP facade Testing Suite action', () => {
  let tEPRequestFacade: TEPRequestFacade;

  //let store: MockStore<UnipayConfigurationState>;
  const initialState: TEPRequestState = {
    hasError: null,
    requestStausDropDownValues: {
      status: 'APPROVED',
      type: 'TEP_APPROVAL_WORKFLOW'
    },
    refundStausDropDownValues: {
      status: 'APPROVAL_PENDING',
      type: 'NEW_TEP',
      refundType: 'CHEQUE'
    },
    isLoading: false,
    refundDetails: null,
    approvedRefundDetails: null,
    searchValues: { function: null, doNo: null, fiscalYear: null, phNo: null },
    searhTEPResponse: null,
    searhTEPResponseCount: 0,
    selectedData: null,
    TEPRequestStatusList: TEPRequestStatusListAdapter.getInitialState(),
    TEPRequestStatusListCount: 0,
    tepItemConfiguratonResponse: null,
    historySearchParamDetails: null,
    historyItems: null,

    TEPRefundRequestStatusList: TEPRefundStatusListAdapter.getInitialState(),
    TEPRefundRequestStatusListCount: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TEPRequestFacade]
    });

    tEPRequestFacade = TestBed.inject(TEPRequestFacade);
  });

  describe('Dispatch TEP action', () => {
    it('should call SetRefundDropownValues action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetRefundDropownValues(aBRequestStatusDownValues);
      tEPRequestFacade.setRefundDropDownValue(aBRequestStatusDownValues);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call SearchTEP action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SearchTEP();
      tEPRequestFacade.searchTEP();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadRequests action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadRequests(requestPayload);
      tEPRequestFacade.loadRequests(requestPayload);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadworkflowProcessDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new LoadWorkflowDeatils(WorkflowPayload);
        tEPRequestFacade.loadworkflowProcessDetails(WorkflowPayload);
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));

    it('should call loadTepRefundDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadRefundOrderDeatils(refundRequestPayload);
      tEPRequestFacade.loadTepRefundDetails(refundRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call ApproveRefundDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ApproveRefundOrderDeatils(refundRequestPayload);
      tEPRequestFacade.ApproveRefundDetails(refundRequestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadTEPHistory action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadTEPHistory(
        advanceHistoryItemsRequestPayload,
        '',
        '',
        '',
        0,
        0,
        '',
        ''
      );
      tEPRequestFacade.loadTEPHistory(
        advanceHistoryItemsRequestPayload,
        '',
        '',
        '',
        0,
        0,
        '',
        ''
      );

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call setDropDownValue action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetDropownValues(aBRequestStatusDownValues);
      tEPRequestFacade.setDropDownValue(aBRequestStatusDownValues);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call setSearchValue action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new SetSearchValues(aBSearchValues);
      tEPRequestFacade.setSearchValue(aBSearchValues);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call clearSearchList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ClearSearchList();
      tEPRequestFacade.clearSearchList();
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call loadRefundRequests action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new LoadRefundRequests(requestPayload);
      tEPRequestFacade.loadRefundRequests(requestPayload);
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call loadTepItemConfiguration action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new GetTepItemConfiguration('', '', '');
      tEPRequestFacade.loadTepItemConfiguration('', '', '');
      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
    it('should call setHistorySearchParamDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const action = new SetHistoryTEPSearchParamDetails(
          historySearchParamDetails
        );
        tEPRequestFacade.setHistorySearchParamDetails(
          historySearchParamDetails
        );
        expect(storeSpy).toHaveBeenCalledWith(action);
      }
    ));
  });

  describe('TEP action', () => {
    it('should get getSelectedData data', () => {
      expect(tEPRequestFacade.getSelectedData()).toBeTruthy();
    });
    it('should get getSearchValues data', () => {
      expect(tEPRequestFacade.getSearchValues()).toBeTruthy();
    });

    it('should get getIsLoading data', () => {
      expect(tEPRequestFacade.getIsLoading()).toBeTruthy();
    });

    it('should get getDropdownValue data', () => {
      expect(tEPRequestFacade.getDropdownValue()).toBeTruthy();
    });

    it('should get getSelectedRequests data', () => {
      expect(tEPRequestFacade.getSelectedRequests()).toBeTruthy();
    });

    it('should get getHasError data', () => {
      expect(tEPRequestFacade.getHasError()).toBeTruthy();
    });

    it('should get getSearchTEPCount data', () => {
      expect(tEPRequestFacade.getSearchTEPCount()).toBeTruthy();
    });

    it('should get getRSODetails data', () => {
      expect(tEPRequestFacade.getTepItemConfiguratonResponse()).toBeTruthy();
    });
    it('should get getTEPHistoryItems data', () => {
      expect(tEPRequestFacade.getTEPHistoryItems()).toBeTruthy();
    });

    it('should get getRequestCount data', () => {
      expect(tEPRequestFacade.getRequestCount()).toBeTruthy();
    });

    it('should get getSelectedRefundRequests data', () => {
      expect(tEPRequestFacade.getSelectedRefundRequests()).toBeTruthy();
    });

    it('should get getRefundCount data', () => {
      expect(tEPRequestFacade.getRefundCount()).toBeTruthy();
    });
  });
});
