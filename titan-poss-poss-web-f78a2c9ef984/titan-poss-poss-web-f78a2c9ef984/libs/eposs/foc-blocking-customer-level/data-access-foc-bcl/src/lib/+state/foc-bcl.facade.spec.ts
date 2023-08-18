import { FOCBCLState } from './foc-bcl.state';
import { FOCBCLFacade } from './foc-bcl.facade';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { FOCBCLListingPayload } from '@poss-web/shared/models';
import {
  LoadFOCBCLDetails,
  LoadFOCSchemes,
  ResetFocBclDetails,
  SaveFOCBCLDetails,
  SearchLocation
} from './foc-bcl.actions';
describe('FOC Blocking Customer Level Facade Testing', () => {
  const initialState: FOCBCLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingCustomerLevel: null,
    totalElements: 0,
    selectedLocations: null
  };
  let focBlockingCustomerLevelFacade: FOCBCLFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FOCBCLFacade]
    });
    focBlockingCustomerLevelFacade = TestBed.inject(FOCBCLFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Action TestCases', () => {
    it('should call LOAD_FOC_BCL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FOCBCLListingPayload = {
        pageIndex: 0,
        pageSize: 100,
        schemeId: 'abc'
      };
      const action = new LoadFOCBCLDetails(payload);
      focBlockingCustomerLevelFacade.loadFOCBCLDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_FOC_BCL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const savePayload = {
        validity: {
          endDate: 123123213213213,
          startDate: 123123123213,

          status: true
        },
        mobileNo: 9010462817,
        configDetails: {
          type: 'FOC_CUSTOMER_DETAILS',
          data: {
            remarks: 'good',
            approvedBy: 'CM',
            isCMNumber: 'true'
          }
        },
        addLocations: ['URB'],
        updateLocations: [],
        removeLocations: []
      };
      const action = new SaveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      focBlockingCustomerLevelFacade.saveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_LOCATION', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SearchLocation({
        locationCode: 'URB',
        schemeId: 'abc123'
      });
      focBlockingCustomerLevelFacade.searchLocationCode({
        locationCode: 'URB',
        schemeId: 'abc123'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_FOC_SCHEMES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadFOCSchemes('FOC_BLOCKING_CUSTOMER');
      focBlockingCustomerLevelFacade.loadFOCSchemes('FOC_BLOCKING_CUSTOMER');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_FOC_BLL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetFocBclDetails();
      focBlockingCustomerLevelFacade.resetFOCBCLDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors TestCases', () => {
    it('should access the getError', () => {
      expect(focBlockingCustomerLevelFacade.getError()).toEqual(
        focBlockingCustomerLevelFacade['error$']
      );
    });
    it('should access the getIsLoading', () => {
      expect(focBlockingCustomerLevelFacade.getIsLoading()).toEqual(
        focBlockingCustomerLevelFacade['isLoading$']
      );
    });
    it('should access the getHasSaved', () => {
      expect(focBlockingCustomerLevelFacade.getHasSaved()).toEqual(
        focBlockingCustomerLevelFacade['hasSaved$']
      );
    });
    it('should access the getFOCSchemeId', () => {
      expect(focBlockingCustomerLevelFacade.getSchemeId()).toEqual(
        focBlockingCustomerLevelFacade['schemeId$']
      );
    });
    it('should access the getFocBlockingDetails', () => {
      expect(focBlockingCustomerLevelFacade.getFOCBCLDetails()).toEqual(
        focBlockingCustomerLevelFacade['FOCBCLDetails$']
      );
    });
    it('should access the getTotalElements', () => {
      expect(focBlockingCustomerLevelFacade.getTotalElements()).toEqual(
        focBlockingCustomerLevelFacade['totalElements$']
      );
    });
  });
});
