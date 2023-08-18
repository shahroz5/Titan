// you will need to assert that the store is calling the right selector function.

import { CustomErrors } from '@poss-web/shared/models';

import { initialState } from './f2-margin.reducer';
import * as selectors from './f2-margin.selector';

import { F2MarginState } from './f2-margin.state';

describe('f2MarginSelectors selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing F2MarginState related Selectors', () => {
    it('selectf2MarginList Should return the f2 margin list', () => {
      const state: F2MarginState = {
        ...initialState,
        f2MarginList: [
          {
            id: '1',
            stoneBandFrom: 2,
            stoneBandTo: 2,
            f1From: 1,
            f1To: 2,
            margin: 1,
            cfa: '71'
          }
        ]
      };
      expect(
        selectors.f2MarginSelectors.selectf2MarginList.projector(state)
      ).toEqual([
        {
          id: '1',
          stoneBandFrom: 2,
          stoneBandTo: 2,
          f1From: 1,
          f1To: 2,
          margin: 1,
          cfa: '71'
        }
      ]);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: F2MarginState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.f2MarginSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectError Should return the error object', () => {
      const state: F2MarginState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.f2MarginSelectors.selectError.projector(state)).toEqual(
        error
      );
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: F2MarginState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.f2MarginSelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });
  });
});
