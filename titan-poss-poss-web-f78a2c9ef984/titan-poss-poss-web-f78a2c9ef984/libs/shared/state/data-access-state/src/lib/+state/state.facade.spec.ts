import {
  LoadStateListingPayload,
  SaveStateDetailsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { StateFacade } from './state.facade';

import { StatesState } from './state.state';
import { stateAdapter, countryAdapter, stateTaxAdapter } from './state.entity';
import {
  LoadStateDetails,
  SaveStateFormDetails,
  EditStateDetails,
  LoadStateByCode,
  LoadCountryDetails,
  SearchState
} from './state.actions';

describe('StateFacade Testing Suite', () => {
  const initialState: StatesState = {
    stateDetailsListing: stateAdapter.getInitialState(),
    countryDetailsListing: countryAdapter.getInitialState(),
    totalStateDetails: 0,
    error: null,
    isLoading: false,
    stateTaxDetails: stateTaxAdapter.getInitialState(),
    stateDetailsByStateCode: null,
    saveStateDetailsResponse: null,
    editStateDetailsResponse: null,
    isSearchElements: false,
    isActiveUpdated: null
  };

  let stateFacade: StateFacade;
  let store: MockStore<StateFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), StateFacade]
    });
    store = TestBed.inject<any>(Store);
    stateFacade = TestBed.inject(StateFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_STATE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadStateListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStateDetails(payload);
      stateFacade.loadStateDetailsListing(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_STATE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new SaveStateFormDetails(payload);
      stateFacade.saveStateFormDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call EDIT_STATE_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new EditStateDetails(payload);
      stateFacade.editStateFormDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_STATE_DETAILS_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'KA';
      const action = new LoadStateByCode(payload);
      stateFacade.loadStateByStateCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_COUNTRY_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadCountryDetails();
      stateFacade.loadCountriesListing();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_STATE_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'KA';
      const action = new SearchState(payload);
      stateFacade.searchState(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getStateDetailsListing selector action', () => {
      expect(stateFacade.getStateDetailsListing()).toEqual(
        stateFacade['stateListing$']
      );
    });

    it('should access the getCountryDetailsListing selector action', () => {
      expect(stateFacade.getCountryDetailsListing()).toEqual(
        stateFacade['countryListing$']
      );
    });

    it('should access the getTotalStateDetails selector action', () => {
      expect(stateFacade.getTotalStateDetails()).toEqual(
        stateFacade['totalStateDetails$']
      );
    });

    it('should access the getIsStateListingLoading selector action', () => {
      expect(stateFacade.getIsStateListingLoading()).toEqual(
        stateFacade['isStateLoading$']
      );
    });

    it('should access the getStateByStateCode selector action', () => {
      expect(stateFacade.getStateByStateCode()).toEqual(
        stateFacade['stateDetailsStateCode$']
      );
    });

    it('should access the getStateDetailsSaveResponse selector action', () => {
      expect(stateFacade.getStateDetailsSaveResponse()).toEqual(
        stateFacade['isStateDetailsSaved$']
      );
    });

    it('should access the getStateDetailsEditResponse selector action', () => {
      expect(stateFacade.getStateDetailsEditResponse()).toEqual(
        stateFacade['isStateDetailsEdited$']
      );
    });

    it('should access the getIsSerchElements selector action', () => {
      expect(stateFacade.getIsSerchElements()).toEqual(
        stateFacade['isSearchElements$']
      );
    });

    it('should access the getIsActiveToggle selector action', () => {
      expect(stateFacade.getIsActiveToggle()).toEqual(
        stateFacade['isActiveToggle$']
      );
    });

    it('should access the getError selector action', () => {
      expect(stateFacade.getError()).toEqual(stateFacade['stateError$']);
    });
  });
});
