import { CourierDetailsFacade } from './courier-details.facade';
import { CourierDetailsState } from './courier-details.state';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CourierMaster,
  LoadCourierDetailsListingPayload
} from '@poss-web/shared/models';
import {
  LoadCountry,
  LoadCourierDetails,
  LoadCourierDetailsBasedOnCourierName,
  LoadStates,
  LocationMapping,
  ResetCourierDetails,
  SaveCourierDetails,
  SearchCourierName,
  SelectedLocations,
  UpdateCourierDetails,
  UpdateCourierStatus
} from './courier-details.actions';
describe('CourierDetails Facade Testing Suite', () => {
  const payload: CourierMaster = {
    courierName: 'BLUDE DART',
    address: 'Vijayawada',
    stateName: 'ANDHRA PRADESH',
    townName: 'Machilipatnam',
    description: 'Courier Name is BLUDE DART',
    mailId: 'titan@gmail.com',
    mobileNumber: '9010462817',
    contactPerson: 'admin',
    isActive: true,
    countryCode: 'IND'
  };
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
  let courierDetailsFacade: CourierDetailsFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CourierDetailsFacade]
    });
    courierDetailsFacade = TestBed.inject(CourierDetailsFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions action', () => {
    it('should call LOAD_CFA_PRODUCTS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const listPayload: LoadCourierDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCourierDetails(listPayload);
      courierDetailsFacade.loadCourierDetailsListing(listPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadCourierDetailsBasedOnCourierName('BLUE DART');
      courierDetailsFacade.loadCourierDetailsBasedOnCourierName('BLUE DART');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_COURIER_NAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchCourierName('BLUE DART');
      courierDetailsFacade.searchCourierName('BLUE DART');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_COURIER_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetCourierDetails();
      courierDetailsFacade.resetCourierDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_COURIER_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveCourierDetails(payload);
      courierDetailsFacade.saveCourierDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_COURIER_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateCourierDetails({
        courierName: 'BLUDE DART',
        data: {
          address: 'Vijayawada',
          stateName: 'ANDHRA PRADESH',
          townName: 'Machilipatnam',
          description: 'Courier Name is BLUDE DART',
          mailId: 'titan@gmail.com',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true,
          countryCode: 'IND'
        }
      });
      courierDetailsFacade.updateCourierDetails({
        courierName: 'BLUDE DART',
        data: {
          address: 'Vijayawada',
          stateName: 'ANDHRA PRADESH',
          townName: 'Machilipatnam',
          description: 'Courier Name is BLUDE DART',
          mailId: 'titan@gmail.com',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true,
          countryCode: 'IND'
        }
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_COURIER_STATUS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateCourierStatus({
        courierName: 'BLUE DART',
        isActive: true
      });
      courierDetailsFacade.updateCourierStatus({
        courierName: 'BLUE DART',
        isActive: true
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_COUNTRIES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadCountry();
      courierDetailsFacade.loadCountries();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_STATES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadStates('IND');
      courierDetailsFacade.loadStates('IND');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SELECTED_LOCATIONS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SelectedLocations('Hand Carry');
      courierDetailsFacade.loadSelectedLocations('Hand Carry');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    // it('should call SELECTED_LOCATIONS', () => {
    //   spyOn(store, 'dispatch').and.returnValue({});
    //   const action = new SelectedLocations('BLUEDART');
    //   courierDetailsFacade.loadSelectedLocations('BLUDEDART');
    //   expect(store.dispatch).toHaveBeenCalledWith(action);
    // });
    it('should call SAVE_LOCATIONS', () => {
      const locationPayload = {
        courierName: 'BLUE DART',
        locationMapping: {
          addLocations: ['PNA'],
          removeLocations: ['PNA']
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LocationMapping(locationPayload);
      courierDetailsFacade.saveLocationMapping(locationPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector action', () => {
    it('should access the get courierdetails listing', () => {
      expect(courierDetailsFacade.getCourierDetailsListing()).toEqual(
        courierDetailsFacade['courierDetailsListing$']
      );
    });
    it('should access the get totalElements', () => {
      expect(courierDetailsFacade.getTotalCourierDetails()).toEqual(
        courierDetailsFacade['totalCourierDetails$']
      );
    });
    it('should access the get courierdetails based on courier name', () => {
      expect(
        courierDetailsFacade.getCourierDetailsBasedOnCourierName()
      ).toEqual(courierDetailsFacade['courierDetailsBasedOnCourierName$']);
    });
    it('should access the get hassaved', () => {
      expect(courierDetailsFacade.getHasSaved()).toEqual(
        courierDetailsFacade['hasSaved$']
      );
    });
    it('should access the get hasupdated', () => {
      expect(courierDetailsFacade.getHasUpdated()).toEqual(
        courierDetailsFacade['hasUpdated$']
      );
    });
    it('should access the get error', () => {
      expect(courierDetailsFacade.getError()).toEqual(
        courierDetailsFacade['error$']
      );
    });
    it('should access the get error', () => {
      expect(courierDetailsFacade.getError()).toEqual(
        courierDetailsFacade['error$']
      );
    });
    it('should access the get haslocationsupdated', () => {
      expect(courierDetailsFacade.getHasLocationsUpdated()).toEqual(
        courierDetailsFacade['hasLocationsUpdated$']
      );
    });
    it('should access the get hasSearched', () => {
      expect(courierDetailsFacade.getHasSearched()).toEqual(
        courierDetailsFacade['hasSearched$']
      );
    });
    it('should access the get selectedlocations', () => {
      expect(courierDetailsFacade.getSelectedLocations()).toEqual(
        courierDetailsFacade['selectedLocations$']
      );
    });
    it('should access the get selectedlocations', () => {
      expect(courierDetailsFacade.getSelectedLocations()).toEqual(
        courierDetailsFacade['selectedLocations$']
      );
    });
    it('should access the get isloading', () => {
      expect(courierDetailsFacade.getIsLoading()).toEqual(
        courierDetailsFacade['isLoading$']
      );
    });
    it('should access the get countries', () => {
      expect(courierDetailsFacade.getCountry()).toEqual(
        courierDetailsFacade['country$']
      );
    });
    it('should access the get states', () => {
      expect(courierDetailsFacade.getStates()).toEqual(
        courierDetailsFacade['states$']
      );
    });
  });
});
