import {
  ConfigurationRanges,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './range.actions';
import { initialState, RangeReducer } from './range.reducer';
import { RangeState } from './range.state';
describe('Range Reducer Testing Suite', () => {
  const ranges: ConfigurationRanges[] = [
    {
      fromRange: '70',
      toRange: '80',
      id: 'abc123',
      rowId: 1,
      isActive: true
    }
  ];
  const error: CustomErrors = {
    code: 'ERR_1',
    message: 'Error',
    traceId: 'TraceID',
    timeStamp: '122131',
    error: null
  };
  describe('Testing LoadRanges', () => {
    it('LoadRanges should return proper state', () => {
      const action = new actions.LoadRanges('GEP_PURITY');

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadRangesSuccess should return proper state', () => {
      const action = new actions.LoadRangesSuccess(ranges);

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ranges).toBe(ranges);
    });

    it('LoadRangesFailure should return error', () => {
      const action = new actions.LoadRangesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing SaveRanges', () => {
    const savePayload = {
      rangeType: 'GEP_PURITY',
      savePayload: { fromRange: '12', toRange: '13', rowId: '1' }
    };
    it('SaveRanges should return proper state', () => {
      const action = new actions.SaveRanges(savePayload);

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });

    it('SaveRangesSuccess should return proper state', () => {
      const action = new actions.SaveRangesSuccess();

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });

    it('SaveRangesFailure should return error', () => {
      const action = new actions.SaveRangesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('ResetRanges should retur proper state', () => {
    it('ResetRanges should return error', () => {
      const action = new actions.ResetRanges();

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.error).toEqual(null);
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
      expect(result.ranges).toEqual(null);
    });
  });

  describe('Testing LoadRangeTypes', () => {
    const response: Lov[] = [
      {
        code: 'GEP_PURITY_GOLD',
        isActive: true,
        value: 'GEP_PURITY_GOLD'
      }
    ];
    it('LoadRangeTypes should return proper state', () => {
      const action = new actions.LoadRangeTypes('RANGE_TYPE');

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadRangeTypesSuccess should return proper state', () => {
      const action = new actions.LoadRangeTypesSuccess(response);

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.rangeTypes).toBe(response);
    });

    it('LoadRangeTypesFailure should return error', () => {
      const action = new actions.LoadRangeTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: RangeState = RangeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
});
