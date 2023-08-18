// you will need to assert that the store is calling the right selector function.

import { CustomErrors } from '@poss-web/shared/models';
import { initialState } from './cn-direct.reducer';
import * as selectors from './cn-direct.selectors';
import { CnDirectState } from './cn-direct.state';

describe('cnDirectSelector selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing CnDirectState related Selectors', () => {
    it('selectCnList Should return the true or false', () => {
      const state: CnDirectState = {
        ...initialState,
        cnList: []
      };
      expect(selectors.cnDirectSelector.selectCnList.projector(state)).toEqual(
        []
      );
    });
    it('selectTotalElements Should return Total Elements', () => {
      const state: CnDirectState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.cnDirectSelector.selectTotalElements.projector(state)
      ).toEqual(10);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: CnDirectState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cnDirectSelector.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectHasUpdated Should return the true or false', () => {
      const state: CnDirectState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.cnDirectSelector.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectError Should return the error object', () => {
      const state: CnDirectState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.cnDirectSelector.selectError.projector(state)).toEqual(
        error
      );
    });
  });
});
