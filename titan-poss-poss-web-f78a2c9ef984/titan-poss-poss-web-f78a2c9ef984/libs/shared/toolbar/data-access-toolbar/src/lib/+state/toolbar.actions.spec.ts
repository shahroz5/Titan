import {
  MetalPrice,
  StatusTypesEnum,
  TransactionCount,
  TransactionDetails,
  TransactionListCountPayload,
  TransactionListPayload,
  ToolbarConfig,
  CustomErrors
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GetToolbarConfig,
  LoadMetalPriceDetails,
  LoadMetalPriceDetailsFailure,
  LoadMetalPriceDetailsSuccess,
  LoadOnHold,
  LoadOnHoldCount,
  LoadOnHoldCountFailure,
  LoadOnHoldCountSuccess,
  LoadOnHoldFailure,
  LoadOnHoldSuccess,
  LoadOpenOrders,
  LoadOpenOrdersCount,
  LoadOpenOrdersCountFailure,
  LoadOpenOrdersCountSuccess,
  LoadOpenOrdersFailure,
  LoadOpenOrdersSuccess,
  ResetOnHold,
  ResetOpenOrders,
  ResetValues,
  SetToolbarConfig,
  ToolbarActionTypes
} from './toolbar.actions';
import * as moment from 'moment';

describe('Toolbar Action Testing suit', () => {
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

  describe('LoadMetalPriceDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalPriceDetails action ', () => {
      const action = new LoadMetalPriceDetails();

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS);
    });

    it('should check correct type is used for  LoadMetalPriceDetailsSuccess action ', () => {
      const action = new LoadMetalPriceDetailsSuccess(dummyMetalPriceResponse);

      expect(action.type).toEqual(
        ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(dummyMetalPriceResponse);
    });

    it('should check correct type is used for  LoadMetalPriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalPriceDetailsFailure(payload);

      expect(action.type).toEqual(
        ToolbarActionTypes.LOAD_METAL_PRICE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadOpenOrders Action Test Cases', () => {
    it('should check correct type is used for  LoadOpenOrders action ', () => {
      const action = new LoadOpenOrders(dummyTransactionListPayload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_OPENORDERS);
      expect(action.payload).toEqual(dummyTransactionListPayload);
    });

    it('should check correct type is used for  LoadOpenOrdersSuccess action ', () => {
      const action = new LoadOpenOrdersSuccess(dummyTransactionDetailsResponse);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_OPENORDERS_SUCCESS);
      expect(action.payload).toEqual(dummyTransactionDetailsResponse);
    });

    it('should check correct type is used for  LoadOpenOrdersFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOpenOrdersFailure(payload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_OPENORDERS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadOpenOrdersCount Action Test Cases', () => {
    it('should check correct type is used for  LoadOpenOrdersCount action ', () => {
      const action = new LoadOpenOrdersCount(dummyTransactionListCountPayload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_OPENORDERS_COUNT);
      expect(action.payload).toEqual(dummyTransactionListCountPayload);
    });

    it('should check correct type is used for  LoadOpenOrdersCountSuccess action ', () => {
      const action = new LoadOpenOrdersCountSuccess(
        dummyTransactionCountResponse
      );

      expect(action.type).toEqual(
        ToolbarActionTypes.LOAD_OPENORDERS_COUNT_SUCCESS
      );
      expect(action.payload).toEqual(dummyTransactionCountResponse);
    });

    it('should check correct type is used for  LoadOpenOrdersCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOpenOrdersCountFailure(payload);

      expect(action.type).toEqual(
        ToolbarActionTypes.LOAD_OPENORDERS_COUNT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadOnHold Action Test Cases', () => {
    it('should check correct type is used for  LoadOnHold action ', () => {
      const action = new LoadOnHold(dummyTransactionListPayload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD);
      expect(action.payload).toEqual(dummyTransactionListPayload);
    });

    it('should check correct type is used for LoadOnHoldSuccess action ', () => {
      const action = new LoadOnHoldSuccess(dummyTransactionDetailsResponse);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD_SUCCESS);
      expect(action.payload).toEqual(dummyTransactionDetailsResponse);
    });

    it('should check correct type is used for  LoadOnHoldFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOnHoldFailure(payload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadOnHoldCount Action Test Cases', () => {
    it('should check correct type is used for  LoadOnHoldCount action ', () => {
      const action = new LoadOnHoldCount(dummyTransactionListCountPayload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD_COUNT);
      expect(action.payload).toEqual(dummyTransactionListCountPayload);
    });

    it('should check correct type is used for  LLoadOnHoldCountSuccess action ', () => {
      const action = new LoadOnHoldCountSuccess(dummyTransactionCountResponse);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD_COUNT_SUCCESS);
      expect(action.payload).toEqual(dummyTransactionCountResponse);
    });

    it('should check correct type is used for LoadOnHoldCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOnHoldCountFailure(payload);

      expect(action.type).toEqual(ToolbarActionTypes.LOAD_ONHOLD_COUNT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ToolbarConfig Action Test Cases', () => {
    it('should check correct type is used for  SetToolbarConfig action ', () => {
      const action = new SetToolbarConfig(dummyToolbarConfig);

      expect(action.type).toEqual(ToolbarActionTypes.SET_TOOLBAR_CONFIG);
      expect(action.payload).toEqual(dummyToolbarConfig);
    });

    it('should check correct type is used for  GetToolbarConfig action ', () => {
      const action = new GetToolbarConfig(dummyToolbarConfig);

      expect(action.type).toEqual(ToolbarActionTypes.GET_TOOLBAR_CONFIG);
      expect(action.payload).toEqual(dummyToolbarConfig);
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ResetOpenOrders action ', () => {
      const action = new ResetOpenOrders();
      expect({ ...action }).toEqual({
        type: ToolbarActionTypes.RESET_OPENORDERS
      });
    });

    it('should check correct type is used for ResetOnHold action ', () => {
      const action = new ResetOnHold();
      expect({ ...action }).toEqual({
        type: ToolbarActionTypes.RESET_ONHOLD
      });
    });

    it('should check correct type is used for ResetValues action ', () => {
      const action = new ResetValues();
      expect({ ...action }).toEqual({
        type: ToolbarActionTypes.RESET_VALUES
      });
    });
  });
});
