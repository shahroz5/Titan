import {
  CustomErrors,
  FOCBCLListingPayload,
  FOCBlockingCustomerLevelListResponse
} from '@poss-web/shared/models';
import {
  FOCBCLActionTypes,
  LoadFOCBCLDetails,
  LoadFOCBCLDetailsFailure,
  LoadFOCBCLDetailsSuccess,
  LoadFOCSchemes,
  LoadFOCSchemesFailure,
  LoadFOCSchemesSuccess,
  LoadSelectedLocations,
  LoadSelectedLocationsFailure,
  LoadSelectedLocationsSuccess,
  ResetFocBclDetails,
  SaveFOCBCLDetails,
  SaveFOCBCLDetailsFailure,
  SaveFOCBCLDetailsSuccess,
  SearchLocation,
  SearchLocationFailure,
  SearchLocationSuccess
} from './foc-bcl.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('FOC BLOCKING CUSTOMER LEVEL Actions Testing Suite', () => {
  const savePayload = {
    validity: {
      endDate: 123123213213213,
      startDate: 123123123213,

      status: true
    },
    configDetails: {
      type: 'FOC_BLOCKING_CSUTOMER',
      data: {
        remarks: 'good',
        approvedBy: 'CM',
        isCMNumber: 'true'
      }
    },
    addLocations: ['URB'],
    updateLocations: [],
    removeLocations: [],
    mobileNo: 9010462817
  };
  const locationPayload: FOCBCLListingPayload = {
    pageIndex: 0,
    pageSize: 100,
    schemeId: 'abc123'
  };
  const focBlockingCustomerDetails: FOCBlockingCustomerLevelListResponse = {
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
  describe('SaveFOCBCLDetails Action TestCases', () => {
    it('should check correct type is used for SaveFOCBCLDetails action ', () => {
      const action = new SaveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });

      expect(action.type).toEqual(FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS);
      expect(action.payload).toEqual({
        id: 'abc123',
        savePayload: savePayload
      });
    });

    it('should check correct type is used for SaveFOCBCLDetailsSuccess action ', () => {
      const action = new SaveFOCBCLDetailsSuccess();

      expect(action.type).toEqual(
        FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_SUCCESS
      );
    });
    it('should check correct type is used for SaveFOCBCLDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveFOCBCLDetailsFailure(payload);

      expect(action.type).toEqual(
        FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadFOCBCLDetails Action TestCases', () => {
    it('should check correct type is used for LoadFOCBCLDetails action ', () => {
      const action = new LoadFOCBCLDetails(locationPayload);

      expect(action.type).toEqual(FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS);
      expect(action.payload).toEqual(locationPayload);
    });

    it('should check correct type is used for LoadFOCBCLDetailsSuccess action ', () => {
      const action = new LoadFOCBCLDetailsSuccess(focBlockingCustomerDetails);

      expect(action.type).toEqual(
        FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(focBlockingCustomerDetails);
    });
    it('should check correct type is used for LoadFOCBCLDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFOCBCLDetailsFailure(payload);

      expect(action.type).toEqual(
        FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_FAILURE
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

      expect(action.type).toEqual(FOCBCLActionTypes.SEARCH_LOCATION);
      expect(action.payload).toEqual({
        schemeId: 'abc123',
        locationCode: 'URB'
      });
    });

    it('should check correct type is used for SearchLocationSuccess action ', () => {
      const action = new SearchLocationSuccess(
        focBlockingCustomerDetails.response
      );

      expect(action.type).toEqual(FOCBCLActionTypes.SEARCH_LOCATION_SUCCESS);
      expect(action.payload).toEqual(focBlockingCustomerDetails.response);
    });
    it('should check correct type is used for SearchLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchLocationFailure(payload);

      expect(action.type).toEqual(FOCBCLActionTypes.SEARCH_LOCATION_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadFOCSchemes Action TestCases', () => {
    it('should check correct type is used for LoadFOCSchemes action ', () => {
      const action = new LoadFOCSchemes('FOC_LOCATION_SCHEMES');

      expect(action.type).toEqual(FOCBCLActionTypes.LOAD_FOC_SCHEMES);
      expect(action.payload).toEqual('FOC_LOCATION_SCHEMES');
    });

    it('should check correct type is used for LoadFOCSchemesSuccess action ', () => {
      const action = new LoadFOCSchemesSuccess('abc123');

      expect(action.type).toEqual(FOCBCLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS);
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for LoadFOCSchemesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFOCSchemesFailure(payload);

      expect(action.type).toEqual(FOCBCLActionTypes.LOAD_FOC_SCHEMES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetFocBllDetails', () => {
    it('should check correct type is used for ResetFocBllDetails action ', () => {
      const action = new ResetFocBclDetails();

      expect(action.type).toEqual(FOCBCLActionTypes.RESET_FOC_BCL_DETAILS);
    });
  });

  describe('LoadSelectedLocations Action TestCases', () => {
    it('should check correct type is used for LoadSelectedLocations action ', () => {
      const action = new LoadSelectedLocations(locationPayload);

      expect(action.type).toEqual(FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS);
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
        FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadSelectedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedLocationsFailure(payload);

      expect(action.type).toEqual(
        FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
