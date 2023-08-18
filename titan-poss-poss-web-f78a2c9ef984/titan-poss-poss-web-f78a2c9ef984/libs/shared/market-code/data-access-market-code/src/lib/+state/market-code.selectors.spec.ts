import {
  CustomErrors,
  LoadMarketCodeListingSuccessPayload,
  MarketCodeDetails
} from '@poss-web/shared/models';
import { initialState } from './market-code.reducer';
import { MarketCodesSelectors } from './market-code.selectors';
import { MarketCodeState } from './market-code.state';

describe('MarketCode Selector Testing Suite', () => {
  const intialState: MarketCodeState = {
    error: null,
    isLoading: false,
    marketCodeListing: null,
    totalMarketCodes: null,
    marketCodeDetails: null,
    hasSavedMarketDetails: null,
    hasSavedMarketCodeFactors: null,
    hasUpdatedMarketDetails: null,
    hasUpdatedMarketCodeFacators: null,
    hasToggleButton: false
  };
  it('Should return the marketcode listing ', () => {
    const marketCodeListing: MarketCodeDetails[] = [
      {
        marketCode: 'MAR',
        description: 'Market Code is MAR',
        isActive: true
      }
    ];
    const state: MarketCodeState = {
      ...initialState,
      marketCodeListing: marketCodeListing
    };
    expect(
      MarketCodesSelectors.selectMarketCodeListing.projector(state)
    ).toEqual(marketCodeListing);
  });
  it('Should return the total count', () => {
    const state: MarketCodeState = {
      ...initialState,
      totalMarketCodes: 2
    };
    expect(
      MarketCodesSelectors.selectTotalMarketCodes.projector(state)
    ).toEqual(2);
  });
  it('Should return the isloading', () => {
    const state: MarketCodeState = {
      ...initialState,
      isLoading: true
    };
    expect(MarketCodesSelectors.selectIsLoading.projector(state)).toEqual(true);
  });
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: MarketCodeState = {
      ...initialState,
      error: error
    };
    expect(MarketCodesSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the hassaved market code details', () => {
    const state: MarketCodeState = {
      ...initialState,
      hasSavedMarketDetails: true
    };
    expect(
      MarketCodesSelectors.selectHasSavedMarketCodeDetails.projector(state)
    ).toEqual(true);
  });
  it('Should return the hasupdated market code details', () => {
    const state: MarketCodeState = {
      ...initialState,
      hasUpdatedMarketDetails: true
    };
    expect(
      MarketCodesSelectors.selectHasUpdatedMarketCodeDetails.projector(state)
    ).toEqual(true);
  });
  it('Should return the hasupdated  of market material factors', () => {
    const state: MarketCodeState = {
      ...initialState,
      hasUpdatedMarketCodeFacators: true
    };
    expect(
      MarketCodesSelectors.selectHasUpdatedMarketMaterialFacators.projector(
        state
      )
    ).toEqual(true);
  });
  it('Should return the hassaved  of market material factors', () => {
    const state: MarketCodeState = {
      ...initialState,
      hasSavedMarketCodeFactors: true
    };
    expect(
      MarketCodesSelectors.selectHasSavedMarketMaterialFacators.projector(state)
    ).toEqual(true);
  });
  it('Should return the marketCodeDetails', () => {
    const response: MarketCodeDetails = {
      marketCode: 'MAR',
      description: 'MAR',
      isActive: true
    };
    const state: MarketCodeState = {
      ...initialState,
      marketCodeDetails: response
    };
    expect(
      MarketCodesSelectors.selectMarketCodeDetails.projector(state)
    ).toEqual(response);
  });
});
