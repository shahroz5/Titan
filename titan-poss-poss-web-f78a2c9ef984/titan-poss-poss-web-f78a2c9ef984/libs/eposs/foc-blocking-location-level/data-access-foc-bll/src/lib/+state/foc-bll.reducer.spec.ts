import { FOCBLLState } from './foc-bll.state';
import * as actions from './foc-bll.actions';
import { FOCBLLReducer } from './foc-bll.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { FOCBlockingLocaionLevelListResponse } from '@poss-web/shared/models';
describe('FOC Blocking Location Level Reducer Testing Suite', () => {
  const focBlockingLocationDetails: FOCBlockingLocaionLevelListResponse = {
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
        id: 'abc123'
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
  const initialState: FOCBLLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingDetails: null,
    totalElements: 0,
    selectedLocations: null
  };
  describe('Testing LoadFOCBLLDetails', () => {
    it('LoadFOCBLLDetails should return proper state', () => {
      const payload = {
        pageIndex: 0,
        pageSize: 10,
        id: 'abc123'
      };
      const action = new actions.LoadFOCBLLDetails(payload);

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadFOCBLLDetailsSuccess should return proper state', () => {
      const action = new actions.LoadFOCBLLDetailsSuccess(
        focBlockingLocationDetails
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.focBlockingDetails).toBe(
        focBlockingLocationDetails.response
      );
      expect(result.totalElements).toBe(
        focBlockingLocationDetails.totalElements
      );
    });

    it('LoadFOCBLLDetailsFailure should return error', () => {
      const action = new actions.LoadFOCBLLDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SaveFOCBLLDetails', () => {
    it('SaveFOCBLLDetails should return proper state', () => {
      const action = new actions.SaveFOCBLLDetails({
        id: 'abc123',
        savePayload: savePayload
      });

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(false);
    });

    it('SaveFOCBLLDetailsSuccess should return proper state', () => {
      const action = new actions.SaveFOCBLLDetailsSuccess();

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.hasSaved).toBe(true);
    });

    it('SaveFOCBLLDetailsFailure should return error', () => {
      const action = new actions.SaveFOCBLLDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

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

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('SearchLocationSuccess should return proper state', () => {
      const action = new actions.SearchLocationSuccess(
        focBlockingLocationDetails.response
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.focBlockingDetails).toBe(
        focBlockingLocationDetails.response
      );
    });

    it('SearchLocationFailure should return error', () => {
      const action = new actions.SearchLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadFOCSchemes', () => {
    it('LoadFOCSchemes should return proper state', () => {
      const action = new actions.LoadFOCSchemes('FOC_BLOCKING_LOCATION');

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadFOCSchemesSuccess should return proper state', () => {
      const action = new actions.LoadFOCSchemesSuccess('abc123');

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.schemeId).toBe('abc123');
    });

    it('LoadFOCSchemesFailure should return error', () => {
      const action = new actions.LoadFOCSchemesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });

    it('ResetFocBllDetails should return error', () => {
      const action = new actions.ResetFocBllDetails();

      const result: FOCBLLState = FOCBLLReducer(initialState, action);

      expect(result.error).toEqual(null);
      expect(result.hasSaved).toEqual(false);
      expect(result.isLoading).toEqual(false);
      expect(result.focBlockingDetails).toEqual(null);
      expect(result.totalElements).toEqual(0);
    });
  });
});
