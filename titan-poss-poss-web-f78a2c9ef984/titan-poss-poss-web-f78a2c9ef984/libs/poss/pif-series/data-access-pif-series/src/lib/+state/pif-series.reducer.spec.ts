import {
  PIFSeriesPayload,
  PIFSeriesResponse,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './pif-series.actions';
import { initialState, PIFSeriesReducer } from './pif-series.reducer';
import { PIFSeriesState } from './pif-series.state';
describe('PIFSeriesReducer Testing Suite', () => {
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
  describe('Testing LoadPIFSeries', () => {
    it('LoadPIFSeries should return proper state', () => {
      const payload: PIFSeriesPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadPIFSeries(payload);

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadPIFSeriesSuccess should return proper state', () => {
      const action = new actions.LoadPIFSeriesSucceess(pifListingResponse);

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.pifSeries).toBe(pifListingResponse.pifSeries);
      expect(result.totalElements).toBe(pifListingResponse.totalElements);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });
    it('LoadPIFSeriesFailure should return proper state', () => {
      const action = new actions.LoadPIFSeriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SavePIFSeries', () => {
    it('SavePIFSeries should return proper state', () => {
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 0,
          toNo: 100,
          id: '123'
        }
      ];
      const action = new actions.SavePIFSeries(savePayload);

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SavePIFSeriesSuccess should return proper state', () => {
      const action = new actions.SavePIFSeriesSuccess();

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });
    it('SavePIFSeriesFailure should return proper state', () => {
      const action = new actions.SavePIFSeriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
    it('ResetPIFSeries should return proper state', () => {
      const action = new actions.ResetPIFSeries();
      const result: PIFSeriesState = PIFSeriesReducer(initialState, action);
      expect(result.error).toEqual(null);
      expect(result.hasSaved).toEqual(false);
      expect(result.totalElements).toEqual(0);
      expect(result.pifSeries).toEqual(null);
      expect(result.isLoading).toEqual(false);
    });
  });
});
