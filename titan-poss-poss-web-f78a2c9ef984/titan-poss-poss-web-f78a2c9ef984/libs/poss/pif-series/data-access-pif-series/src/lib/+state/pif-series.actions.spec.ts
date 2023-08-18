import {
  CustomErrors,
  PIFSeriesPayload,
  PIFSeriesResponse,
  SavePIFSeriesPayload
} from '@poss-web/shared/models';
import {
  LoadPIFSeries,
  LoadPIFSeriesFailure,
  LoadPIFSeriesSucceess,
  PIFSeriesActionTypes,
  ResetPIFSeries,
  SavePIFSeries,
  SavePIFSeriesFailure,
  SavePIFSeriesSuccess
} from './pif-series.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('PIFSeries Actions Testing Suite', () => {
  describe('PIFSeriesListing Action Test Cases', () => {
    it('should check correct type is used for  LoadPIFSeries action ', () => {
      const payload: PIFSeriesPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPIFSeries(payload);

      expect(action.type).toEqual(PIFSeriesActionTypes.LOAD_PIF_SERIES);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPIFSeriesSucceess action ', () => {
      const pifSeriesResponse: PIFSeriesResponse = {
        pifSeries: [
          {
            id: '123',
            bankName: 'AXIS',
            paymentCode: 'CASH',
            fromNo: 121,
            toNo: 122,
            currentSeqNo: 123,
            homeBank: 'ICICI',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadPIFSeriesSucceess(pifSeriesResponse);

      expect(action.type).toEqual(PIFSeriesActionTypes.LOAD_PIF_SERIES_SUCCESS);
      expect(action.payload).toEqual(pifSeriesResponse);
    });
    it('should check correct type is used for  LoadPIFSeriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPIFSeriesFailure(payload);

      expect(action.type).toEqual(PIFSeriesActionTypes.LOAD_PIF_SERIES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SavePIFSeries Action Test Cases', () => {
    it('should check correct type is used for  SavePIFSeries action ', () => {
      const savePayload: SavePIFSeriesPayload[] = [
        {
          fromNo: 123,
          id: 'ABC',
          toNo: 124
        }
      ];
      const action = new SavePIFSeries(savePayload);

      expect(action.type).toEqual(PIFSeriesActionTypes.SAVE_PIF_SERIES);
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for  SavePIFSeriesSuccess action ', () => {
      const action = new SavePIFSeriesSuccess();

      expect(action.type).toEqual(PIFSeriesActionTypes.SAVE_PIF_SERIES_SUCCESS);
    });
    it('should check correct type is used for  SavePIFSeriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePIFSeriesFailure(payload);

      expect(action.type).toEqual(PIFSeriesActionTypes.SAVE_PIF_SERIES_FAILURE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ResetPIFSeries action ', () => {
      const action = new ResetPIFSeries();
      expect(action.type).toEqual(PIFSeriesActionTypes.RESET_PIF_SERIES);
    });
  });
});
