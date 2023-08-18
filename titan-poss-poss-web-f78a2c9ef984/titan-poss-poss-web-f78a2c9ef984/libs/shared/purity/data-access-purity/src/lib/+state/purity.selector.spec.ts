// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  CreatePurityPayload,
  Purity
} from '@poss-web/shared/models';

import { initialState } from './purity.reducers';
import * as selectors from './purity.selector';

import { PurityState } from './purity.state';
import { PurityEntity, purityAdaptor } from './purity.entity';

describe('Purity master selector Testing Suite', () => {
  const purityMasterList = [
    {
      purity: '90',
      offset: '1',
      materialCode: 'J',
      karat: '24',
      description: 'purity for j',
      isActive: true
    }
  ];
  const purity: Purity = {
    purity: '90',
    offset: '1',
    materialCode: 'J',
    karat: '24',
    description: 'purity for j',
    isActive: true
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  const addElementToEntities = <T extends Purity>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.materialCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const purityState: PurityEntity = {
    ids: ['J'],
    entities: addElementToEntities(purityMasterList)
  };

  describe('Testing Purity master related Selectors', () => {
    it('Should return the list of purity list', () => {
      expect(
        selectors.PuritySelectors.selectPurityList.projector(purityState)
      ).toEqual(purityMasterList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: PurityState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.PuritySelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: PurityState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.PuritySelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('selectPaymentMaster Should return the Purity master object', () => {
      const state: PurityState = {
        ...initialState,
        purity: purity
      };
      expect(selectors.PuritySelectors.selectPurity.projector(state)).toEqual(
        purity
      );
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: PurityState = {
        ...initialState,
        hasSaved: true
      };
      expect(selectors.PuritySelectors.selectHasSaved.projector(state)).toEqual(
        true
      );
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: PurityState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.PuritySelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: PurityState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.PuritySelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });
  });
});
