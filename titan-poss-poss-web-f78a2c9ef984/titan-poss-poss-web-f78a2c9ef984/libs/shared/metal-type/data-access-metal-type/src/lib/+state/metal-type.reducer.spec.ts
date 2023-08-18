//you should simply assert that you get the right state given the provided inputs.

import * as actions from './metal-type.actions';

import {
  MetalTypePayload,
  MetalTypeListing,
  CreateMetalTypePayload,
  UpdateMetalTypePayload,
  MaterialType,
  MaterialTypelov
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { metalTypeReducer, initialState } from './metal-type.reducer';
import { MetalTypeState } from './metal-type.state';

describe('Metal type reducer Testing Suite', () => {
  describe('Testing LoadMetalTypeList ', () => {
    beforeEach(() => {});
    it('Load LoadMetalTypeList should set the isLoading to true', () => {
      const payload: MetalTypePayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadMetalTypeList(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadMetalTypeListSuccess should return list of metal types', () => {
      const metalTypes = [
        { materialCode: 'J', materialType: 'METAL', description: 'GOLD' }
      ];
      const metalTypeList: MetalTypeListing = {
        results: metalTypes,
        totalElements: 1
      };
      const action = new actions.LoadMetalTypeListSuccess(metalTypeList);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.metalTypeList.ids.length).toBe(1);
    });
    it('LoadMetalTypeListFailure should return error', () => {
      const action = new actions.LoadMetalTypeListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing CreateMetalType Functionality ', () => {
    beforeEach(() => {});
    it('CreateMetalType ', () => {
      const payload: CreateMetalTypePayload = {
        materialTypeCode: 'J',

        description: 'Gold',
        isActive: true,
        orgCode: 'TJ'
      };
      const action = new actions.CreateMetalType(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.hasSaved).toBe(false);
    });
    it('CreateMetalTypeSuccess should update the hasSaved property to true', () => {
      const action = new actions.CreateMetalTypeSuccess();

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.hasSaved).toBe(true);
    });
    it('CreateMetalTypeFailure should return error', () => {
      const action = new actions.CreateMetalTypeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateMetalTypeDeatil ', () => {
    beforeEach(() => {});
    it('UpdateMetalTypeDeatil ', () => {
      const payload: UpdateMetalTypePayload = {
        materialTypeCode: 'J',
        data: {
          isActive: true
        }
      };
      const action = new actions.UpdateMetalTypeDeatil(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateMetalTypeDeatilSuccess should update the hasUpdated property to true', () => {
      const payload: MaterialType = {
        materialCode: 'J'
      };
      const action = new actions.UpdateMetalTypeDeatilSuccess(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateMetalTypeDeatilFailure should return error', () => {
      const action = new actions.UpdateMetalTypeDeatilFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMetalTypeDetailByMaterialCode ', () => {
    beforeEach(() => {});
    it('LoadMetalTypeDetailByMaterialCode should return the metal type ', () => {
      const payload = 'J';
      const action = new actions.LoadMetalTypeDetailByMaterialCode(payload);

      const result: MetalTypeState = metalTypeReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMetalTypeDetailByMaterialCodeSuccess should return the brand', () => {
      const payload: MaterialType = {
        materialCode: 'J',
        description: 'Gold'
      };

      const action = new actions.LoadMetalTypeDetailByMaterialCodeSuccess(
        payload
      );

      const result: MetalTypeState = metalTypeReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.metalType).toEqual(payload);
    });
    it('LoadMetalTypeDetailByMaterialCodeFailure should return error', () => {
      const action = new actions.LoadMetalTypeDetailByMaterialCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMaterialTypeLov Functionality ', () => {
    beforeEach(() => {});
    it('LoadMaterialTypeLov should return material type lovs', () => {
      const action = new actions.LoadMaterialTypeLov();

      const result: MetalTypeState = metalTypeReducer(initialState, action);
    });
    it('LoadMaterialTypeLovSuccess should return material type lovs', () => {
      const payload: MaterialTypelov[] = [
        {
          code: 'Metal',
          value: 'Metal'
        }
      ];

      const action = new actions.LoadMaterialTypeLovSuccess(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.materialTypeLov).toBe(payload);
    });
    it('LoadMaterialTypeLovFailure should return error', () => {
      const action = new actions.LoadMaterialTypeLovFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchMetalTypeByMaterialCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchMetalTypeByMaterialCode should return searched material type', () => {
      const payload = 'J';
      const action = new actions.SearchMetalTypeByMaterialCode(payload);

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchMetalTypeByMaterialCodeSuccess should return searched brand', () => {
      const metalTypeArray = [
        {
          materialCode: 'J',
          description: 'Gold'
        }
      ];
      const metalTypeList: MetalTypeListing = {
        results: metalTypeArray,
        totalElements: 1
      };
      const action = new actions.SearchMetalTypeByMaterialCodeSuccess(
        metalTypeList
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.totalElements).toBe(1);
      expect(result.metalTypeList.ids.length).toBe(1);
    });
    it('SearchMetalTypeByMaterialCodeFailure should return error', () => {
      const action = new actions.SearchMetalTypeByMaterialCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MetalTypeState = metalTypeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: MetalTypeState = metalTypeReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
