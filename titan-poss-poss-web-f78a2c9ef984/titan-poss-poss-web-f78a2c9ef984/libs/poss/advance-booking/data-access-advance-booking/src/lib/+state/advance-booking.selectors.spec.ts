import {
  CustomErrors,
  PrinterConfigDetails,
  Lov,
  AdvanceBookingDetailsResponse,
  StatusTypesEnum,
  ABRequestStatusDownValues,
  ABSearchResponse,
  ABRequestStatusList,
  ABSearchValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingSearchPayload,
  RequestPayload,
  CashMemoItemDetailsRequestPayload,
  RequestStatus
} from '@poss-web/shared/models';

import { ABRequestStatusListEntity, ABEntity } from './advance-booking.entity';
import { AdvanceBookingState } from './advance-booking.state';
import { initialState } from './advance-booking.reducer';
import * as selectors from './advance-booking.selectors';

import * as moment from 'moment';

describe('advance Booking Selector Testing Suite', () => {
  const advanceBookingDetailsResponse1: AdvanceBookingDetailsResponse = {
    activationDetails: {},
    cancellationDetails: {},
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    isRivaah: false,
    isFrozenAmount: 0,
    confirmedTime: moment(),
    refSubTxnType: '',
    customerDocDetails: '',
    customerId: 1,
    discountDetails: 0,
    docDate: moment(),
    docNo: 1,
    employeeCode: '',
    finalValue: 123,
    firstHoldTime: moment(),
    fiscalYear: 2015,
    focDetails: {},
    id: '34',
    isBestRate: true,
    isFrozenRate: true,
    lastHoldTime: moment(),
    metalRateList: {},
    minValue: 1,
    occasion: '',
    txnType: '',
    otherChargesList: {},
    paidValue: 1,
    refTxnId: '',
    refTxnType: '',
    remarks: '',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: '',
    taxDetails: { cess: [], data: [], taxClass: '', taxType: '' },
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    txnTime: moment()
  };

  const advanceBookingDetailsResponse2: AdvanceBookingDetailsResponse = {
    activationDetails: {},
    cancellationDetails: {},
    confirmedTime: moment(),
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    isRivaah: false,
    isFrozenAmount: 0,
    refSubTxnType: '',
    customerDocDetails: '',
    customerId: 1,
    discountDetails: 0,
    docDate: moment(),
    docNo: 1,
    employeeCode: '',
    finalValue: 123,
    firstHoldTime: moment(),
    fiscalYear: 2015,
    focDetails: {},
    id: '12',
    isBestRate: true,
    isFrozenRate: true,
    lastHoldTime: moment(),
    metalRateList: {},
    minValue: 1,
    occasion: '',
    txnType: '',
    otherChargesList: {},
    paidValue: 1,
    refTxnId: '',
    refTxnType: '',
    remarks: '',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: '',
    taxDetails: { cess: [], data: [], taxClass: '', taxType: '' },
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    txnTime: moment()
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

  const requestStatus1: RequestStatus = {
    approvalLevel: 1,
    approvalStatus: '',
    approvedBy: '',
    processId: '123',
    approvedDate: moment(),
    approverRemarks: '',
    docNo: 1,
    fiscalYear: 1,
    headerData: {},

    requestedBy: '',
    requestedDate: moment(),
    requestorRemarks: '',
    workflowType: ''
  };

  const requestStatus2: RequestStatus = {
    approvalLevel: 1,
    approvalStatus: '',
    approvedBy: '',
    processId: '456',
    approvedDate: moment(),
    approverRemarks: '',
    docNo: 1,
    fiscalYear: 1,
    headerData: {},

    requestedBy: '',
    requestedDate: moment(),
    requestorRemarks: '',
    workflowType: ''
  };

  const advanceBookingDetailsResponse: AdvanceBookingDetailsResponse = {
    activationDetails: {},
    isRivaah: false,
    cancellationDetails: {},
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    isFrozenAmount: 0,

    confirmedTime: moment(),
    customerId: 1,
    discountDetails: 0,
    docDate: moment(),
    docNo: 1,
    employeeCode: '',
    refSubTxnType: '',
    customerDocDetails: '',
    finalValue: 123,
    firstHoldTime: moment(),
    fiscalYear: 2015,
    focDetails: {},
    id: '',
    isBestRate: true,
    isFrozenRate: true,
    lastHoldTime: moment(),
    metalRateList: {},
    minValue: 1,
    occasion: '',
    txnType: '',
    otherChargesList: {},
    paidValue: 1,
    refTxnId: '',
    refTxnType: '',
    remarks: '',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: '',
    taxDetails: { cess: [], data: [], taxClass: '', taxType: '' },
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    txnTime: moment()
  };

  const aBSearchResponse: ABSearchResponse = {
    ABList: [advanceBookingDetailsResponse],
    totalElements: 1
  };

  const advanceBookingArray = [
    advanceBookingDetailsResponse1,
    advanceBookingDetailsResponse2
  ];
  const requestListArray = [requestStatus1, requestStatus2];
  const addABToEntities = <T extends AdvanceBookingDetailsResponse>(
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

  const ABElements: ABEntity = {
    ids: [advanceBookingDetailsResponse1.id, advanceBookingDetailsResponse2.id],
    entities: addABToEntities(advanceBookingArray)
  };

  const requestElements: ABRequestStatusListEntity = {
    ids: [requestStatus1.processId, requestStatus2.processId],
    entities: addRequestToEntities(requestListArray)
  };

  describe('Testing AB Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: AdvanceBookingState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.advanceBookingSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return isLoading selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.advanceBookingSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('Should return selectSearchABResponse', () => {
      expect(
        selectors.advanceBookingSelectors.selectSearchABResponse.projector(
          ABElements
        )
      ).toEqual(advanceBookingArray);
    });

    it('Should return selectRequests', () => {
      expect(
        selectors.advanceBookingSelectors.selectRequests.projector(
          requestElements
        )
      ).toEqual(requestListArray);
    });

    it('Should return requestList', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        requestStausDropDownValues: aBRequestStatusDownValues
      };
      expect(
        selectors.advanceBookingSelectors.dropDownValues.projector(state)
      ).toEqual(aBRequestStatusDownValues);
    });

    it('should return selectSearchValues selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        searchValues: aBSearchValues
      };
      expect(
        selectors.advanceBookingSelectors.selectSearchValues.projector(state)
      ).toEqual(aBSearchValues);
    });

    // it('should return selectOrderNumber selector', () => {
    //   const state: AdvanceBookingState = {
    //     ...initialState,
    //     orderNumber: 1
    //   };
    //   expect(
    //     selectors.advanceBookingSelectors.selectOrderNumber.projector(state)
    //   ).toEqual(1);
    // });

    it('should return selectedData selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        selectedData: aBSearchValues
      };
      expect(
        selectors.advanceBookingSelectors.selectedData.projector(state)
      ).toEqual(aBSearchValues);
    });

    it('should return selectABCount selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        searhABResponseCount: 1
      };
      expect(
        selectors.advanceBookingSelectors.selectABCount.projector(state)
      ).toEqual(1);
    });

    it('should return selectRequestCount selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        ABRequestStatusListCount: 11
      };
      expect(
        selectors.advanceBookingSelectors.selectRequestCount.projector(state)
      ).toEqual(11);
    });

    it('should return selectminABValue selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        minABvalue: 1
      };
      expect(
        selectors.advanceBookingSelectors.selectminABValue.projector(state)
      ).toEqual(1);
    });

    it('should return selectRSODetails selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        RSODetails: []
      };
      expect(
        selectors.advanceBookingSelectors.selectRSODetails.projector(state)
      ).toEqual([]);
    });

    it('should return selectViewCashMemoResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        viewCashMemoResponse: advanceBookingDetailsResponse
      };
      expect(
        selectors.advanceBookingSelectors.selectViewCashMemoResponse.projector(
          state
        )
      ).toEqual(advanceBookingDetailsResponse);
    });

    it('should return selectFreezeAdvanceBookingResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        freezeAdvanceBookingResponse: advanceBookingDetailsResponse
      };
      expect(
        selectors.advanceBookingSelectors.selectFreezeAdvanceBookingResponse.projector(
          state
        )
      ).toEqual(advanceBookingDetailsResponse);
    });

    it('should return selectUpdateCashMemoResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        updateCashMemoResponse: advanceBookingDetailsResponse
      };
      expect(
        selectors.advanceBookingSelectors.selectUpdateCashMemoResponse.projector(
          state
        )
      ).toEqual(advanceBookingDetailsResponse);
    });
    it('should return selectDeleteCashMemoResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        deleteCashMemoResponse: true
      };
      expect(
        selectors.advanceBookingSelectors.selectDeleteCashMemoResponse.projector(
          state
        )
      ).toEqual(true);
    });

    it('should return selectPartailUpdateCashMemoResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        partialUpdateCashMemoResponse: advanceBookingDetailsResponse
      };
      expect(
        selectors.advanceBookingSelectors.selectPartailUpdateCashMemoResponse.projector(
          state
        )
      ).toEqual(advanceBookingDetailsResponse);
    });

    it('should return selectCreateCashMemoResponse selector', () => {
      const state: AdvanceBookingState = {
        ...initialState,
        createCashMemoResponse: advanceBookingDetailsResponse
      };
      expect(
        selectors.advanceBookingSelectors.selectCreateCashMemoResponse.projector(
          state
        )
      ).toEqual(advanceBookingDetailsResponse);
    });
  });
});
