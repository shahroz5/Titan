import * as selectors from './tep-exception-config.selectors';

import { initialState } from './tep-exception-config.reducer';
import { TepExceptionConfigState } from './tep-exception-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Exception Selector Testing Suite', () => {
  describe('Testing selectLovMasterTypes Related Selectors', () => {
    it('should return selectLovMasterTypes Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        totalElements: 1
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectLovMasterListing Related Selectors', () => {
    it('should return selectLovMasterListing Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        maxFlatTepExchangeValue: 1
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectMaxFlatTepExchangeValue.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectHasUpdated Related Selectors', () => {
    it('should return selectHasUpdated Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectHasSaved Related Selectors', () => {
    it('should return selectHasSaved Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: TepExceptionConfigState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.tepExceptionConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
