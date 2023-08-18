import {
  CustomErrors,
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevelListPayload
} from '@poss-web/shared/models';
import {
  FOCBLLActionTypes,
  LoadFOCBLLDetails,
  LoadFOCBLLDetailsFailure,
  LoadFOCBLLDetailsSuccess,
  LoadFOCSchemes,
  LoadFOCSchemesFailure,
  LoadFOCSchemesSuccess,
  LoadSelectedLocations,
  LoadSelectedLocationsFailure,
  LoadSelectedLocationsSuccess,
  ResetFocBllDetails,
  SaveFOCBLLDetails,
  SaveFOCBLLDetailsFailure,
  SaveFOCBLLDetailsSuccess,
  SearchLocation,
  SearchLocationFailure,
  SearchLocationSuccess
} from './foc-bll.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('FOC BLOCKING LOCATION LEVEL Actions Testing Suite', () => {
  const locationPayload: FOCBlockingLocationLevelListPayload = {
    pageIndex: 0,
    pageSize: 100,
    id: 'abc123'
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
  describe('SaveFOCBLLDetails Action TestCases', () => {
    it('should check correct type is used for SaveFOCBLLDetails action ', () => {
      const action = new SaveFOCBLLDetails({
        id: 'abc123',
        savePayload: savePayload
      });

      expect(action.type).toEqual(FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS);
      expect(action.payload).toEqual({
        id: 'abc123',
        savePayload: savePayload
      });
    });

    it('should check correct type is used for SaveFOCBLLDetailsSuccess action ', () => {
      const action = new SaveFOCBLLDetailsSuccess();

      expect(action.type).toEqual(
        FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_SUCCESS
      );
    });
    it('should check correct type is used for SaveFOCBLLDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveFOCBLLDetailsFailure(payload);

      expect(action.type).toEqual(
        FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadFOCBLLDetails Action TestCases', () => {
    it('should check correct type is used for LoadFOCBLLDetails action ', () => {
      const action = new LoadFOCBLLDetails(locationPayload);

      expect(action.type).toEqual(FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS);
      expect(action.payload).toEqual(locationPayload);
    });

    it('should check correct type is used for LoadFOCBLLDetailsSuccess action ', () => {
      const action = new LoadFOCBLLDetailsSuccess(focBlockingLocationDetails);

      expect(action.type).toEqual(
        FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(focBlockingLocationDetails);
    });
    it('should check correct type is used for LoadFOCBLLDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFOCBLLDetailsFailure(payload);

      expect(action.type).toEqual(
        FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchLocation Action TestCases', () => {
    it('should check correct type is used for SearchLocation action ', () => {
      const action = new SearchLocation({
        schemeId: 'abc123',
        locationCode: 'URB'
      });

      expect(action.type).toEqual(FOCBLLActionTypes.SEARCH_LOCATION);
      expect(action.payload).toEqual({
        schemeId: 'abc123',
        locationCode: 'URB'
      });
    });

    it('should check correct type is used for SearchLocationSuccess action ', () => {
      const action = new SearchLocationSuccess(
        focBlockingLocationDetails.response
      );

      expect(action.type).toEqual(FOCBLLActionTypes.SEARCH_LOCATION_SUCCESS);
      expect(action.payload).toEqual(focBlockingLocationDetails.response);
    });
    it('should check correct type is used for SearchLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchLocationFailure(payload);

      expect(action.type).toEqual(FOCBLLActionTypes.SEARCH_LOCATION_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadFOCSchemes Action TestCases', () => {
    it('should check correct type is used for LoadFOCSchemes action ', () => {
      const action = new LoadFOCSchemes('FOC_LOCATION_SCHEMES');

      expect(action.type).toEqual(FOCBLLActionTypes.LOAD_FOC_SCHEMES);
      expect(action.payload).toEqual('FOC_LOCATION_SCHEMES');
    });

    it('should check correct type is used for LoadFOCSchemesSuccess action ', () => {
      const action = new LoadFOCSchemesSuccess('abc123');

      expect(action.type).toEqual(FOCBLLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS);
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for LoadFOCSchemesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFOCSchemesFailure(payload);

      expect(action.type).toEqual(FOCBLLActionTypes.LOAD_FOC_SCHEMES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetFocBllDetails', () => {
    it('should check correct type is used for ResetFocBllDetails action ', () => {
      const action = new ResetFocBllDetails();

      expect(action.type).toEqual(FOCBLLActionTypes.RESET_FOC_BLL_DETAILS);
    });
  });

  describe('LoadSelectedLocations Action TestCases', () => {
    it('should check correct type is used for LoadSelectedLocations action ', () => {
      const action = new LoadSelectedLocations(locationPayload);

      expect(action.type).toEqual(FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS);
      expect(action.payload).toEqual(locationPayload);
    });

    it('should check correct type is used for LoadSelectedLocationsSuccess action ', () => {
      const payload = [
        {
          id: 'ABL',
          description: 'ABL'
        }
      ];
      const action = new LoadSelectedLocationsSuccess(payload);

      expect(action.type).toEqual(
        FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedLocationsFailure(payload);

      expect(action.type).toEqual(
        FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
