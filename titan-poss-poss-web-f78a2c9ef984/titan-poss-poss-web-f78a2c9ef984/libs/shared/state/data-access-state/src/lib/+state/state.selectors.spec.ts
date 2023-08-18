// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  StateData,
  CountriesDetails
} from '@poss-web/shared/models';

import { initialState } from './state.reducer';
import * as selectors from './state.selectors';
import { StateEntity, countryAdapter } from './state.entity';
import { StatesState } from './state.state';

describe('State selector Testing Suite', () => {
  const createState = (
    stateCode: string,

    countryCode: string,
    isUnionTerritory: boolean,
    description: string,
    isActive: boolean,
    configDetails: any
  ): StateData => {
    return {
      stateCode,
      countryCode,
      isUnionTerritory,
      description,
      isActive,
      configDetails
    };
  };

  const state1 = createState('KA', 'IND', false, 'KARANATAKA', false, {});

  const state2 = createState('GOA', 'IND', false, 'GOA', false, {});

  const addElementToEntities = <T extends StateData>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.stateCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const addElementToCountryEntities = <T extends CountriesDetails>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.countryCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const stateArray = [state1, state2];

  const statesState: StateEntity = {
    ids: ['KA', 'GOA'],
    entities: addElementToEntities(stateArray)
  };

  const countryArray = [{ countryCode: 'IND', description: 'INDIA' }];
  const countryState: StateEntity = {
    ids: ['IND'],
    entities: addElementToCountryEntities(countryArray)
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing state Selectors', () => {
    it('selectLoadedStatesListing Should return the list of state list', () => {
      expect(
        selectors.StateSelectors.selectLoadedStatesListing.projector(
          statesState
        )
      ).toEqual(stateArray);
    });

    it('selectCountryDetailsListing Should return the list of country list', () => {
      const countryList = countryAdapter.setAll(countryArray, {
        ...countryAdapter.getInitialState()
      });

      const state: StatesState = {
        ...initialState,
        countryDetailsListing: countryState
      };
      expect(selectors.selectCountryDetailsListing.projector(state)).toEqual(
        countryList
      );
    });
    it('selectLoadedCountryListing Should return the list of country list', () => {
      expect(
        selectors.StateSelectors.selectLoadedCountryListing.projector(
          countryState
        )
      ).toEqual(countryArray);
    });
    it('selectIsStateListingLoading Should return the false or false', () => {
      const state: StatesState = {
        ...initialState,
        isLoading: false
      };
      expect(
        selectors.StateSelectors.selectIsStateListingLoading.projector(state)
      ).toEqual(false);
    });
    it('selectError Should return the error object', () => {
      const state: StatesState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.StateSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('selectStateByStateCode Should return the state object', () => {
      const state: StatesState = {
        ...initialState,
        stateDetailsByStateCode: {
          stateCode: 'KA',
          countryCode: 'IND',
          description: 'KARANATAKA',
          isUnionTerritory: false,
          isActive: false,
          configDetails: {}
        }
      };
      expect(
        selectors.StateSelectors.selectStateByStateCode.projector(state)
      ).toEqual(state1);
    });

    it(' selectSaveStateDetailsResponse Should return the false or false', () => {
      const state: StatesState = {
        ...initialState,
        saveStateDetailsResponse: {
          stateCode: 'KA',
          configDetails: {},
          countryCode: 'IND',
          isActive: false,
          description: 'KARANATAKA',
          isUnionTerritory: false
        }
      };
      expect(
        selectors.StateSelectors.selectSaveStateDetailsResponse.projector(state)
      ).toEqual(state1);
    });
    it('selectTotalStateDetailsCount Should return count ', () => {
      const state: StatesState = {
        ...initialState,
        totalStateDetails: 1
      };
      expect(
        selectors.StateSelectors.selectTotalStateDetailsCount.projector(state)
      ).toEqual(1);
    });

    it('selectEditStateDetailsResponse  Should return the false or false', () => {
      const state: StatesState = {
        ...initialState,
        editStateDetailsResponse: {
          stateCode: 'KA',
          configDetails: {},
          countryCode: 'IND',
          isActive: false,
          description: 'KARANATAKA',
          isUnionTerritory: false
        }
      };
      expect(
        selectors.StateSelectors.selectEditStateDetailsResponse.projector(state)
      ).toEqual(state1);
    });

    it('selectIssearchElements  Should return the state Lov', () => {
      const state: StatesState = {
        ...initialState,
        isSearchElements: false
      };
      expect(
        selectors.StateSelectors.selectIssearchElements.projector(state)
      ).toEqual(false);
    });

    it('selectIsActiveToggle  Should return the state Lov', () => {
      const state: StatesState = {
        ...initialState,
        isActiveUpdated: false
      };
      expect(
        selectors.StateSelectors.selectIsActiveToggle.projector(state)
      ).toEqual(false);
    });
  });
});
