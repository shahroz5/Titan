// you will need to assert that the store is calling the right selector function.

import { StoneTypeDetails, CustomErrors } from '@poss-web/shared/models';
import { StoneTypeState } from './stone-type.state';
import { initialState } from './stone-type.reducer';
import * as selectors from './stone-type.selectors';

describe('Stone Type selector Testing Suite', () => {
  const createStoneType = (
    stoneTypeCode: string,
    description: string,
    configDetails: {
      karatageWeightPrint: string;
    },
    isActive: boolean
  ): StoneTypeDetails => {
    return {
      stoneTypeCode,
      description,
      configDetails,
      isActive
    };
  };

  const stoneType1 = createStoneType(
    'stoneType1',
    'stoneType1',
    { karatageWeightPrint: 'aaa' },
    true
  );

  const stoneType2 = createStoneType(
    'stoneType2',
    'stoneType2',
    { karatageWeightPrint: 'aaa' },
    true
  );

  const stoneTypeArray = [stoneType1, stoneType2];

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing stone type master related Selectors', () => {
    it('Should return the list of stone type list', () => {
      const state: StoneTypeState = {
        ...initialState,
        stoneTypeListing: stoneTypeArray
      };
      expect(
        selectors.StoneTypeSelectors.selectStoneTypeDetailsListing.projector(
          state
        )
      ).toEqual(stoneTypeArray);
    });
    it('Should return the true or false', () => {
      const state: StoneTypeState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.StoneTypeSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: StoneTypeState = {
        ...initialState,
        totalStoneTypeDetails: 0
      };
      expect(
        selectors.StoneTypeSelectors.selectTotalStoneTypeDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: StoneTypeState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.StoneTypeSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the stone type object', () => {
      const state: StoneTypeState = {
        ...initialState,
        stoneTypeDetails: stoneType1
      };
      expect(
        selectors.StoneTypeSelectors.selectStoneTypeDetailsByStoneTypeCode.projector(
          state
        )
      ).toEqual(stoneType1);
    });

    it('hasSaved Should save the stone type', () => {
      const state: StoneTypeState = {
        ...initialState,
        saveStoneTypeResponses: stoneType1
      };
      expect(
        selectors.StoneTypeSelectors.selectSavestoneTypeFormResponse.projector(
          state
        )
      ).toEqual(stoneType1);
    });
    it('HasUpdated Should edit the stone type', () => {
      const state: StoneTypeState = {
        ...initialState,
        editStoneTypeResponses: stoneType1
      };
      expect(
        selectors.StoneTypeSelectors.selectEditstoneTypeFormResponse.projector(
          state
        )
      ).toEqual(stoneType1);
    });
  });
});
