import {
  LoadWorkflowDeatils
 , LoadWorkflowDeatilsFailure
 , LoadWorkflowDeatilsSuccess
 , ClearSearchList
 , SetDropownValues
 , SetRefundDropownValues
 , ResetSearchValues
 , SetSearchValues
 , ApproveRefundOrderDeatils
 , ApproveRefundOrderDeatilsFailure
 , ApproveRefundOrderDeatilsSuccess
 , SetHistoryTEPSearchParamDetails
 , ResetValues
 , LoadRefundOrderDeatils
 , LoadRefundOrderDeatilsSuccess
 , LoadRefundOrderDeatilsFailure
 , LoadRefundRequests
 , LoadRefundRequestsSuccess
 , LoadRefundRequestsFailure
 , LoadRequests
 , LoadRequestsSuccess
 , LoadRequestsFailure
 , LoadTEPHistory
 , LoadTEPHistorySuccess
 , LoadTEPHistoryFailure
 , SearchTEPSuccess
 , SearchTEPFailure
 , SearchTEP
 , GetTepItemConfiguration
 , GetTepItemConfigurationSuccess
 , GetTepItemConfigurationFailure
 ,TEPRequestActionTypes

} from './tep.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { TEPRequestReducer, initialState } from './tep.reducer';
import { TEPRequestState } from './tep.state';
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
import * as moment from 'moment';

describe('TEP Reducer Testing Suite', () => {
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
  const WorkflowPayload: workflowPayload={processId:'',workflowType:''};
  const  refundStatusCount:RefundStatusCount={refundList:[],totalElements:1};
  const refundRequestPayload:RefundRequestPayload={id:'', txnType:'', status:''};
  const getTepItemConfiguratonResponse:GetTepItemConfiguratonResponse={ isCMMandatory: true,
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
        reasonForException: '',
      },
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
      isValuationAtStore: true,
    },
    tepCutPieceConfig: {
      cutPieceItemCode: '',
      weightTolerancePercent: 0,
    }}
  const  tEPSearchResponse:TEPSearchResponse={TEPList:[],totalElements:8};
  const historySearchParamDetails:HistorySearchParamDetails={cnDocNo:9};
  const advanceHistoryItemsRequestPayload:AdvanceHistoryItemsRequestPayload={docNo:4}
  



  

  


  describe('Testing LoadWorkflowDeatils Functionality', () => {
    it('LoadWorkflowDeatils should be called', () => {
      const action = new LoadWorkflowDeatils(WorkflowPayload);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadWorkflowDeatilsSuccess should be called', () => {
      const action = new LoadWorkflowDeatilsSuccess('1');
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.selectedData).toBeTruthy();
    });
    it('LoadWorkflowDeatilsFailure should be called', () => {
      const action = new LoadWorkflowDeatilsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ApproveRefundOrderDeatils Functionality', () => {
    it('ApproveRefundOrderDeatils should be called', () => {
      const action = new ApproveRefundOrderDeatils(refundRequestPayload);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ApproveRefundOrderDeatilsSuccess should be called', () => {
      const action = new ApproveRefundOrderDeatilsSuccess(aBRequestStatusList);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.approvedRefundDetails).toBeTruthy();
    });
    it('ApproveRefundOrderDeatilsFailure should be called', () => {
      const action = new ApproveRefundOrderDeatilsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRefundOrderDeatils Functionality', () => {
    it('LoadRefundOrderDeatils should be called', () => {
      const action = new LoadRefundOrderDeatils(
        refundRequestPayload
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadRefundOrderDeatilsSuccess should be called', () => {
      const action = new LoadRefundOrderDeatilsSuccess(
        aBRequestStatusList
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.refundDetails).toBeTruthy();
    });
    it('LoadRefundOrderDeatilsFailure should be called', () => {
      const action = new LoadRefundOrderDeatilsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRefundRequests Functionality', () => {
    it('FreezeAdvanceBooking should be called', () => {
      const action = new LoadRefundRequests(
        requestPayload
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadRefundRequestsSuccess should be called', () => {
      const action = new LoadRefundRequestsSuccess(
        refundStatusCount
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.TEPRefundRequestStatusList).toBeTruthy();
    });
    it('LoadRefundRequestsFailure should be called', () => {
      const action = new LoadRefundRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRequests Functionality', () => {
    it('LoadRequests should be called', () => {
      const action = new LoadRequests(
        requestPayload
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadRequestsSuccess should be called', () => {
      const action = new LoadRequestsSuccess(
        aBRequestStatusList
      );
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.TEPRequestStatusList).toBeTruthy();
    });
    it('LoadRequestsFailure should be called', () => {
      const action = new LoadRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });
  describe('Testing LoadTEPHistory Functionality', () => {
    it('LoadTEPHistory should be called', () => {
      const action = new LoadTEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadTEPHistorySuccess should be called', () => {
      const action = new LoadTEPHistorySuccess(tEPSearchResponse);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.historyItems).toBeTruthy();
    });
    it('LoadTEPHistoryfailure should be called', () => {
      const action = new LoadTEPHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing SearchTEP Functionality', () => {
    it('SearchTEP should be called', () => {
      const action = new SearchTEP(advanceBookingSearchPayload);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('SearchTEPSuccess should be called', () => {
      const action = new SearchTEPSuccess(tEPSearchResponse);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.searhTEPResponse).toBeTruthy();
    });
    it('SearchTEPFailure should be called', () => {
      const action = new SearchTEPFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing GetTepItemConfiguration Functionality', () => {
    it('GetTepItemConfiguration should be called', () => {
      const action = new GetTepItemConfiguration('','','');
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetTepItemConfigurationSuccess should be called', () => {
      const action = new GetTepItemConfigurationSuccess(getTepItemConfiguratonResponse);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.tepItemConfiguratonResponse).toBeTruthy();
    });
    it('GetTepItemConfigurationFailure should be called', () => {
      const action = new GetTepItemConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRequests Functionality', () => {
    it('LoadRequests should be called', () => {
      const action = new LoadRequests(requestPayload);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadRequestsSuccess should be called', () => {
      const action = new LoadRequestsSuccess(aBRequestStatusList);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.TEPRequestStatusList).toBeTruthy();
    });
    it('LoadRequestsFailure should be called', () => {
      const action = new LoadRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });




  describe('Testing Set values Functionality', () => {
    it('SetSearchValues should be called', () => {
      const action = new SetSearchValues(aBSearchValues);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.searchValues).toBeTruthy();
    });

    
    it('SetDropownValues should be called', () => {
      const action = new SetDropownValues(aBRequestStatusDownValues);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('SetHistoryTEPSearchParamDetails should be called', () => {
      const action = new SetHistoryTEPSearchParamDetails(aBRequestStatusDownValues);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ResetValues should be called', () => {
      const action = new ResetValues();
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('SetRefundDropownValues should be called', () => {
      const action = new SetRefundDropownValues(aBRequestStatusDownValues);
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ResetSearchValues should be called', () => {
      const action = new ResetSearchValues();
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ClearSearchList should be called', () => {
      const action = new ClearSearchList();
      const result: TEPRequestState = TEPRequestReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });


    

  
 
  
  });
});
