import { CutPieceTot } from '@poss-web/shared/models';
import * as actions from './cut-piece-tot.actions';
import { CutPieceTotState } from './cut-piece-tot.state';
import {
  initialState as istate,
  CutPieceTotReducer
} from './cut-piece-tot.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('CUT Piece TOT Reducer Testing Suite', () => {
  const initialState: CutPieceTotState = { ...istate };

  describe('Testing LoadCutPieceTot Functionality', () => {
    it('LoadCutPieceTot should be called', () => {
      const action = new actions.LoadCutPieceTot();

      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCutPieceTotSuccess should return details', () => {
      const payload: CutPieceTot[] = [
        {
          description: 'Desc',
          isActive: true,
          offerDetails: null,
          configDetails: {
            data: {
              l3DeductionPercent: 1
            },
            type: 'TYPE'
          },
          isOfferEnabled: null,
          itemCode: 'Code',
          startDate: null,
          endDate: null,
          customerMobileNos: ['111'],
          karat: 0,
          configId: '1',
          configType: 'Type',
          createdDate: 123123123
        }
      ];

      const action = new actions.LoadCutPieceTotSuccess(payload);
      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);

      expect(result.cutPieceTotDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadCutPieceTotFailure should return error', () => {
      const action = new actions.LoadCutPieceTotFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCutPieceTot Functionality', () => {
    const payload: { configId: string; cutPieceTot: CutPieceTot } = {
      configId: '1',
      cutPieceTot: {
        configDetails: {
          data: {
            l3DeductionPercent: 1
          },
          type: 'TYPE'
        },
        isOfferEnabled: null,
        itemCode: 'Code',
        startDate: null,
        endDate: null,
        customerMobileNos: ['111'],
        karat: 0,
        configId: '1',
        configType: 'Type',
        createdDate: 123123123,
        description: 'desc',
        isActive: true,
        offerDetails: null
      }
    };
    it('UpdateCutPieceTot should be called', () => {
      const action = new actions.UpdateCutPieceTot(payload);

      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('UpdateCutPieceTotSuccess should return details', () => {
      const action = new actions.UpdateCutPieceTotSuccess(payload.cutPieceTot);
      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);

      expect(result.updateCutPieceTot).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('UpdateCutPieceTotFailure should return error', () => {
      const action = new actions.UpdateCutPieceTotFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CutPieceTotState = CutPieceTotReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
});
