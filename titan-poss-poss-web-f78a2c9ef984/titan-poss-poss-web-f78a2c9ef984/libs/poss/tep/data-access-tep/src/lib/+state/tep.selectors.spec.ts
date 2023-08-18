import {
  CustomErrors,

  ABRequestStatusDownValues,
  ABSearchValues,
 
  GetTepItemConfiguratonResponse,
  TEPSearchResponse,
  HistorySearchParamDetails,

RefundStatus,
RequestStatus,
TEPDownValues
} from '@poss-web/shared/models';

import { TEPRefundStatusListEntity,TEPRequestStatusListEntity } from './tep.entity';
import {TEPRequestState  } from './tep.state';
import { initialState } from './tep.reducer';
import * as selectors from './tep.selectors';

import * as moment from 'moment';

describe('TEP Selector Testing Suite', () => {
  
  const refundStatus1:RefundStatus={
    id: '1',
  refundType: '',
  status: '',
  docNo: '',
  locationCode: '',
  refTxnId: '',
  headerData: [],
  approvedData: []
  }
  const refundStatus2:RefundStatus={
    id: '2',
  refundType: '',
  status: '',
  docNo: '',
  locationCode: '',
  refTxnId: '',
  headerData: [],
  approvedData: []
  }

  const requestStatus1:RequestStatus={
    approvalLevel:0,
  approvalStatus: '',
  approvedBy: '34',
  processId: '34',
  approvedDate: moment(),
  approverRemarks: '',
  docNo: 0,
  fiscalYear: 0,
  headerData: '',
  requestedBy: '',
  requestedDate: moment(),
  requestorRemarks: '',
  workflowType: '',
  }

  const requestStatus2:RequestStatus={
    approvalLevel:1,
  approvalStatus: '',
  approvedBy: '',
  processId: '12',
  approvedDate: moment(),
  approverRemarks: '',
  docNo: 0,
  fiscalYear: 0,
  headerData: '',

  requestedBy: '',
  requestedDate: moment(),
  requestorRemarks: '',
  workflowType: '',
  }


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

  const   requestStausDropDownValues: TEPDownValues={
    status:'',
    refundType:'',
    type:''
    
  };
  
  const tEPSearchResponse:TEPSearchResponse={
    TEPList:[],
    totalElements:2
  }

  
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

    const historySearchParamDetails:HistorySearchParamDetails={cnDocNo:9};

 

  
  const RequestStatusArray = [
    requestStatus1,
    requestStatus2
  ];
  const RefundStatusArray = [refundStatus1, refundStatus2];
  const addRequestToEntities = <T extends RequestStatus>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.processId]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addRefundToEntities = <T extends RefundStatus>(
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

  const RefundElements: TEPRefundStatusListEntity = {
    ids: [refundStatus1.id, refundStatus2.id],
    entities: addRefundToEntities(RefundStatusArray)
  };

  const requestElements: TEPRequestStatusListEntity  = {
    ids: [requestStatus1.processId, requestStatus2.processId],
    entities: addRequestToEntities(RequestStatusArray)
  };

  describe('Testing TEP Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: TEPRequestState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.TEPRequestSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return isLoading selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.TEPRequestSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

   

    it('Should return selectRequests', () => {
      expect(
        selectors.TEPRequestSelectors.selectRequests.projector(
          requestElements
        )
      ).toEqual(RequestStatusArray);
    });

    it('Should return selectRefunds', () => {
      expect(
        selectors.TEPRequestSelectors.selectRefunds.projector(
          RefundElements
        )
      ).toEqual(RefundStatusArray);
    });



    it('Should return requestList', () => {
      const state: TEPRequestState = {
        ...initialState,
        requestStausDropDownValues: aBRequestStatusDownValues
      };
      expect(
        selectors.TEPRequestSelectors.dropDownValues.projector(state)
      ).toEqual(aBRequestStatusDownValues);
    });

 

    // it('should return selectOrderNumber selector', () => {
    //   const state: TEPRequestState = {
    //     ...initialState,
    //     orderNumber: 1
    //   };
    //   expect(
    //     selectors.TEPRequestSelectors.selectOrderNumber.projector(state)
    //   ).toEqual(1);
    // });

  

    it('should return selectTEPHistoryResponse selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        historyItems: tEPSearchResponse
      };
      expect(
        selectors.TEPRequestSelectors.selectTEPHistoryResponse.projector(state)
      ).toEqual(tEPSearchResponse);
    });

    it('should return selectHistorySearchParamDetails selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        historySearchParamDetails: historySearchParamDetails
      };
      expect(
        selectors.TEPRequestSelectors.selectHistorySearchParamDetails.projector(state)
      ).toEqual(historySearchParamDetails);
    });

    it('should return selectWorkflowDetails selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        selectedData: 1
      };
      expect(
        selectors.TEPRequestSelectors.selectWorkflowDetails.projector(state)
      ).toEqual(1);
    });

    it('should return selectRequestCount selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        TEPRequestStatusListCount: 2
      };
      expect(
        selectors.TEPRequestSelectors.selectRequestCount.projector(state)
      ).toEqual(2);
    });

    it('should return selectTepItemConfiguratonResponse selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        tepItemConfiguratonResponse: getTepItemConfiguratonResponse
      };
      expect(
        selectors.TEPRequestSelectors.selectTepItemConfiguratonResponse.projector(
          state
        )
      ).toEqual(getTepItemConfiguratonResponse);
    });

    it('should return selectTEPCount selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        searhTEPResponseCount: 0
      };
      expect(
        selectors.TEPRequestSelectors.selectTEPCount.projector(
          state
        )
      ).toEqual(0);
    });

    it('should return selectRefundCount selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        TEPRefundRequestStatusListCount: 0
      };
      expect(
        selectors.TEPRequestSelectors.selectRefundCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('should return selectedApprovedData selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        approvedRefundDetails: []
      };
      expect(
        selectors.TEPRequestSelectors.selectedApprovedData.projector(
          state
        )
      ).toEqual([]);
    });

    it('should return SearchTEPResponse selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        searhTEPResponse: []
      };
      expect(
        selectors.TEPRequestSelectors.SearchTEPResponse.projector(
          state
        )
      ).toEqual([]);
    });



    it('should return selectedData selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        refundDetails: aBSearchValues
      };
      expect(
        selectors.TEPRequestSelectors.selectedData.projector(state)
      ).toEqual(aBSearchValues);
    });

    it('should return selectSearchValues selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        searchValues: aBSearchValues
      };
      expect(
        selectors.TEPRequestSelectors.selectSearchValues.projector(state)
      ).toEqual(aBSearchValues);
    });

    it('should return dropDownValues selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        requestStausDropDownValues: requestStausDropDownValues
      };
      expect(
        selectors.TEPRequestSelectors.dropDownValues.projector(
          state
        )
      ).toEqual(requestStausDropDownValues);
    });

    it('should return refundDropDownValues selector', () => {
      const state: TEPRequestState = {
        ...initialState,
        refundStausDropDownValues: requestStausDropDownValues
      };
      expect(
        selectors.TEPRequestSelectors.refundDropDownValues.projector(
          state
        )
      ).toEqual(requestStausDropDownValues);
    });
  });
});
