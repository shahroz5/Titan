// you will need to assert that the store is calling the right selector function.

import { CustomErrors, MaterialType } from '@poss-web/shared/models';

import { initialState } from './metal-type.reducer';
import * as selectors from './metal-type.selectors';
import { MetaltypeEntity, metalTypeAdaptor } from './metal-type.entity';
import { MetalTypeState } from './metal-type.state';

describe('Metal type selector Testing Suite', () => {
  const createMetalType = (
    materialCode: string,

    description: string,
    isActive: boolean
  ): MaterialType => {
    return {
      materialCode,

      description,
      isActive
    };
  };

  const materialType1 = createMetalType(
    'materialType1',
    'METAL',

    true
  );

  const materialType2 = createMetalType(
    'materialType2',
    'METAL',

    true
  );
  const addElementToEntities = <T extends MaterialType>(
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

  const materialTypeArray = [materialType1, materialType2];

  const materialTypeState: MetaltypeEntity = {
    ids: [materialType1.materialCode, materialType2.materialCode],
    entities: addElementToEntities(materialTypeArray)
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing material type related Selectors', () => {
    it('Should return the list of material type list', () => {
      const materialTypeList = metalTypeAdaptor.setAll(materialTypeArray, {
        ...metalTypeAdaptor.getInitialState()
      });

      const state: MetalTypeState = {
        ...initialState,
        metalTypeList: materialTypeState
      };
      expect(selectors.metalTypeList.projector(state)).toEqual(
        materialTypeList
      );
    });
    it('Should return the list of material type list', () => {
      expect(
        selectors.MetalTypeSelctors.selectMetalTypeList.projector(
          materialTypeState
        )
      ).toEqual(materialTypeArray);
    });
    it('Should return the true or false', () => {
      const state: MetalTypeState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.MetalTypeSelctors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('Should return the error object', () => {
      const state: MetalTypeState = {
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
        selectors.MetalTypeSelctors.selectHasError.projector(state)
      ).toEqual(error);
    });
    it('Should return the Material type object', () => {
      const state: MetalTypeState = {
        ...initialState,
        metalType: {
          materialCode: 'materialType1',
          description: 'METAL',
          isActive: true
        }
      };
      expect(
        selectors.MetalTypeSelctors.selectMetalType.projector(state)
      ).toEqual(materialType1);
    });

    it('hasSaved Should return the true or false', () => {
      const state: MetalTypeState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.MetalTypeSelctors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('HasUpdated Should return the true or false', () => {
      const state: MetalTypeState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.MetalTypeSelctors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: MetalTypeState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.MetalTypeSelctors.selectTotalElements.projector(state)
      ).toEqual(10);
    });

    it('selectMaterialTypeLov  Should return the material type Lov', () => {
      const state: MetalTypeState = {
        ...initialState,
        materialTypeLov: [{ code: 'METAL', value: 'METAL' }]
      };
      expect(
        selectors.MetalTypeSelctors.selectMaterialTypeLov.projector(state)
      ).toEqual([{ code: 'METAL', value: 'METAL' }]);
    });
  });
});
