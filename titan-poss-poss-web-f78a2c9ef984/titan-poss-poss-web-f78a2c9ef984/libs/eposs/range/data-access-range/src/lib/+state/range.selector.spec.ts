import { ConfigurationRanges, CustomErrors } from '@poss-web/shared/models';
import { initialState } from './range.reducer';
import { RangeSelectors } from './range.selector';
import { RangeState } from './range.state';

describe('Range Selector Testing Suite', () => {
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
  it('Should return the ranges ', () => {
    const state: RangeState = {
      ...initialState,
      ranges: ranges
    };
    expect(RangeSelectors.selectRanges.projector(state)).toEqual(ranges);
  });

  it('Should return the isloading ', () => {
    const state: RangeState = {
      ...initialState,
      isLoading: true
    };
    expect(RangeSelectors.selectIsLoading.projector(state)).toEqual(true);
  });

  it('Should return the hassaved ', () => {
    const state: RangeState = {
      ...initialState,
      hasSaved: true
    };
    expect(RangeSelectors.selectHasSaved.projector(state)).toEqual(true);
  });

  it('Should return the error ', () => {
    const state: RangeState = {
      ...initialState,
      error: error
    };
    expect(RangeSelectors.selectError.projector(state)).toEqual(error);
  });
});
