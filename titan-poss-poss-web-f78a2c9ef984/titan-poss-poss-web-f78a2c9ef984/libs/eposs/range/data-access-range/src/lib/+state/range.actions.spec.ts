import { ConfigurationRanges, CustomErrors } from '@poss-web/shared/models';
import {
  LoadRanges,
  LoadRangesFailure,
  LoadRangesSuccess,
  RangeActionTypes,
  ResetRanges,
  SaveRanges,
  SaveRangesFailure,
  SaveRangesSuccess
} from './range.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Range Testing Suite', () => {
  const ranges: ConfigurationRanges[] = [
    {
      fromRange: '70',
      toRange: '80',
      id: 'abc123',
      rowId: 1,
      isActive: true
    }
  ];

  const savePayload = {
    rangeType: 'GEP_PURITY',
    savePayload: { fromRange: '12', toRange: '13', rowId: '1' }
  };
  describe('Ranges Action TestCases', () => {
    it('should check correct type is used for LoadRanges action ', () => {
      const action = new LoadRanges('GEP_PURITY');
      expect(action.type).toEqual(RangeActionTypes.LOAD_RANGES);
      expect(action.payload).toEqual('GEP_PURITY');
    });
    it('should check correct type is used for LoadRangesSuccess action ', () => {
      const action = new LoadRangesSuccess(ranges);

      expect(action.type).toEqual(RangeActionTypes.LOAD_RANGES_SUCCESS);
      expect(action.payload).toEqual(ranges);
    });

    it('should check correct type is used for LoadRangesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRangesFailure(payload);

      expect(action.type).toEqual(RangeActionTypes.LOAD_RANGES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveRanges Actions TestCases', () => {
    it('should check correct type is used for SaveRanges action ', () => {
      const action = new SaveRanges(savePayload);
      expect(action.type).toEqual(RangeActionTypes.SAVE_RANGES);
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SaveRangesSuccess action ', () => {
      const action = new SaveRangesSuccess();

      expect(action.type).toEqual(RangeActionTypes.SAVE_RANGES_SUCCESS);
    });

    it('should check correct type is used for SaveRangesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveRangesFailure(payload);

      expect(action.type).toEqual(RangeActionTypes.SAVE_RANGES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('Reset Action TestCases', () => {
    it('should check correct type is used for ResetRanges action ', () => {
      const action = new ResetRanges();
      expect(action.type).toEqual(RangeActionTypes.RESET_RANGES);
    });
  });
});
