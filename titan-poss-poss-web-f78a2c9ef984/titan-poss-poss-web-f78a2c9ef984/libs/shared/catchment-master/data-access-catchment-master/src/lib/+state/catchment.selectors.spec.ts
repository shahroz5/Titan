import * as selectors from './catchment.selectors';

import { initialState } from './catchment.reducer';
import { CatchmentState } from './catchment.state';

describe('Catchment Selector Testing Suite', () => {
  describe('Testing selectCatchmentListing Related Selectors', () => {
    it('should return selectCatchmentListing Selector', () => {
      const state: CatchmentState = {
        ...initialState,
        catchmentListing: []
      };
      expect(
        selectors.CatchmentSelectors.selectCatchmentListing.projector(state)
      ).toEqual([]);
    });
  });

  describe('Testing selectCatchmentDetails Related Selectors', () => {
    it('should return selectCatchmentDetails Selector', () => {
      const payload = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const state: CatchmentState = {
        ...initialState,
        catchmentDetails: payload
      };
      expect(
        selectors.CatchmentSelectors.selectCatchmentDetails.projector(state)
      ).toEqual(payload);
    });
  });

  describe('Testing selectTotalCatchmentDetailsCount Related Selectors', () => {
    it('should return selectTotalCatchmentDetailsCount Selector', () => {
      const payload = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const state: CatchmentState = {
        ...initialState,
        totalCatchmentDetails: 1
      };
      expect(
        selectors.CatchmentSelectors.selectTotalCatchmentDetailsCount.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectSaveCatchmentResponses Related Selectors', () => {
    it('should return selectSaveCatchmentResponses Selector', () => {
      const payload = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const state: CatchmentState = {
        ...initialState,
        saveCatchmentResponses: payload
      };
      expect(
        selectors.CatchmentSelectors.selectSaveCatchmentResponses.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectEditCatchmentResponses Related Selectors', () => {
    it('should return selectEditCatchmentResponses Selector', () => {
      const payload = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const state: CatchmentState = {
        ...initialState,
        editCatchmentResponses: payload
      };
      expect(
        selectors.CatchmentSelectors.selectEditCatchmentResponses.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: CatchmentState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CatchmentSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: CatchmentState = {
        ...initialState,
        error: null
      };
      expect(selectors.CatchmentSelectors.selectError.projector(state)).toEqual(
        null
      );
    });
  });
});
