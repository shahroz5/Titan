import * as selectors from './walk-ins-record.selectors';
import { initialState } from './walk-ins-record.reducer';
import { WalkInsRecordState } from './walk-ins-record.state';
import {
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';

describe('Walk ins Selector Testing Suite', () => {
  it('Testing selectWalkInsCount selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      walkInsCount: 10
    };
    expect(
      selectors.WalkInsRecordSelectors.selectWalkInsCount.projector(state)
    ).toEqual(10);
  });

  it('Testing selectNumberOfInvoicesCount selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      numberOfInvoices: 10
    };
    expect(
      selectors.WalkInsRecordSelectors.selectNumberOfInvoicesCount.projector(
        state
      )
    ).toEqual(10);
  });

  it('Testing selectSaveWalkInDetailsResponse selector', () => {
    const saveWalkInDetailsResponse: WalkInsDetails = {
      businessDate: 123456789,
      walkins: 10,
      noOfInvoice: 10,
      nonPurchaserCount: 2,
      purchaserCount: 8
    };
    const state: WalkInsRecordState = {
      ...initialState,
      saveWalkInDetailsResponse
    };
    expect(
      selectors.WalkInsRecordSelectors.selectSaveWalkInDetailsResponse.projector(
        state
      )
    ).toEqual(saveWalkInDetailsResponse);
  });

  it('Testing selectWalkInsDate selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      walkInsDate: 123456789
    };
    expect(
      selectors.WalkInsRecordSelectors.selectWalkInsDate.projector(state)
    ).toEqual(123456789);
  });
  it('Testing selectWalkInsHistoryData selector', () => {
    const responsePayload: WalkInsDetailsHistoryResponse[] = [
      {
        businessDate: 123456789,
        noOfInvoice: 10,
        nonPurchaserCount: 9,
        purchaserCount: 1,
        walkins: 10
      }
    ];
    const state: WalkInsRecordState = {
      ...initialState,
      walkInsHistoryData: responsePayload
    };
    expect(
      selectors.WalkInsRecordSelectors.selectWalkInsHistoryData.projector(state)
    ).toEqual(responsePayload);
  });
  it('Testing selectPurchasersCount selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      purchasersCount: 1
    };
    expect(
      selectors.WalkInsRecordSelectors.selectPurchasersCount.projector(state)
    ).toEqual(1);
  });

  it('Testing selectIsLoading selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.WalkInsRecordSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const state: WalkInsRecordState = {
      ...initialState,
      errors: null
    };
    expect(
      selectors.WalkInsRecordSelectors.selectError.projector(state)
    ).toEqual(null);
  });
});
