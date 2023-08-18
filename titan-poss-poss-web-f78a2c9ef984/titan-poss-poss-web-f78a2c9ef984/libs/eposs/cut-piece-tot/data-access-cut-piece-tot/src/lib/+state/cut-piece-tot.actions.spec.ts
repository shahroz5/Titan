import { CustomErrors, CutPieceTot } from '@poss-web/shared/models';
import {
  CutPieceTotActionTypes,
  LoadCutPieceTot,
  LoadCutPieceTotFailure,
  LoadCutPieceTotSuccess,
  UpdateCutPieceTot,
  UpdateCutPieceTotFailure,
  UpdateCutPieceTotSuccess
} from './cut-piece-tot.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Cut piece TOT Action Testing Suite', () => {
  describe('LoadCutPieceTot Action Test Cases', () => {
    it('should check correct type is used for LoadCutPieceTot action', () => {
      const action = new LoadCutPieceTot();
      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT
      });
    });

    it('should check correct type is used for LoadCutPieceTotSuccess action', () => {
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

      const action = new LoadCutPieceTotSuccess(payload);
      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCutPieceTotFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCutPieceTotFailure(payload);

      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.LOAD_CUT_PIECE_TOT_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCutPieceTot Action Test Cases', () => {
    
    it('should check correct type is used for UpdateCutPieceTot action', () => {
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
      const action = new UpdateCutPieceTot(payload);
      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT,
        payload
      });
    });

    it('should check correct type is used for UpdateCutPieceTotSuccess action', () => {
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
      const action = new UpdateCutPieceTotSuccess(payload.cutPieceTot);
      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_SUCCESS,
        payload: payload.cutPieceTot
      });
    });
    it('should check correct type is used for SearchStateTaxConfigurationListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCutPieceTotFailure(payload);

      expect({ ...action }).toEqual({
        type: CutPieceTotActionTypes.UPDATE_CUT_PIECE_TOT_FAILURE,
        payload
      });
    });
  });
});
