import { FOCBLLState } from './foc-bll.state';
import { FOCBLLFacade } from './foc-bll.facade';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { FOCBlockingLocationLevelListPayload } from '@poss-web/shared/models';
import {
  LoadFOCBLLDetails,
  LoadFOCSchemes,
  ResetFocBllDetails,
  SaveFOCBLLDetails,
  SearchLocation
} from './foc-bll.actions';
describe('FOC Blocking Location Level Facade Testing', () => {
  const initialState: FOCBLLState = {
    error: null,
    isLoading: false,
    hasSaved: false,
    schemeId: null,
    focBlockingDetails: null,
    totalElements: 0,
    selectedLocations: null
  };
  let focBlockingLocationLevelFacade: FOCBLLFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), FOCBLLFacade]
    });
    focBlockingLocationLevelFacade = TestBed.inject(FOCBLLFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Action TestCases', () => {
    it('should call LOAD_FOC_BLL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: FOCBlockingLocationLevelListPayload = {
        pageIndex: 0,
        pageSize: 100,
        id: 'abc'
      };
      const action = new LoadFOCBLLDetails(payload);
      focBlockingLocationLevelFacade.loadFOCBLLDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_FOC_BLL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      const action = new SaveFOCBLLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      focBlockingLocationLevelFacade.saveFOCBLLDetails({
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
      focBlockingLocationLevelFacade.searchLocationCode({
        locationCode: 'URB',
        schemeId: 'abc123'
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_FOC_SCHEMES', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadFOCSchemes('FOC_BLOCKING_STORE');
      focBlockingLocationLevelFacade.loadFOCSchemes('FOC_BLOCKING_STORE');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_FOC_BLL_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetFocBllDetails();
      focBlockingLocationLevelFacade.resetFOCBLLDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors TestCases', () => {
    it('should access the getError', () => {
      expect(focBlockingLocationLevelFacade.getError()).toEqual(
        focBlockingLocationLevelFacade['error$']
      );
    });
    it('should access the getIsLoading', () => {
      expect(focBlockingLocationLevelFacade.getIsLoading()).toEqual(
        focBlockingLocationLevelFacade['isLoading$']
      );
    });
    it('should access the getHasSaved', () => {
      expect(focBlockingLocationLevelFacade.getHasSaved()).toEqual(
        focBlockingLocationLevelFacade['hasSaved$']
      );
    });
    it('should access the getFOCSchemeId', () => {
      expect(focBlockingLocationLevelFacade.getFOCSchemeId()).toEqual(
        focBlockingLocationLevelFacade['schemeId$']
      );
    });
    it('should access the getFocBlockingDetails', () => {
      expect(focBlockingLocationLevelFacade.getFocBlockingDetails()).toEqual(
        focBlockingLocationLevelFacade['focBlockingDetails$']
      );
    });
    it('should access the getTotalElements', () => {
      expect(focBlockingLocationLevelFacade.getTotalElements()).toEqual(
        focBlockingLocationLevelFacade['totalElements$']
      );
    });
  });
});
