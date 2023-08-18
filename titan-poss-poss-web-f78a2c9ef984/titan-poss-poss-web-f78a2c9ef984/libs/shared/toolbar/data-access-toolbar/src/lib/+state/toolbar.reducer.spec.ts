import {
  CustomErrors,
  MetalPrice,
  StatusTypesEnum,
  ToolbarConfig,
  TransactionCount,
  TransactionDetails,
  TransactionListCountPayload,
  TransactionListPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, toolbarReducer } from './toolbar.reducer';
import * as actions from './toolbar.actions';
import { ToolbarState } from './toolbar.state';

describe('Toolbar Reducer Testing Suite', () => {
  let testState = initialState;

  describe('Actions should update state properly', () => {
    const dummyMetalPriceResponse: MetalPrice[] = [
      {
        applicableDate: new Date('2021-01-06T10:19:19+05:30'),
        // currency: 'INR',
        karatage: 0,
        metalName: 'Platinum',
        metalTypeCode: 'L',
        offset: 1,
        purity: 95,
        ratePerUnit: 3465,
        unit: 'gms'
      }
    ];

    const dummyTransactionListPayload: TransactionListPayload = {
      pageIndex: 0,
      pageSize: 10,
      searchValue: 'Test1',
      status: 'OPEN',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionDetailsResponse: TransactionDetails[] = [
      {
        customerId: 101,
        customerName: 'TESTING',
        docDate: moment(1611513000000),
        docNo: 15,
        firstHoldTime: moment(1611667249687),
        fiscalYear: 2020,
        id: '1681C56A-9080-427A-8B9A-3C6FC9369399',
        lastHoldTime: moment(1611667249687),
        locationCode: 'CPD',
        // mobileNumber: '8645635697',
        status: StatusTypesEnum.HOLD,
        subTxnType: 'NEW_CM',
        txnType: 'CM',
        totalElements: 10
      }
    ];

    const dummyTransactionListCountPayload: TransactionListCountPayload = {
      status: 'HOLD',
      txnType: 'CM',
      subTxnType: 'NEW_CM'
    };

    const dummyTransactionCountResponse: TransactionCount[] = [
      {
        count: 10,
        txnType: 'CM',
        subTxnType: 'NEW_CM'
      }
    ];

    const dummyToolbarConfig: ToolbarConfig = {
      loadMetalPrices: true,
      loadHoldPopup: true,
      loadOpenOrdersPopup: true
    };

    it('should return the initial state', () => {
      const action: any = {};
      const state: ToolbarState = toolbarReducer(undefined, action);

      expect(state).toBe(testState);
    });

    it('LoadMetalPriceDetails action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadMetalPriceDetails();

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadMetalPriceDetailsSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        metalPriceDetails: null,
        previousMetalPriceDetails: null
      };

      const action = new actions.LoadMetalPriceDetailsSuccess(
        dummyMetalPriceResponse
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.previousMetalPriceDetails).toBe(null);
      expect(result.metalPriceDetails).toBe(dummyMetalPriceResponse);
    });

    it('LoadMetalPriceDetailsFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMetalPriceDetailsFailure(payload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadOpenOrders action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadOpenOrders(dummyTransactionListPayload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadOpenOrdersSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        openOrdersResponse: null
      };

      const action = new actions.LoadOpenOrdersSuccess(
        dummyTransactionDetailsResponse
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.openOrdersResponse).toBe(dummyTransactionDetailsResponse);
    });

    it('LoadOpenOrdersFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOpenOrdersFailure(payload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadOpenOrdersCount action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadOpenOrdersCount(
        dummyTransactionListCountPayload
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadOpenOrdersCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        openOrdersCount: null
      };

      const action = new actions.LoadOpenOrdersCountSuccess(
        dummyTransactionCountResponse
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.openOrdersCount).toBe(dummyTransactionCountResponse);
    });

    it('LoadOpenOrdersCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOpenOrdersCountFailure(payload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadOnHold action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadOnHold(dummyTransactionListPayload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadOnHoldSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        onHoldResponse: null
      };

      const action = new actions.LoadOnHoldSuccess(
        dummyTransactionDetailsResponse
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.onHoldResponse).toBe(dummyTransactionDetailsResponse);
    });

    it('LoadOnHoldFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOnHoldFailure(payload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('LoadOnHoldCount action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadOnHoldCount(
        dummyTransactionListCountPayload
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LoadOnHoldCountSuccess action', () => {
      testState = {
        ...testState,
        isLoading: true,
        onHoldCount: null
      };

      const action = new actions.LoadOnHoldCountSuccess(
        dummyTransactionCountResponse
      );

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.onHoldCount).toBe(dummyTransactionCountResponse);
    });

    it('LoadOnHoldCountFailure action', () => {
      testState = {
        ...testState,
        isLoading: true,
        hasError: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadOnHoldCountFailure(payload);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(payload);
    });

    it('SetToolbarConfig action', () => {
      testState = {
        ...testState,
        isLoading: true
      };

      const action = new actions.SetToolbarConfig(dummyToolbarConfig);

      const result: ToolbarState = toolbarReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
    });

    // it('GetToolbarConfig action', () => {
    //   testState = {
    //     ...testState,
    //     isLoading: false,
    //     toolbarConfig: null
    //   };

    //   const action = new actions.GetToolbarConfig(dummyToolbarConfig);

    //   const result: ToolbarState = toolbarReducer(testState, action);

    //   expect(result.isLoading).toBeFalsy();
    //   expect(result.toolbarConfig).toBe(dummyToolbarConfig);
    // });

    it('ResetValues action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        metalPriceDetails: dummyMetalPriceResponse,
        previousMetalPriceDetails: dummyMetalPriceResponse,
        openOrdersResponse: dummyTransactionDetailsResponse,
        openOrdersCount: dummyTransactionCountResponse,
        onHoldResponse: dummyTransactionDetailsResponse,
        onHoldCount: dummyTransactionCountResponse,
        toolbarConfig: dummyToolbarConfig
      };

      const action = new actions.ResetValues();

      const result: ToolbarState = toolbarReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.metalPriceDetails.length).toBe(0);
      expect(result.previousMetalPriceDetails.length).toBe(0);
      expect(result.openOrdersResponse.length).toBe(0);
      expect(result.openOrdersCount.length).toBe(0);
      expect(result.onHoldResponse.length).toBe(0);
      expect(result.onHoldCount.length).toBe(0);
      expect(result.toolbarConfig).toBe(null);
    });

    it('ResetOpenOrders action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        metalPriceDetails: dummyMetalPriceResponse,
        previousMetalPriceDetails: dummyMetalPriceResponse,
        openOrdersResponse: dummyTransactionDetailsResponse,
        openOrdersCount: dummyTransactionCountResponse,
        onHoldResponse: dummyTransactionDetailsResponse,
        onHoldCount: dummyTransactionCountResponse,
        toolbarConfig: dummyToolbarConfig
      };

      const action = new actions.ResetOpenOrders();

      const result: ToolbarState = toolbarReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.openOrdersResponse.length).toBe(0);
    });

    it('ResetOnHold action', () => {
      const newState = {
        isLoading: true,
        hasError: null,
        metalPriceDetails: dummyMetalPriceResponse,
        previousMetalPriceDetails: dummyMetalPriceResponse,
        openOrdersResponse: dummyTransactionDetailsResponse,
        openOrdersCount: dummyTransactionCountResponse,
        onHoldResponse: dummyTransactionDetailsResponse,
        onHoldCount: dummyTransactionCountResponse,
        toolbarConfig: dummyToolbarConfig
      };

      const action = new actions.ResetOnHold();

      const result: ToolbarState = toolbarReducer(newState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.hasError).toBe(null);
      expect(result.onHoldResponse.length).toBe(0);
    });
  });
});
