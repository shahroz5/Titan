import * as selectors from './metal-rates.selectors';
import { CustomErrors } from '@poss-web/shared/models';
import { initialState } from './metal-rates.reducer';
import { MetalRatesState } from './metal-rates.state';

describe('Metal Rates Update Selector Testing Suite', () => {
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };

    const state: MetalRatesState = {
      ...initialState,
      errors: customErrors
    };
    expect(selectors.metalRatesSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
  });

  it('Testing selectIsLoading selector', () => {
    const state: MetalRatesState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.metalRatesSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });

  it('Testing selectIsGoldRateAvailableForBusinessDay selector', () => {
    const state: MetalRatesState = {
      ...initialState,
      goldRateAvailableForBusinessDay: true
    };
    expect(
      selectors.metalRatesSelectors.selectIsGoldRateAvailableForBusinessDay.projector(
        state
      )
    ).toEqual(true);
  });

  it('Testing selectBodBusinessDate selector', () => {
    const state: MetalRatesState = {
      ...initialState,
      bodBusinessDate: 123456789
    };
    expect(
      selectors.metalRatesSelectors.selectBodBusinessDate.projector(state)
    ).toEqual(123456789);
  });

  it('Testing selectEodBusinessDate selector', () => {
    const state: MetalRatesState = {
      ...initialState,
      eodBusinessDate: 123456789
    };
    expect(
      selectors.metalRatesSelectors.selectEodBusinessDate.projector(state)
    ).toEqual(123456789);
  });

  it('Testing selectIsMetalRatesUpdatedInBoutique selector', () => {
    const state: MetalRatesState = {
      ...initialState,
      metalRatesUpdatedInBoutique: true
    };
    expect(
      selectors.metalRatesSelectors.selectIsMetalRatesUpdatedInBoutique.projector(
        state
      )
    ).toEqual(true);
  });
});
