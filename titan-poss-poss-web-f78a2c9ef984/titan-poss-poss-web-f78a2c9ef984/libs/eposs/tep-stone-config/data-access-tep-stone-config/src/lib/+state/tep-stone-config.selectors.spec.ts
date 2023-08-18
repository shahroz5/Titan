import * as selectors from './tep-stone-config.selectors';

import { initialState } from './tep-stone-config.reducer';
import { TepStoneConfigState } from './tep-stone-config.state';
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
      const state: TepStoneConfigState = {
        ...initialState,
        totalElements: 1
      };
      expect(
        selectors.tepStoneConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TepStoneConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.tepStoneConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });

  describe('Testing selectHasUpdated Related Selectors', () => {
    it('should return selectHasUpdated Selector', () => {
      const state: TepStoneConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.tepStoneConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectHasSaved Related Selectors', () => {
    it('should return selectHasSaved Selector', () => {
      const state: TepStoneConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.tepStoneConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
  });
  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: TepStoneConfigState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.tepStoneConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
