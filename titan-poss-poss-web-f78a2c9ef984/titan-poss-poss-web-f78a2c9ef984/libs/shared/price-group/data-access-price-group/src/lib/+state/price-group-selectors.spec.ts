// you will need to assert that the store is calling the right selector function.

import { PriceGroupMaster, CustomErrors } from '@poss-web/shared/models';

import { PriceGroupEntity, priceGroupAdaptor } from './price-group-entity';
import { PriceGroupState } from './price-group-state';
import { initialState } from './price-group-reducer';
import * as selectors from './price-group-selectors';

describe('Price Group selector Testing Suite', () => {
  const createPriceGroup = (
    priceGroup: string,
    description: string,
    isActive: boolean
  ): PriceGroupMaster => {
    return {
      priceGroup,
      description,
      isActive
    };
  };

  const priceGroup1 = createPriceGroup('priceGroup1', 'priceGroup1', true);

  const priceGroup2 = createPriceGroup('priceGroup2', 'priceGroup2', true);
  const addElementToEntities = <T extends PriceGroupMaster>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.priceGroup]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const priceGroupArray = [priceGroup1, priceGroup2];

  const priceGroupMasterState: PriceGroupEntity = {
    ids: [priceGroup1.priceGroup, priceGroup2.priceGroup],
    entities: addElementToEntities(priceGroupArray)
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing price group master related Selectors', () => {
    it('Should return the list of price group master', () => {
      const priceGroupMasterList = priceGroupAdaptor.setAll(priceGroupArray, {
        ...priceGroupAdaptor.getInitialState()
      });

      const state: PriceGroupState = {
        ...initialState,
        priceGroupList: priceGroupMasterState
      };
      expect(selectors.priceGroupMasterList.projector(state)).toEqual(
        priceGroupMasterList
      );
    });
    it('Should return the list of price group master', () => {
      expect(
        selectors.priceGroupMasterSelector.selectPriceGroupMaster.projector(
          priceGroupMasterState
        )
      ).toEqual(priceGroupArray);
    });
    it('Should return the true or false', () => {
      const state: PriceGroupState = {
        ...initialState,
        isloading: true
      };
      expect(
        selectors.priceGroupMasterSelector.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('Should return the error object', () => {
      const state: PriceGroupState = {
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
        selectors.priceGroupMasterSelector.selectError.projector(state)
      ).toEqual(error);
    });
    it('Should return the price group object', () => {
      const state: PriceGroupState = {
        ...initialState,
        priceGroup: {
          priceGroup: 'priceGroup1',
          description: 'priceGroup1',
          isActive: true
        }
      };
      expect(
        selectors.priceGroupMasterSelector.selectPriceGroup.projector(state)
      ).toEqual(priceGroup1);
    });

    it('hasSaved Should return the true or false', () => {
      const state: PriceGroupState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.priceGroupMasterSelector.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('HasUpdated Should return the true or false', () => {
      const state: PriceGroupState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.priceGroupMasterSelector.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
  });
});
