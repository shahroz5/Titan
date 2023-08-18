import * as actions from './stone.actions';
import { StoneState } from './stone.state';
import {
  StoneDetails,
  LoadStoneListingPayload,
  LoadStoneListingSuccessPayload,
  StoneFilter
} from '@poss-web/shared/models';
import { initialState, StoneReducer } from './stone.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Stone  reducer Testing Suite', () => {
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

  describe('Testing Load stone  details list', () => {
    beforeEach(() => {});
    it('FilterStone should return list of price groups', () => {
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
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.FilterStone(payload);
      const result: StoneState = StoneReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('FilterStoneSuccess should return list of price groups', () => {
      const payload: LoadStoneListingSuccessPayload = {
        stoneListing: [stone1],
        totalElements: 1
      };
      const action = new actions.FilterStoneSuccess(payload);
      const result: StoneState = StoneReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalStoneDetails).toBe([stone1].length);
    });

    it('FilterStoneFailure should return list of price groups', () => {
      const action = new actions.FilterStoneFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneState = StoneReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetFilter ', () => {
    beforeEach(() => {});
    it('ResetFilter should reset the store', () => {
      const action = new actions.ResetFilter();
      const result: StoneState = StoneReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
