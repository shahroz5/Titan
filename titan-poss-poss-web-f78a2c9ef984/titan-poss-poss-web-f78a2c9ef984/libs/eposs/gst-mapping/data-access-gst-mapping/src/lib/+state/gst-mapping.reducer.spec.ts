import {
  GSTMappingDetails,
  GSTMappingPayload,
  GSTMappingResponse,
  LoadGSTMappingListPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import {
  AddGSTMapping,
  AddGSTMappingFailure,
  AddGSTMappingSuccess,
  EditGSTMapping,
  EditGSTMappingFailure,
  EditGSTMappingSuccess,
  LoadGSTMappingList,
  LoadGSTMappingListFailure,
  LoadGSTMappingListSuccess,
  LoadTaxes,
  LoadTaxesFailure,
  LoadTaxesSuccess,
  LoadTransactionTypes,
  LoadTransactionTypesFailure,
  LoadTransactionTypesSuccess,
  ResetData
} from './gst-mapping.action';

import { GSTMappingReducer, initialState } from './gst-mapping.reducer';
import { GSTMappingState } from './gst-mapping.state';

describe('GST Mapping Reducer Testing Suite', () => {
  let testState = initialState;
  const gstMappingDetails: GSTMappingDetails = {
    isActive: true,
    customerTaxType: 'REGISTERED',
    destLocationTaxType: 'L2',
    srcLocationTaxType: 'CFA',
    txnType: 'SERVICE_TAx',
    applicableTax: 'GST',
    destLocationApplicableTax: 'GST',
    isSameState: false,
    srcLocationApplicableTax: 'GST',
    srcTaxApplicable: false,
    id: 'ID'
  };

  describe('Actions should check intial state', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: GSTMappingState = GSTMappingReducer(undefined, action);
      expect(state).toEqual(testState);
    });
  });

  describe('Actions should reset data', () => {
    it('RESET_DATA action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        isLoading: true,
        gstMappingList: [gstMappingDetails],
        totalElements: 100,
        txnTypes: [
          {
            code: 'TYPE 1',
            value: 'TYPE 1',
            isActive: true
          }
        ],
        taxes: [
          {
            taxCode: 'TAX-1',
            description: 'TAX DESC 1'
          }
        ],
        reloadStatus: {
          reload: true,
          type: 'NEW'
        }
      };

      const action = new ResetData();

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toBeNull();
      expect(result.isLoading).toBeFalsy();
      expect(result.gstMappingList).toBeNull();
      expect(result.totalElements).toEqual(0);
      expect(result.txnTypes).toEqual([]);
      expect(result.taxes).toEqual([]);
      expect(result.reloadStatus).toEqual({
        reload: false,
        type: null
      });
    });
  });

  describe('Actions should load gst mapping list', () => {
    it('LOAD_GST_MAPPING_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: LoadGSTMappingListPayload = {
        pageIndex: 10,
        pageSize: 20,
        filter: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx'
        }
      };
      const action = new LoadGSTMappingList(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_GST_MAPPING_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        gstMappingList: [],
        totalElements: 0,
        isLoading: true
      };

      const payload: GSTMappingResponse = {
        gstMappingList: [gstMappingDetails],
        totalElements: 1
      };

      const action = new LoadGSTMappingListSuccess(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.gstMappingList).toEqual(payload.gstMappingList);
      expect(result.totalElements).toEqual(payload.totalElements);
      expect(result.isLoading).toBeFalsy();
    });

    it('LOAD_GST_MAPPING_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const action = new LoadGSTMappingListFailure(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should add gst mapping', () => {
    it('ADD_GST_MAPPING action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: GSTMappingPayload = {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false
      };
      const action = new AddGSTMapping(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('ADD_GST_MAPPING_SUCCESS action', () => {
      testState = {
        ...testState,
        reloadStatus: null,
        isLoading: true
      };

      const payload = gstMappingDetails;

      const action = new AddGSTMappingSuccess(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.reloadStatus).toEqual({
        reload: true,
        type: 'NEW'
      });
      expect(result.isLoading).toBeFalsy();
    });

    it('ADD_GST_MAPPING_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const action = new AddGSTMappingFailure(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should edit gst mapping', () => {
    it('EDIT_GST_MAPPING action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = {
        data: {
          isActive: true,
          customerTaxType: 'REGISTERED',
          destLocationTaxType: 'L2',
          srcLocationTaxType: 'CFA',
          txnType: 'SERVICE_TAx',
          applicableTax: 'GST',
          destLocationApplicableTax: 'GST',
          isSameState: false,
          srcLocationApplicableTax: 'GST',
          srcTaxApplicable: false
        },
        configId: 'TEST ID'
      };
      const action = new EditGSTMapping(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('EDIT_GST_MAPPING_SUCCESS action', () => {
      testState = {
        ...testState,
        reloadStatus: null,
        isLoading: true
      };

      const payload = gstMappingDetails;

      const action = new EditGSTMappingSuccess(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.reloadStatus).toEqual({
        reload: true,
        type: 'EDIT'
      });
      expect(result.isLoading).toBeFalsy();
    });

    it('EDIT_GST_MAPPING_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const action = new EditGSTMappingFailure(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should load tax list', () => {
    it('LOAD_TAXES action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new LoadTaxes();

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_TAXES_SUCCESS action', () => {
      testState = {
        ...testState,
        taxes: [],
        isLoading: true
      };

      const payload = [
        {
          taxCode: 'TAX-1',
          description: 'TAX DESC 1'
        }
      ];

      const action = new LoadTaxesSuccess(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.taxes).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });

    it('LOAD_TAXES_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const action = new LoadTaxesFailure(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should load tax transaction types list', () => {
    it('LOAD_TRANSACTION_TYPES action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new LoadTransactionTypes();

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_TRANSACTION_TYPES_SUCCESS action', () => {
      testState = {
        ...testState,
        txnTypes: [],
        isLoading: true
      };

      const payload = [
        {
          code: 'TYPE 1',
          value: 'TYPE 1',
          isActive: null
        }
      ];

      const action = new LoadTransactionTypesSuccess(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.txnTypes).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });

    it('LOAD_TRANSACTION_TYPES_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const action = new LoadTransactionTypesFailure(payload);

      const result: GSTMappingState = GSTMappingReducer(testState, action);

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toBeFalsy();
    });
  });
});
