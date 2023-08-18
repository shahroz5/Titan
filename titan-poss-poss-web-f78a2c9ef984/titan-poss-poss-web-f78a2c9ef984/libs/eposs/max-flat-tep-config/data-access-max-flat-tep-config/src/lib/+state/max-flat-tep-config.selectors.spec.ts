import * as selectors from './max-flat-tep-config.selectors';
import { initialState } from './max-flat-tep-config.reducer';
import { MaxFlatTepConfigState } from './max-flat-tep-config.state';
import {
  CreditNote,
  FrozenCNs,
  InitiateGrfResponse,
  MergeCNResponse,
  UpdateGrfTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Max Flat Tep Config Selector Testing Suite', () => {
  it('Testing selectMaxFlatTepConfigDetails selector', () => {
    const state: MaxFlatTepConfigState = {
      ...initialState,
      maxFlatTepConfigDetails: {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      }
    };
    expect(
      selectors.MaxFlatTepConfigSelectors.selectMaxFlatTepConfigDetails.projector(
        state
      )
    ).toEqual({
      type: 'MAX_FLAT_CONFIG',
      data: {
        maxFlatTepExchangeValue: '1200'
      },
      configId: '1234-abcd'
    });
  });
  it('Testing selectUpdateMaxFlatTepConfigResponse selector', () => {
    const state: MaxFlatTepConfigState = {
      ...initialState,
      updateMaxFlatTepConfigResponse: {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      }
    };
    expect(
      selectors.MaxFlatTepConfigSelectors.selectUpdateMaxFlatTepConfigResponse.projector(
        state
      )
    ).toEqual({
      type: 'MAX_FLAT_CONFIG',
      data: {
        maxFlatTepExchangeValue: '1200'
      },
      configId: '1234-abcd'
    });
  });
  it('Testing selectIsLoading selector', () => {
    const state: MaxFlatTepConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.MaxFlatTepConfigSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const state: MaxFlatTepConfigState = {
      ...initialState,
      errors: null
    };
    expect(
      selectors.MaxFlatTepConfigSelectors.selectError.projector(state)
    ).toEqual(null);
  });
});
