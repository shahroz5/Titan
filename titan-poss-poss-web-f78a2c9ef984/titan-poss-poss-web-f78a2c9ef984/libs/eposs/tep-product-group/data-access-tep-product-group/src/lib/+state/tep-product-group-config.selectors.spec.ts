import * as selectors from './tep-product-group-config.selectors';

import { initialState } from './tep-product-group-config.reducer';
import { TepProductGroupConfigState } from './tep-product-group-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('TEP Stone Selector Testing Suite', () => {
  // describe('Testing selectTepStoneConfigList Related Selectors', () => {
  //   it('should return selectTepStoneConfigList Selector', () => {
  //     const state: TepStoneConfigState = {
  //       ...initialState,
  //       tepStoneConfiglist:
  //     };
  //     expect(
  //       selectors.tepStoneConfigSelectors.selectTepStoneConfigList.projector(
  //         state
  //       )
  //     ).toBeDefined();
  //   });
  // });
  describe('Testing selectTotalElements Related Selectors', () => {
    it('should return selectTotalElements Selector', () => {
      const state: TepProductGroupConfigState = {
        ...initialState,
        totalElements: 1
      };
      expect(
        selectors.tepProductGroupConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TepProductGroupConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.tepProductGroupConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectHasUpdated Related Selectors', () => {
    it('should return selectHasUpdated Selector', () => {
      const state: TepProductGroupConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.tepProductGroupConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectHasSaved Related Selectors', () => {
    it('should return selectHasSaved Selector', () => {
      const state: TepProductGroupConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.tepProductGroupConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: TepProductGroupConfigState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.tepProductGroupConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
