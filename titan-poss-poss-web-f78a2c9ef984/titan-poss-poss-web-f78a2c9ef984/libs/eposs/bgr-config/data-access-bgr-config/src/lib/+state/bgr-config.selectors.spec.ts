import * as selectors from './bgr-config.selectors';
import { initialState } from './bgr-config.reducer';
import { BgrConfigState } from './bgr-config.state';
import {
  BgrConfigListingResult,
  CreditNote,
  FrozenCNs,
  InitiateGrfResponse,
  MergeCNResponse,
  UpdateGrfTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Bgr Config Selector Testing Suite', () => {
  it('Testing selectBgrConfigListing selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      bgrConfigListing: [
        {
          ruleId: 1234,
          ruleType: 'BGR_CONFIG'
        }
      ]
    };
    expect(
      selectors.BgrConfigSelectors.selectBgrConfigListing.projector(state)
    ).toEqual([
      {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    ]);
  });
  it('Testing selectBgrConfigDetails selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      bgrConfigDetails: {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    };
    expect(
      selectors.BgrConfigSelectors.selectBgrConfigDetails.projector(state)
    ).toEqual({
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    });
  });
  it('Testing selectBgrConfigDetailsSaved selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      bgrConfigDetailsSaved: {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    };
    expect(
      selectors.BgrConfigSelectors.selectBgrConfigDetailsSaved.projector(state)
    ).toEqual({
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    });
  });
  it('Testing selectBgrConfigDetailsEdited selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      bgrConfigDetailsEdited: {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      }
    };
    expect(
      selectors.BgrConfigSelectors.selectBgrConfigDetailsEdited.projector(state)
    ).toEqual({
      ruleId: 1234,
      ruleType: 'BGR_CONFIG'
    });
  });
  it('Testing selectBgrConfigTotal selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      bgrTotalConfig: 10
    };
    expect(
      selectors.BgrConfigSelectors.selectBgrConfigTotal.projector(state)
    ).toEqual(10);
  });
  it('Testing selectIsLoading selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.BgrConfigSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const state: BgrConfigState = {
      ...initialState,
      error: null
    };
    expect(selectors.BgrConfigSelectors.selectError.projector(state)).toEqual(
      null
    );
  });
});
