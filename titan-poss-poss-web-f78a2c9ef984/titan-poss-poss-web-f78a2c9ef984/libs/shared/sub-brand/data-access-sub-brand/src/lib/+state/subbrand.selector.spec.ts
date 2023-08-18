// you will need to assert that the store is calling the right selector function.

import { CustomErrors, BrandMaster } from '@poss-web/shared/models';

import { SubBrandState } from './subbrand.state';
import { initialState } from './subbrand.reducers';
import * as selectors from './subrand.selector';

import { SubBrandEntity, subBrandAdaptor } from './subbrand.entity';
describe('Sub Brand Master selector Testing Suite', () => {
  const createSubBrand = (
    brandCode: string,
    orgCode: string,
    configDetails: any,
    parentBrandCode: string,
    description: string,
    isActive: boolean
  ): BrandMaster => {
    return {
      brandCode,
      orgCode,
      configDetails,
      description,
      parentBrandCode,
      isActive
    };
  };

  const brand1 = createSubBrand(
    'brand1',
    'TJ',
    {},
    'brand1',
    'parentBrand1',
    true
  );

  const brand2 = createSubBrand(
    'brand2',
    'TJ',
    {},
    'parentBrand2',
    'brand2',

    true
  );
  const addElementToEntities = <T extends BrandMaster>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.brandCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const brandArray = [brand1, brand2];

  const subBrandState: SubBrandEntity = {
    ids: [brand1.brandCode, brand2.brandCode],
    entities: addElementToEntities(brandArray)
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing subbrand master related Selectors', () => {
    it('Should return the list of subbrands', () => {
      const subBrandList = subBrandAdaptor.setAll(brandArray, {
        ...subBrandAdaptor.getInitialState()
      });

      const state: SubBrandState = {
        ...initialState,
        subBrandList: subBrandState
      };
      expect(selectors.subBrandList.projector(state)).toEqual(subBrandList);
    });
    it('Should return the list of brand master', () => {
      expect(
        selectors.subBrandMasterSelectors.selectsubBrandList.projector(
          subBrandState
        )
      ).toEqual(brandArray);
    });
    it('Should return the true or false', () => {
      const state: SubBrandState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.subBrandMasterSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the error object', () => {
      const state: SubBrandState = {
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
        selectors.subBrandMasterSelectors.selecthasError.projector(state)
      ).toEqual(error);
    });
    it('Should return the Brand object', () => {
      const state: SubBrandState = {
        ...initialState,
        subBrandDetails: {
          brandCode: 'brand2',
          orgCode: 'TJ',
          configDetails: {},
          parentBrandCode: 'parentBrand2',
          description: 'brand2',
          isActive: true
        }
      };
      expect(
        selectors.subBrandMasterSelectors.selectBrandDetails.projector(state)
      ).toEqual(brand2);
    });

    it('hasSaved Should return the true or false', () => {
      const state: SubBrandState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.subBrandMasterSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('HasUpdated Should return the true or false', () => {
      const state: SubBrandState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.subBrandMasterSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });
    it('selectIsActiveToggle  Should return the true or false', () => {
      const state: SubBrandState = {
        ...initialState,
        isActiveUpdated: true
      };
      expect(
        selectors.subBrandMasterSelectors.selectIsActiveToggle.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: SubBrandState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.subBrandMasterSelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });

    it('selectSubBrandDetails  Should return subbrand', () => {
      const state: SubBrandState = {
        ...initialState,
        subBrandDetails: {
          brandCode: 'brand2',
          orgCode: 'TJ',
          configDetails: {},
          parentBrandCode: 'parentBrand2',
          description: 'brand2',
          isActive: true
        }
      };
      expect(
        selectors.subBrandMasterSelectors.selectSubBrandDetails.projector(state)
      ).toEqual({
        brandCode: 'brand2',
        orgCode: 'TJ',
        configDetails: {},
        parentBrandCode: 'parentBrand2',
        description: 'brand2',
        isActive: true
      });
    });
  });
});
