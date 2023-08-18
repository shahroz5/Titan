import { CustomErrors, PIFSeriesResponse } from '@poss-web/shared/models';
import { initialState } from './pif-series.reducer';
import { PIFSeriesSelectors } from './pif-series.selectors';
import { PIFSeriesState } from './pif-series.state';

describe('PIFSeries Selector Testing Suite', () => {
  const pifListingResponse: PIFSeriesResponse = {
    pifSeries: [
      {
        id: 'ABC',
        bankName: 'AXIS BANK',
        paymentCode: 'CASH',
        fromNo: 123,
        toNo: 124,
        currentSeqNo: 123,
        homeBank: 'AXIS BANK',
        isActive: true
      }
    ],
    totalElements: 0
  };
  it('Should return the pifSeriesListing ', () => {
    const state: PIFSeriesState = {
      ...initialState,
      pifSeries: pifListingResponse.pifSeries
    };
    expect(PIFSeriesSelectors.selectPIFSeries.projector(state)).toEqual(
      pifListingResponse.pifSeries
    );
  });
  it('Should return the totalElements ', () => {
    const state: PIFSeriesState = {
      ...initialState,
      totalElements: pifListingResponse.totalElements
    };
    expect(PIFSeriesSelectors.selectTotalElements.projector(state)).toEqual(
      pifListingResponse.totalElements
    );
  });
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: PIFSeriesState = {
      ...initialState,
      error: error
    };
    expect(PIFSeriesSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the hasSaved ', () => {
    const state: PIFSeriesState = {
      ...initialState,
      hasSaved: true
    };
    expect(PIFSeriesSelectors.selectHasSaved.projector(state)).toEqual(true);
  });
  it('Should return the isLoading ', () => {
    const state: PIFSeriesState = {
      ...initialState,
      isLoading: true
    };
    expect(PIFSeriesSelectors.selectIsLoading.projector(state)).toEqual(true);
  });
});
