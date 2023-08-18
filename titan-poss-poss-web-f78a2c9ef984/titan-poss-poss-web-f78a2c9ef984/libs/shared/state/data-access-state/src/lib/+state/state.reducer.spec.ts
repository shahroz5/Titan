//you should simply assert that you get the right state given the provided inputs.

import * as actions from './state.actions';

import {
  LoadStateListingPayload,
  LoadStatesDetailsListingSuccessPayload,
  SaveStateDetailsPayload,
  StateData,
  LoadCountryDetailsListingSuccessPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { stateReducer, initialState } from './state.reducer';
import { StatesState } from './state.state';

describe('state master reducer Testing Suite', () => {
  describe('Testing LoadStateDetails ', () => {
    beforeEach(() => {});
    it('Load LoadStateDetails should set the isLoading to true', () => {
      const payload: LoadStateListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadStateDetails(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadStateDetailsSuccess should return list of states', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: true,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadStateDetailsSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.stateDetailsListing.ids.length).toBe(1);
    });
    it('LoadStateDetailsFailure should return error', () => {
      const action = new actions.LoadStateDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveStateFormDetails Functionality ', () => {
    beforeEach(() => {});
    it('SaveStateFormDetails ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new actions.SaveStateFormDetails(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveStateFormDetailsSuccess should return the state created', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new actions.SaveStateFormDetailsSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.saveStateDetailsResponse).toEqual(payload);
    });
    it('SaveStateFormDetailsFailure should return error', () => {
      const action = new actions.SaveStateFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditStateDetails ', () => {
    beforeEach(() => {});
    it('EditStateDetails ', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new actions.EditStateDetails(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('EditStateDetailsSuccess should update the hasUpdated property to true', () => {
      const payload: SaveStateDetailsPayload = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };
      const action = new actions.EditStateDetailsSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.editStateDetailsResponse).toBe(payload);
      expect(result.isLoading).toBe(false);
    });
    it('EditStateDetailsFailure should return error', () => {
      const action = new actions.EditStateDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadStateByCode ', () => {
    beforeEach(() => {});
    it('LoadStateByCode should return the metal type ', () => {
      const payload = 'KA';
      const action = new actions.LoadStateByCode(payload);

      const result: StatesState = stateReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadStateByCodeSuccess should return the brand', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };

      const action = new actions.LoadStateByCodeSuccess(payload);

      const result: StatesState = stateReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.stateDetailsByStateCode).toEqual(payload);
    });
    it('LoadStateByCodeFailure should return error', () => {
      const action = new actions.LoadStateByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCountryDetails Functionality ', () => {
    beforeEach(() => {});
    it('LoadCountryDetails should return list of country', () => {
      const action = new actions.LoadCountryDetails();

      const result: StatesState = stateReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
    });
    it('LoadCountryDetailsSuccess should return list of country', () => {
      const payload: LoadCountryDetailsListingSuccessPayload = {
        countryDetailsListing: [{ countryCode: 'IND', description: 'INDIA' }],
        totalElements: 1
      };

      const action = new actions.LoadCountryDetailsSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.countryDetailsListing.ids.length).toEqual(1);
    });
    it('LoadCountryDetailsFailure should return error', () => {
      const action = new actions.LoadCountryDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchState Functionality ', () => {
    beforeEach(() => {});
    it('SearchState should return searched state', () => {
      const payload = 'J';
      const action = new actions.SearchState(payload);

      const result: StatesState = stateReducer(initialState, action);
    });
    it('SearchStateSuccess should return searched state', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            stateCode: 'KA',
            isActive: true,
            isUnionTerritory: false,
            description: 'KARNATAKA',
            countryCode: 'IND',
            configDetails: {}
          }
        ],
        totalElements: 1
      };

      const action = new actions.SearchStateSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.totalStateDetails).toBe(1);
      expect(result.stateDetailsListing.ids.length).toBe(1);
    });
    it('SearchStateFailure should return error', () => {
      const action = new actions.SearchStateFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateIsActive Functionality ', () => {
    beforeEach(() => {});
    it('UpdateIsActive should update the state', () => {
      const payload = 'J';
      const action = new actions.UpdateIsActive(payload);

      const result: StatesState = stateReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isActiveUpdated).toEqual(false);
    });
    it('UpdateIsActiveSuccess  should update the state', () => {
      const payload: StateData = {
        configDetails: {},
        stateCode: 'KA',
        description: 'KARANATAKA',
        isUnionTerritory: false,
        isActive: true,
        countryCode: 'IND'
      };

      const action = new actions.UpdateIsActiveSuccess(payload);

      const result: StatesState = stateReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.isActiveUpdated).toEqual(true);
    });
    it('UpdateIsActiveFailure should return error', () => {
      const action = new actions.UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StatesState = stateReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetStateDialog ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.ResetStateDialog();

      const result: StatesState = stateReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
