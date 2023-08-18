
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
import * as moment from 'moment';


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


describe('TEP  Action Testing Suite', () => {
  describe('loadWorkflowDetails Action Test Cases', () => {
    it('should check correct type is used for  loadWorkflowDetails  action ', () => {
      const action = new LoadWorkflowDeatils(WorkflowPayload);

      expect(action.type).toEqual(TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS);

      expect(action.payload).toEqual(WorkflowPayload);
    });
    it('should check correct type is used for LoadWorkflowDeatilsSuccess action ', () => {
      const action = new LoadWorkflowDeatilsSuccess('');

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual('');
    });
    it('should check correct type is used for LoadWorkflowDeatilsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWorkflowDeatilsFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('searchTEP Action Test Cases', () => {
    it('should check correct type is used for  loadWorkflowDetails  action ', () => {
      const action = new SearchTEP(advanceBookingSearchPayload,requestPayload);

      expect(action.type).toEqual(TEPRequestActionTypes.SEARCH_TEP);

      expect(action.payload).toEqual(advanceBookingSearchPayload,requestPayload);
    });
    it('should check correct type is used for LoadWorkflowDeatilsSuccess action ', () => {
      const action = new SearchTEPSuccess(tEPSearchResponse);

      expect(action.type).toEqual(
        TEPRequestActionTypes.SEARCH_TEP_SUCCESS
      );
      expect(action.payload).toEqual(tEPSearchResponse);
    });
    it('should check correct type is used for LoadWorkflowDeatilsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTEPFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.SEARCH_TEP_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('tepHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadTEPHistory  action ', () => {
      const action = new LoadTEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');

      expect(action.type).toEqual(TEPRequestActionTypes.LOAD_TEP_HISTORY);

      expect(action.payload).toEqual(advanceHistoryItemsRequestPayload);
    });
    it('should check correct type is used for LoadTEPHistorySuccess action ', () => {
      const action = new LoadTEPHistorySuccess(tEPSearchResponse);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_TEP_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(tEPSearchResponse);
    });
    it('should check correct type is used for LoadTEPHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTEPHistoryFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_TEP_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('getTepItemConfiguration Action Test Cases', () => {
    it('should check correct type is used for  GetTepItemConfiguration  action ', () => {
      const action = new GetTepItemConfiguration('','','');

      expect(action.type).toEqual(TEPRequestActionTypes.GET_ITEM_CONFIGURATION);

      expect(action.itemCode).toEqual('');
    });
    it('should check correct type is used for GetTepItemConfigurationSuccess action ', () => {
      const action = new GetTepItemConfigurationSuccess(getTepItemConfiguratonResponse);

      expect(action.type).toEqual(
        TEPRequestActionTypes.GET_ITEM_CONFIGURATION_SUCCESS
      );
      expect(action.payload).toEqual(getTepItemConfiguratonResponse);
    });
    it('should check correct type is used for GetTepItemConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetTepItemConfigurationFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.GET_ITEM_CONFIGURATION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('requestList Action Test Cases', () => {
    it('should check correct type is used for  LoadRequests  action ', () => {
      const action = new LoadRequests(requestPayload);

      expect(action.type).toEqual(TEPRequestActionTypes.LOAD_REQUESTS);

      expect(action.payload).toEqual(requestPayload);
    });
    it('should check correct type is used for LoadRequestsSuccess action ', () => {
      const action = new LoadRequestsSuccess(aBRequestStatusList);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(aBRequestStatusList);
    });
    it('should check correct type is used for LoadRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestsFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('refundRequestList Action Test Cases', () => {
    it('should check correct type is used for  LoadRefundRequests  action ', () => {
      const action = new LoadRefundRequests(requestPayload);

      expect(action.type).toEqual(TEPRequestActionTypes.LOAD_REFUND_REQUESTS);

      expect(action.payload).toEqual(requestPayload);
    });
    it('should check correct type is used for LoadRefundRequestsSuccess action ', () => {
      const action = new LoadRefundRequestsSuccess(refundStatusCount);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REFUND_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(refundStatusCount);
    });
    it('should check correct type is used for LoadRefundRequestsSuccess action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRefundRequestsFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REFUND_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('refundDeatilsList Action Test Cases', () => {
    it('should check correct type is used for  LoadRefundOrderDeatils  action ', () => {
      const action = new LoadRefundOrderDeatils(refundRequestPayload);

      expect(action.type).toEqual(TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS);

      expect(action.payload).toEqual(refundRequestPayload);
    });
    it('should check correct type is used for LoadRefundOrderDeatilsSuccess action ', () => {
      const action = new LoadRefundOrderDeatilsSuccess(aBRequestStatusList);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(aBRequestStatusList);
    });
    it('should check correct type is used for LoadRefundOrderDeatilsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRefundOrderDeatilsFailure(payload);

      expect(action.type).toEqual(
        TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_FAILURE
    );
      expect(action.payload).toEqual(payload);
    });
  });




});
