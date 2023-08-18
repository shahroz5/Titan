// you will need to assert that the store is calling the right selector function.

import { CustomErrors, ComplexityCode } from '@poss-web/shared/models';

import { initialState } from './complexity-code.reducer';
import * as selectors from './complexity-code.selectors';
import { ComplexityCodeState } from './complexity-code.state';

describe('Complexity code selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Complexity code related Selectors', () => {
    it('Should return the list of Complexity code list', () => {
      const complexityCodeList: ComplexityCode[] = [
        { complexityCode: 'ABC', description: 'ABC', isActive: true }
      ];

      const state: ComplexityCodeState = {
        ...initialState,
        compexityCodeList: complexityCodeList
      };
      expect(
        selectors.complexityCodeSelector.selectcomplexityCodeList.projector(
          state
        )
      ).toEqual(complexityCodeList);
    });

    it('Should return the true or false', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.complexityCodeSelector.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('Should return the error object', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.complexityCodeSelector.selectError.projector(state)
      ).toEqual(error);
    });
    it('Should return the complexity code object', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        complexityCode: {
          complexityCode: 'ABC',
          description: 'ABC',
          isActive: true
        }
      };
      expect(
        selectors.complexityCodeSelector.selectComplexityCode.projector(state)
      ).toEqual({
        complexityCode: 'ABC',
        description: 'ABC',
        isActive: true
      });
    });

    it('hasSaved Should return the true or false', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.complexityCodeSelector.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('HasUpdated Should return the true or false', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.complexityCodeSelector.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: ComplexityCodeState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.complexityCodeSelector.selectTotalElements.projector(state)
      ).toEqual(10);
    });
  });
});
