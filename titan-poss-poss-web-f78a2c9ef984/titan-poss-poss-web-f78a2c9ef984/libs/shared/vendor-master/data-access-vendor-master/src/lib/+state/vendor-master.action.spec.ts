import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  VendorMasterListPayload,
  VendorMasterListing,
  VendorMaster
} from '@poss-web/shared/models';

import {
  LoadReset,
  VendorMasterActionTypes,
  LoadVendorMasterList,
  LoadVendorMasterListSuccess,
  LoadVendorMasterListFailure,
  LoadVendorMasterByCode,
  LoadVendorMasterByCodeSuccess,
  LoadVendorMasterByCodeFailure,
  SearchVendorMasterByCodeSuccess,
  SearchVendorMasterByCodeFailure,
  SearchVendorMasterByCode
} from './vendor-master.action';

describe('VendorMasterActionTypes  Action Testing Suite', () => {
  describe('LoadVendorMasterList Action Test Cases', () => {
    it('should check correct type is used for  LoadVendorMasterList action ', () => {
      const payload: VendorMasterListPayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadVendorMasterList(payload);
      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadVendorMasterListSuccess action ', () => {
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

      const action = new LoadVendorMasterListSuccess(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVendorMasterListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVendorMasterListFailure(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadVendorMasterByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadVendorMasterByCode action ', () => {
      const payload = 'EMAIL';

      const action = new LoadVendorMasterByCode(payload);
      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for  LoadVendorMasterByCodeSuccess action ', () => {
      const payload: VendorMaster = {
        vendorCode: 'EMAIL',
        vendorName: 'EMAIL',
        vendorDetail: '',
        baseUrl: 'email.com',
        vendorType: 'EMAIL'
      };

      const action = new LoadVendorMasterByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadVendorMasterByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadVendorMasterByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SearchVendorMasterByCode Action Test Cases', () => {
    it('should check correct type is used for  SearchVendorMasterByCode action ', () => {
      const payload = 'EMAIL';

      const action = new SearchVendorMasterByCode(payload);
      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for  SearchVendorMasterByCodeSuccess action ', () => {
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
      const action = new SearchVendorMasterByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchVendorMasterByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchVendorMasterByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: VendorMasterActionTypes.LOAD_RESET
      });
    });
  });
});
