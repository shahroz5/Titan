// you will need to assert that the store is calling the right selector function.

import { CustomErrors, VendorMaster } from '@poss-web/shared/models';

import { initialState } from './vendor-master.reducer';
import * as selectors from '../+state/vendor-master.selector';

import { VendorMasterState } from './vendor-master.state';

describe('vendorMasterSelector selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing VendorMasterState related Selectors', () => {
    it('selectIsLoading Should return the true or false', () => {
      const state: VendorMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.vendorMasterSelector.selectIsloading.projector(state)
      ).toEqual(true);
    });

    it('selectVendorMasterList Should return the vendor master list', () => {
      const vendorMasterList: VendorMaster[] = [
        {
          vendorCode: 'EMAIL',
          vendorName: 'EMAIL',
          vendorDetail: '',
          baseUrl: 'email.com',
          vendorType: 'EMAIL'
        }
      ];
      const state: VendorMasterState = {
        ...initialState,
        vendorMasterList: vendorMasterList
      };
      expect(
        selectors.vendorMasterSelector.selectVendorMasterList.projector(state)
      ).toEqual(vendorMasterList);
    });

    it('selectVendorMaster Should return vendor master', () => {
      const vendorMaster: VendorMaster = {
        vendorCode: 'EMAIL',
        vendorName: 'EMAIL',
        vendorDetail: '',
        baseUrl: 'email.com',
        vendorType: 'EMAIL'
      };
      const state: VendorMasterState = {
        ...initialState,
        vendorMaster: vendorMaster
      };
      expect(
        selectors.vendorMasterSelector.selectVendorMaster.projector(state)
      ).toEqual(vendorMaster);
    });

    it('selectTotalElements Should return total elements', () => {
      const state: VendorMasterState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.vendorMasterSelector.selectTotalElements.projector(state)
      ).toEqual(10);
    });

    it('selectError Should return the error object', () => {
      const state: VendorMasterState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.vendorMasterSelector.selectError.projector(state)
      ).toEqual(error);
    });
  });
});
