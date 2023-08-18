//you should simply assert that you get the right state given the provided inputs.

import * as actions from './vendor-master.action';

import {
  VendorMasterListPayload,
  VendorMaster,
  VendorMasterListing
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { vendorMasterReducer, initialState } from './vendor-master.reducer';
import { VendorMasterState } from './vendor-master.state';

describe('vendorMasterReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadVendorMasterList ', () => {
    beforeEach(() => {});
    it('Load LoadVendorMasterList should set the isLoading to true', () => {
      const payload: VendorMasterListPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new actions.LoadVendorMasterList(payload);

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVendorMasterListSuccess should return vendor list and isLoading false', () => {
      const payload: VendorMasterListing = {
        results: [
          {
            vendorCode: 'EMAIL',
            vendorName: 'EMAIL',
            vendorDetail: '',
            baseUrl: 'email.com',
            vendorType: 'EMAIL'
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadVendorMasterListSuccess(payload);

      const result: VendorMasterState = vendorMasterReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('LoadVendorMasterListFailure should return error', () => {
      const action = new actions.LoadVendorMasterListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadVendorMasterByCode ', () => {
    beforeEach(() => {});
    it('Load LoadVendorMasterByCode should set the isLoading to true', () => {
      const payload = 'EMAIL';
      const action = new actions.LoadVendorMasterByCode(payload);

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadVendorMasterByCodeSuccess should return vendor by vendor code and isLoading false', () => {
      const payload: VendorMaster = {
        vendorCode: 'EMAIL',
        vendorName: 'EMAIL',
        vendorDetail: '',
        baseUrl: 'email.com',
        vendorType: 'EMAIL'
      };

      const action = new actions.LoadVendorMasterByCodeSuccess(payload);

      const result: VendorMasterState = vendorMasterReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('LoadVendorMasterByCodeFailure should return error', () => {
      const action = new actions.LoadVendorMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchVendorMasterByCode ', () => {
    beforeEach(() => {});
    it('Load SearchVendorMasterByCode should set the isLoading to true', () => {
      const payload = 'EMAIL';
      const action = new actions.SearchVendorMasterByCode(payload);

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchVendorMasterByCodeSuccess should return vendor by vendor code and isLoading false', () => {
      const payload: VendorMasterListing = {
        results: [
          {
            vendorCode: 'EMAIL',
            vendorName: 'EMAIL',
            vendorDetail: '',
            baseUrl: 'email.com',
            vendorType: 'EMAIL'
          }
        ],
        totalElements: 1
      };

      const action = new actions.SearchVendorMasterByCodeSuccess(payload);

      const result: VendorMasterState = vendorMasterReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('SearchVendorMasterByCodeFailure should return error', () => {
      const action = new actions.SearchVendorMasterByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: VendorMasterState = vendorMasterReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: VendorMasterState = vendorMasterReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
