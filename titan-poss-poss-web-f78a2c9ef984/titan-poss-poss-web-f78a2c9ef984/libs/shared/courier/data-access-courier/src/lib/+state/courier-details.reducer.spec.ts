import {
  CountrySuccessPayload,
  CourierMaster,
  CourierSelectedLocations,
  LoadCourierDetailsListingPayload,
  LoadCourireDetailsListingSuccessPayload,
  StatesSuccessPayload
} from '@poss-web/shared/models';
import { CourierDetailsState } from './courier-details.state';
import * as actions from './courier-details.actions';
import { CourierDetailsReducer } from './courier-details.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('CourierDetails Reducer Testing Suite', () => {
  const courierDetailsListing: LoadCourireDetailsListingSuccessPayload = {
    courierDetailsListing: [
      {
        courierName: 'BLUE DART',
        isActive: true
      },
      {
        courierName: 'HAND CARRY',
        isActive: true
      }
    ],
    totalElements: 2
  };
  const dummyCourierDetails: CourierMaster = {
    courierName: 'BLUDE DART',
    address: 'Vijayawada',
    stateName: 'Andhra Pradesh',
    townName: 'Machilipatnam',
    description: 'Courier Name is Blue dart',
    mailId: 'titan@gmail.com',
    mobileNumber: '9010462817',
    contactPerson: 'admin',
    isActive: true,
    countryCode: 'IND'
  };
  const dummySearchResponse: CourierMaster[] = [
    {
      courierName: 'BLUDE DART',
      address: 'Vijayawada',
      stateName: 'Andhra Pradesh',
      townName: 'Machilipatnam',
      description: 'Courier Name is Blue dart',
      mailId: 'titan@gmail.com',
      mobileNumber: '9010462817',
      contactPerson: 'admin',
      isActive: true,
      countryCode: 'IND'
    }
  ];
  const dummySelectedLocations: CourierSelectedLocations[] = [
    {
      id: 'PNA',
      description: 'PNA'
    },
    {
      id: 'URB',
      description: 'URB'
    }
  ];
  const initialState: CourierDetailsState = {
    courierDetailsListing: null,
    totalCourierDetails: 0,
    courierDetails: null,
    error: null,
    isSaving: null,
    hasSaved: null,
    hasUpdated: null,
    hasSearched: false,
    selectedLocations: null,
    hasLocationsUpdated: null,
    country: null,
    states: null,
    isLoading: null
  };
  const dummyStates: StatesSuccessPayload[] = [
    {
      id: '1',
      stateCode: '1',
      description: 'Andhra Pradesh'
    }
  ];
  const dummyCountry: CountrySuccessPayload[] = [
    {
      id: '2',
      name: 'India'
    }
  ];
  describe('Testing LoadCourierDetails', () => {
    it('LoadCourierDetails should return proper state', () => {
      const payload: LoadCourierDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadCourierDetails(payload);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCourierDetailsSuccess should return success response', () => {
      const response = courierDetailsListing;

      const action = new actions.LoadCourierDetailsSuccess(response);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.courierDetailsListing).toBe(response.courierDetailsListing);
      expect(result.totalCourierDetails).toBe(response.totalElements);
    });
    it('LoadCFAProductCodeFailure should return error', () => {
      const action = new actions.LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing LoadCourierDetailsBasedOnCourierName', () => {
    it('LoadCourierDetails should return proper state', () => {
      const action = new actions.LoadCourierDetailsBasedOnCourierName(
        'BLUE DART'
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCourierDetailsBasedOnCourierNameSuccess should return success response', () => {
      const response = dummyCourierDetails;

      const action = new actions.LoadCourierDetailsBasedOnCourierNameSuccess(
        dummyCourierDetails
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.courierDetails).toBe(response);
    });
    it('LoadCourierDetailsBasedOnCourierNameFailure should return error', () => {
      const action = new actions.LoadCourierDetailsBasedOnCourierNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing ResetCourierDetails', () => {
    it('ResetCourierDetails should return proper state', () => {
      const action = new actions.ResetCourierDetails();

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error).toBe(null);
      expect(result.courierDetails).toBe(null);
      expect(result.isSaving).toBe(null);
      expect(result.hasUpdated).toBe(null);
      expect(result.hasSearched).toBe(null);
      expect(result.hasLocationsUpdated).toBe(null);
      expect(result.selectedLocations.length).toBe(0);
    });
  });
  describe('Testing SaveCourierDetails', () => {
    it('SaveCourierDetails should return proper state', () => {
      const action = new actions.SaveCourierDetails(dummyCourierDetails);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveCourierDetailsSuccess should return success response', () => {
      const response = dummyCourierDetails;

      const action = new actions.SaveCourierDetailsSuccess(dummyCourierDetails);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.courierDetails).toBe(response);
    });
    it('SaveCourierDetailsSuccessFailure should return error', () => {
      const action = new actions.SaveCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('Testing UpdateCourierDetails', () => {
    it('UpdateCourierDetails should return proper state', () => {
      const action = new actions.UpdateCourierDetails({
        courierName: 'BLUE DART',
        data: {
          address: 'Vijayawada',
          stateName: 'Andhra Pradesh',
          townName: 'Machilipatnam',
          description: 'Courier Name is Blue dart',
          mailId: 'titan@gmail.com',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true,
          countryCode: 'IND'
        }
      });

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateCourierDetailsSuccess should return success response', () => {
      const response = dummyCourierDetails;

      const action = new actions.UpdateCourierDetailsSuccess(
        dummyCourierDetails
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
      expect(result.courierDetails).toBe(dummyCourierDetails);
    });
    it('UpdateCourierDetailsSuccessFailure should return error', () => {
      const action = new actions.UpdateCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });
  describe('Testing SearchCourierName', () => {
    it('SearchCourierName should return proper state', () => {
      const action = new actions.SearchCourierName('Blue Dart');

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.hasSearched).toBe(false);
      expect(result.isLoading).toBe(true);
    });
    it('SearchCourierNameSuccess should return success response', () => {
      const response = dummyCourierDetails;

      const action = new actions.SearchCourierNameSuccess(dummySearchResponse);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.hasSearched).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SearchCourierNameFailure should return error', () => {
      const action = new actions.SearchCourierNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.courierDetailsListing).toEqual(null);
      expect(result.hasSearched).toEqual(false);
      expect(result.totalCourierDetails).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing UpdateCourierStatus', () => {
    it('UpdateCourierStatus should return proper state', () => {
      const action = new actions.UpdateCourierStatus({
        courierName: 'HandCarry',
        isActive: true
      });

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error).toBe(null);
      expect(result.hasUpdated).toBe(false);
      expect(result.isLoading).toBe(true);
    });
    it('UpdateCourierStatusSuccess should return success response', () => {
      //const response = dummyCourierDetails;

      const action = new actions.UpdateCourierStatusSuccess();

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.error).toBe(null);
      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('UpdateCourierStatusFailure should return error', () => {
      const action = new actions.UpdateCourierStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.hasUpdated).toBe(false);
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing LoadCountry', () => {
    it('LoadCountry should return proper state', () => {
      const action = new actions.LoadCountry();

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.error).toEqual(null);
      expect(result.isLoading).toBe(true);
    });
    it('LoadCountrySuccess should return success response', () => {
      //const response = dummyCourierDetails;

      const action = new actions.LoadCountrySuccess(dummyCountry);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.error).toBe(null);
      expect(result.country).toBe(dummyCountry);
      expect(result.isLoading).toBe(false);
    });
    it('LoadCountryFailure should return error', () => {
      const action = new actions.LoadCountryFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing LoadStates', () => {
    it('LoadStates should return proper state', () => {
      const action = new actions.LoadStates('IND');

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(true);
    });
    it('LoadStatesSuccess should return success response', () => {
      //const response = dummyCourierDetails;

      const action = new actions.LoadStatesSuccess(dummyStates);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.error).toBe(null);
      expect(result.states).toBe(dummyStates);
      expect(result.isLoading).toBe(false);
    });
    it('LoadStatesFailure should return error', () => {
      const action = new actions.LoadStatesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing SelectedLocations', () => {
    const payload = [
      {
        id: 'PNA',
        description: 'PNA'
      }
    ];
    it('SelectedLocations should return proper state', () => {
      const action = new actions.SelectedLocations('BLUE DART');

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(true);
    });
    it('SelectedLocationsSuccess should return success response', () => {
      //const response = dummyCourierDetails;

      const action = new actions.SelectedLocationsSuccess(payload);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.selectedLocations).toBe(payload);
    });
    it('LoadStatesFailure should return error', () => {
      const action = new actions.SelectedLocationsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
    });
  });
  describe('Testing LocationMapping', () => {
    const payload = {
      courierName: 'BLUE DART',
      locationMapping: {
        addLocations: ['PNA', 'URB'],
        removeLocations: ['KHN']
      }
    };
    it('LocationMapping should return proper state', () => {
      const action = new actions.LocationMapping(payload);

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.hasLocationsUpdated).toBe(false);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SelectedLocationsSuccess should return success response', () => {
      //const response = dummyCourierDetails;

      const action = new actions.LocationMappingSuccess();

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );
      expect(result.hasLocationsUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });
    it('LocationMappingFailure should return error', () => {
      const action = new actions.LocationMappingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CourierDetailsState = CourierDetailsReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toBe(false);
      expect(result.hasLocationsUpdated).toBe(false);
    });
  });
});
