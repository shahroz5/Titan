import {
  CourierMaster,
  CustomErrors,
  LoadCourierDetailsListingPayload,
  LoadCourireDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CourierDetailsActionTypes,
  LoadCountry,
  LoadCountryFailure,
  LoadCountrySuccess,
  LoadCourierDetails,
  LoadCourierDetailsBasedOnCourierName,
  LoadCourierDetailsBasedOnCourierNameFailure,
  LoadCourierDetailsBasedOnCourierNameSuccess,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadStatesSuccess,
  LocationMapping,
  LocationMappingFailure,
  LocationMappingSuccess,
  ResetCourierDetails,
  SaveCourierDetails,
  SaveCourierDetailsFailure,
  SaveCourierDetailsSuccess,
  SearchCourierName,
  SearchCourierNameFailure,
  SearchCourierNameSuccess,
  SelectedLocations,
  SelectedLocationsFailure,
  SelectedLocationsSuccess,
  UpdateCourierDetails,
  UpdateCourierDetailsFailure,
  UpdateCourierDetailsSuccess,
  UpdateCourierStatus,
  UpdateCourierStatusFailure,
  UpdateCourierStatusSuccess
} from './courier-details.actions';

describe('CourierDetails Testing Suite', () => {
  const dummyCourierDetailsListing: LoadCourireDetailsListingSuccessPayload = {
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
  describe('CourierDetailsListing Action Test Cases', () => {
    it('should check correct type is used for  LoadCFAProducts action ', () => {
      const payload: LoadCourierDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCourierDetails(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCourierDetailsSuccess action ', () => {
      const payload: LoadCourireDetailsListingSuccessPayload = dummyCourierDetailsListing;
      const action = new LoadCourierDetailsSuccess(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCourierDetailsFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadCourierDetailsBasedOnCourierName Action Test Cases', () => {
    it('should check correct type is used for  LoadCourierDetailsBasedOnCourierName action ', () => {
      const action = new LoadCourierDetailsBasedOnCourierName('BLUE DART');

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME
      );
      expect(action.payload).toEqual('BLUE DART');
    });

    it('should check correct type is used for  LoadCourierDetailsBasedOnCourierNameSuccess action ', () => {
      const action = new LoadCourierDetailsBasedOnCourierNameSuccess(
        dummyCourierDetails
      );

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_SUCCESS
      );
      expect(action.payload).toEqual(dummyCourierDetails);
    });
    it('should check correct type is used for  LoadCourierDetailsBasedOnCourierNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCourierDetailsBasedOnCourierNameFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetCourierDetails Action Test Cases', () => {
    it('should check correct type is used for  ResetCourierDetails action ', () => {
      const action = new ResetCourierDetails();

      expect(action.type).toEqual(
        CourierDetailsActionTypes.RESET_COURIER_DETAILS
      );
      //expect(action.payload).toEqual('BLUE DART');
    });
  });
  describe('SaveCourierDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveCourierDetails action ', () => {
      const action = new SaveCourierDetails(dummyCourierDetails);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SAVE_COURIER_DETAILS
      );
      expect(action.payload).toEqual(dummyCourierDetails);
    });

    it('should check correct type is used for  SaveCourierDetailsSuccess action ', () => {
      const action = new SaveCourierDetailsSuccess(dummyCourierDetails);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SAVE_COURIER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(dummyCourierDetails);
    });
    it('should check correct type is used for SaveCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCourierDetailsFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SAVE_COURIER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateCourierDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdateCourierDetails action ', () => {
      const action = new UpdateCourierDetails({
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

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_DETAILS
      );
      expect(action.payload).toEqual({
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
    });

    it('should check correct type is used for  UpdateCourierDetailsSuccess action ', () => {
      const action = new UpdateCourierDetailsSuccess(dummyCourierDetails);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(dummyCourierDetails);
    });
    it('should check correct type is used for UpdateCourierDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCourierDetailsFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchCourierName Action Test Cases', () => {
    it('should check correct type is used for  SearchCourierName action ', () => {
      const action = new SearchCourierName('BLUE DART');

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SEARCH_COURIER_NAME
      );
      expect(action.payload).toEqual('BLUE DART');
    });

    it('should check correct type is used for  SearchCourierNameSuccess action ', () => {
      const action = new SearchCourierNameSuccess([dummyCourierDetails]);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SEARCH_COURIER_NAME_SUCCESS
      );
      expect(action.payload).toEqual([dummyCourierDetails]);
    });
    it('should check correct type is used for SearchCourierNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCourierNameFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SEARCH_COURIER_NAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateCourierStatus Action Test Cases', () => {
    it('should check correct type is used for  UpdateCourierStatus action ', () => {
      const action = new UpdateCourierStatus({
        courierName: 'BLUE DART',
        isActive: true
      });

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_STATUS
      );
      expect(action.payload).toEqual({
        courierName: 'BLUE DART',
        isActive: true
      });
    });

    it('should check correct type is used for  UpdateCourierStatusSuccess action ', () => {
      const action = new UpdateCourierStatusSuccess();

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_STATUS_SUCCESS
      );
      //expect(action.payload).toEqual(dummyCourierDetails);
    });
    it('should check correct type is used for UpdateCourierStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCourierStatusFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.UPDATE_COURIER_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadCountry Action Test Cases', () => {
    it('should check correct type is used for  LoadCountry action ', () => {
      const action = new LoadCountry();

      expect(action.type).toEqual(CourierDetailsActionTypes.LOAD_COUNTRY);
      //expect(action.payload).toEqual();
    });

    it('should check correct type is used for  LoadCountrySuccess action ', () => {
      const action = new LoadCountrySuccess([
        {
          id: '2',
          name: 'India'
        }
      ]);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COUNTRY_SUCCESS
      );
      expect(action.payload).toEqual([
        {
          id: '2',
          name: 'India'
        }
      ]);
    });
    it('should check correct type is used for LoadCountryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_COUNTRY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadStates Action Test Cases', () => {
    it('should check correct type is used for  LoadStates action ', () => {
      const action = new LoadStates('IND');

      expect(action.type).toEqual(CourierDetailsActionTypes.LOAD_STATES);
      expect(action.payload).toEqual('IND');
    });

    it('should check correct type is used for  LoadStatesSuccess action ', () => {
      const action = new LoadStatesSuccess([
        {
          id: '1',
          stateCode: '1',
          description: 'Andhra Pradesh'
        }
      ]);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_STATES_SUCCESS
      );
      expect(action.payload).toEqual([
        {
          id: '1',
          stateCode: '1',
          description: 'Andhra Pradesh'
        }
      ]);
    });
    it('should check correct type is used for LoadStatesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStatesFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOAD_STATES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SelectedLocations Action Test Cases', () => {
    it('should check correct type is used for  SelectedLocations action ', () => {
      const action = new SelectedLocations('BLUE DART');

      expect(action.type).toEqual(CourierDetailsActionTypes.SELECTED_LOCATIONS);
      expect(action.payload).toEqual('BLUE DART');
    });

    it('should check correct type is used for  SelectedLocationsSuccess action ', () => {
      const action = new SelectedLocationsSuccess([
        {
          id: 'PNA',
          description: 'PNA'
        }
      ]);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SELECTED_LOCATIONS_SUCCEESS
      );
      expect(action.payload).toEqual([
        {
          id: 'PNA',
          description: 'PNA'
        }
      ]);
    });
    it('should check correct type is used for SelectedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SelectedLocationsFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.SELECTED_LOCATIONS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LocationMapping Action Test Cases', () => {
    it('should check correct type is used for  LocationMapping action ', () => {
      const action = new LocationMapping({
        courierName: 'Blue Dart',
        locationMapping: {
          addLocations: ['PNA', 'URB'],
          removeLocations: ['KHN']
        }
      });

      expect(action.type).toEqual(CourierDetailsActionTypes.LOCATION_MAPPING);
      expect(action.payload).toEqual({
        courierName: 'Blue Dart',
        locationMapping: {
          addLocations: ['PNA', 'URB'],
          removeLocations: ['KHN']
        }
      });
    });

    it('should check correct type is used for  LocationMappingSuccess action ', () => {
      const action = new LocationMappingSuccess();

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOCATION_MAPPING_SUCCESS
      );
      // expect(action.payload).toEqual([
      //   {
      //     id: 'PNA',
      //     description: 'PNA'
      //   }
      // ]);
    });
    it('should check correct type is used for LocationMappingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LocationMappingFailure(payload);

      expect(action.type).toEqual(
        CourierDetailsActionTypes.LOCATION_MAPPING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
