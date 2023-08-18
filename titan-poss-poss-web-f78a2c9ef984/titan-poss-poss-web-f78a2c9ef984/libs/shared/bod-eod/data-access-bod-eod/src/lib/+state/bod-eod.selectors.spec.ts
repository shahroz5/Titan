import {
  AvailableMetalRates,
  BodEodEnum,
  CustomErrors
} from '@poss-web/shared/models';
import { initialState } from './bod-eod.reducer';
import * as selectors from './bod-eod.selectors';
import { BodEodState } from './bod-eod.state';

describe('Shared BOD-EOD Selector Testing Suite', () => {
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

    const state: BodEodState = {
      ...initialState,
      errors: customErrors
    };
    expect(selectors.bodEodSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
  });

  it('Testing selectIsLoading selector', () => {
    const state: BodEodState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.bodEodSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });

  it('Testing selectCurrentDayBodStatus selector', () => {
    const state: BodEodState = {
      ...initialState,
      currentDayBodStatus: BodEodEnum.PENDING
    };
    expect(
      selectors.bodEodSelectors.selectCurrentDayBodStatus.projector(state)
    ).toEqual(BodEodEnum.PENDING);
  });

  it('Testing selectOpenBusinessDate selector when not loaded from Api', () => {
    const state: BodEodState = {
      ...initialState,
      openBusinessDate: -1
    };
    expect(
      selectors.bodEodSelectors.selectOpenBusinessDate.projector(state)
    ).toEqual(null);
  });

  it('Testing selectOpenBusinessDate selector', () => {
    const state: BodEodState = {
      ...initialState,
      openBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectOpenBusinessDate.projector(state)
    ).toEqual(123456789);
  });

  it('Testing selectOpenBusinessDateForGuard selector', () => {
    const state: BodEodState = {
      ...initialState,
      openBusinessDate: -1
    };
    expect(
      selectors.bodEodSelectors.selectOpenBusinessDateForGuard.projector(state)
    ).toEqual(-1);
  });

  it('Testing selectIsGoldRateAvailable selector', () => {
    const state: BodEodState = {
      ...initialState,
      isGoldRateAvailable: false
    };
    expect(
      selectors.bodEodSelectors.selectIsGoldRateAvailable.projector(state)
    ).toEqual(false);
  });

  it('Testing selectGoldRate selector when no metal rates are available', () => {
    const metalRatesAvailable: AvailableMetalRates = null;
    const state: BodEodState = {
      ...initialState,
      availableMetalRates: null
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      null
    );
  });

  it('Testing selectGoldRate selector when goldRate is available', () => {
    const metalRatesAvailable: AvailableMetalRates = {
      goldRate: 50000,
      platinumRate: null,
      silverRate: null
    };
    const state: BodEodState = {
      ...initialState,
      availableMetalRates: metalRatesAvailable
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      50000
    );
  });

  it('Testing selectGoldRate selector when goldRate is not available', () => {
    const metalRatesAvailable: AvailableMetalRates = {
      goldRate: null,
      platinumRate: null,
      silverRate: null
    };
    const state: BodEodState = {
      ...initialState,
      availableMetalRates: metalRatesAvailable
    };
    expect(selectors.bodEodSelectors.selectGoldRate.projector(state)).toEqual(
      null
    );
  });

  it('Testing selectEodBusinessDate selector when goldRate is not available', () => {
    const state: BodEodState = {
      ...initialState,
      eodBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectEodBusinessDate.projector(state)
    ).toEqual(123456789);
  });

  it('Testing selectLatestBusinessDate selector when goldRate is not available', () => {
    const state: BodEodState = {
      ...initialState,
      latestBusinessDate: 123456789
    };
    expect(
      selectors.bodEodSelectors.selectLatestBusinessDate.projector(state)
    ).toEqual(123456789);
  });

  it('Testing selectBodEodStatus selector when goldRate is not available', () => {
    const state: BodEodState = {
      ...initialState,
      bodEodStatus: null
    };
    expect(
      selectors.bodEodSelectors.selectBodEodStatus.projector(state)
    ).toEqual(null);
  });

  it('Testing selectFiscalYear selector when goldRate is not available', () => {
    const state: BodEodState = {
      ...initialState,
      fiscalYear: 2020
    };
    expect(selectors.bodEodSelectors.selectFiscalYear.projector(state)).toEqual(
      2020
    );
  });
});
