import { FOCBCLState } from './foc-bcl.state';
import * as actions from './foc-bcl.actions';
import { FOCBCLReducer } from './foc-bcl.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  FOCBCLListingPayload,
  FOCBlockingCustomerLevelListResponse
} from '@poss-web/shared/models';
describe('FOC Blocking Location Level Reducer Testing Suite', () => {
  const focBlockingLocationDetails: FOCBlockingCustomerLevelListResponse = {
    response: [
      {
        locationCode: 'URB',
        description: 'URB',
        fromDate: '12312312',
        toDate: '12323213',
        approvedBy: 'CM',
        isCMMandatory: true,
        remarks: 'Good',
        isActive: true,
        mobileNumber: '9010462817',
        id: 'abc123',
        focItemCode: 'abc123',
        quantity: '12'
      }
    ],
    totalElements: 1
  };
  const savePayload = {
    validity: {
      endDate: 123123213213213,
      startDate: 123123123213,

      status: true
    },
    configDetails: {
      type: 'FOC_LOCATION_DETAILS',
      data: {
        remarks: 'good',
        approvedBy: 'CM',
        isCMNumber: 'true'
      }
    },
    addLocations: ['URB'],
    updateLocations: [],
    removeLocations: [],
    mobileNo: null
  };
  const initialState: FOCBCLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingCustomerLevel: null,
    totalElements: 0,
    selectedLocations: null
  };
  describe('Testing LoadFOCBCLDetails', () => {
    it('LoadFOCBCLDetails should return proper state', () => {
      const payload: FOCBCLListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        schemeId: 'abc123'
      };
      const action = new actions.LoadFOCBCLDetails(payload);

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadFOCBCLDetailsSuccess should return proper state', () => {
      const action = new actions.LoadFOCBCLDetailsSuccess(
        focBlockingLocationDetails
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.focBlockingCustomerLevel).toBe(
        focBlockingLocationDetails.response
      );
      expect(result.totalElements).toBe(
        focBlockingLocationDetails.totalElements
      );
    });

    it('LoadFOCBCLDetailsFailure should return error', () => {
      const action = new actions.LoadFOCBCLDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SaveFOCBCLDetails', () => {
    it('SaveFOCBLLDetails should return proper state', () => {
      const action = new actions.SaveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(false);
    });

    it('SaveFOCBLLDetailsSuccess should return proper state', () => {
      const action = new actions.SaveFOCBCLDetailsSuccess();

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(true);
    });

    it('SaveFOCBCLDetailsFailure should return error', () => {
      const action = new actions.SaveFOCBCLDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });

  describe('Testing SearchLocation', () => {
    it('SearchLocation should return proper state', () => {
      const action = new actions.SearchLocation({
        schemeId: 'abc123',
        locationCode: 'URB'
      });

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('SearchLocationSuccess should return proper state', () => {
      const action = new actions.SearchLocationSuccess(
        focBlockingLocationDetails.response
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.focBlockingCustomerLevel).toBe(
        focBlockingLocationDetails.response
      );
    });

    it('SearchLocationFailure should return error', () => {
      const action = new actions.SearchLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadFOCSchemes', () => {
    it('LoadFOCSchemes should return proper state', () => {
      const action = new actions.LoadFOCSchemes('FOC_BLOCKING_CUSTOMER');

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadFOCSchemesSuccess should return proper state', () => {
      const action = new actions.LoadFOCSchemesSuccess('abc123');

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.schemeId).toBe('abc123');
    });

    it('LoadFOCSchemesFailure should return error', () => {
      const action = new actions.LoadFOCSchemesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });

    it('ResetFocBllDetails should return error', () => {
      const action = new actions.ResetFocBclDetails();

      const result: FOCBCLState = FOCBCLReducer(initialState, action);

      expect(result.error).toEqual(null);
      expect(result.hasSaved).toEqual(false);
      expect(result.isLoading).toEqual(false);
      expect(result.focBlockingCustomerLevel).toEqual(null);
      expect(result.totalElements).toEqual(0);
    });
  });
});
