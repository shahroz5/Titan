import {
  StoneDetails,
  CustomErrors,
  StoneFilter
} from '@poss-web/shared/models';
import { StoneState } from './stone.state';
import { initialState } from './stone.reducer';
import * as selectors from './stone.selectors';

describe('Stone  selector Testing Suite', () => {
  const createStone = (
    stoneCode: 'ABC',
    stoneTypeCode: 'ABC',
    stdWeight: 'ABC',
    color: 'ABC',
    stdValue: 'ABC',
    quality: 'ABC',
    configDetails: { StoneTEPDiscount: 0 },
    ratePerCarat: 0,
    isActive: true
  ): StoneDetails => {
    return {
      stoneCode,
      stoneTypeCode,
      stdWeight,
      color,
      stdValue,
      quality,
      configDetails,
      ratePerCarat,
      isActive
    };
  };

  const stone1 = createStone(
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    { StoneTEPDiscount: 0 },
    0,
    true
  );

  const stone2 = createStone(
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    'ABC',
    { StoneTEPDiscount: 0 },
    0,
    true
  );

  const stoneArray = [stone1, stone2];

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing stone  master related Selectors', () => {
    it('Should return the list of stone  list', () => {
      const state: StoneState = {
        ...initialState,
        stoneListing: stoneArray
      };
      expect(
        selectors.StoneSelectors.selectStoneDetailsListing.projector(state)
      ).toEqual(stoneArray);
    });
    it('Should return the true or false', () => {
      const state: StoneState = {
        ...initialState,
        isLoading: true
      };
      expect(selectors.StoneSelectors.selectIsLoading.projector(state)).toEqual(
        true
      );
    });
    it('Should return the count', () => {
      const state: StoneState = {
        ...initialState,
        totalStoneDetails: 0
      };
      expect(
        selectors.StoneSelectors.selectTotalStoneDetailsCount.projector(state)
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: StoneState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.StoneSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
  });
  it('Should return the filter parameters', () => {
    const payload: StoneFilter = {
      payloadData: {
        color: 'AAA',
        fromStdValue: 10,
        quality: 'AAA',
        ratePerCarat: 10,
        stoneCode: 'AAA',
        stoneTypeCode: 'AAA',
        toStdValue: 10
      },
      pageIndex: 1,
      pageSize: 10
    };
    const state: StoneState = {
      ...initialState,
      stonefilter: payload
    };
    expect(selectors.StoneSelectors.selectStoneFilter.projector(state)).toEqual(
      payload
    );
  });
});
