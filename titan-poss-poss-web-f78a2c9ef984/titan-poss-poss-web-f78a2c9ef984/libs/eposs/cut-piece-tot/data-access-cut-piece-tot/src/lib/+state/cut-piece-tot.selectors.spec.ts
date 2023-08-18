import * as selectors from './cut-piece-tot.selectors';

import { initialState } from './cut-piece-tot.reducer';
import { CutPieceTotState } from './cut-piece-tot.state';

describe('Cut Piece TOT Selector Testing Suite', () => {
  describe('Testing selectCutPieceTotDetails Related Selectors', () => {
    it('should return selectCutPieceTotDetails Selector', () => {
      const state: CutPieceTotState = {
        ...initialState,
        cutPieceTotDetails: []
      };
      expect(
        selectors.CutPieceTotSelectors.selectCutPieceTotDetails.projector(state)
      ).toEqual([]);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: CutPieceTotState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CutPieceTotSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const error = {
        code: 'C',
        error: {
          message: 'mess',
          name: 'name'
        },
        message: 'mes',
        timeStamp: '123',
        traceId: '123'
      };
      const state: CutPieceTotState = {
        ...initialState,
        error
      };
      expect(
        selectors.CutPieceTotSelectors.selectError.projector(state)
      ).toEqual(error);
    });
  });

  describe('Testing selectTotalElements Related Selectors', () => {
    it('should return selectTotalElements Selector', () => {
      const updateCutPieceTot = {
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
      };
      const state: CutPieceTotState = {
        ...initialState,
        updateCutPieceTot
      };
      expect(
        selectors.CutPieceTotSelectors.selectUpdateCutPieceTotResponses.projector(
          state
        )
      ).toEqual(updateCutPieceTot);
    });
  });
});
