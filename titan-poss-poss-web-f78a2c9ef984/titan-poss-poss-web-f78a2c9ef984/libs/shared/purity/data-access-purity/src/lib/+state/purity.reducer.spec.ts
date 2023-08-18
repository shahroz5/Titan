//you should simply assert that you get the right state given the provided inputs.

import * as actions from './purity.actions';

import {
  CreatePurityPayload,
  UpdatePurityPayload,
  PurityListPayload,
  PurityListResult,
  MaterialType
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { purityReducers, initialState } from './purity.reducers';
import { PurityState } from './purity.state';

describe('purity reducer Testing Suite', () => {
  describe('Testing LoadPurityList ', () => {
    beforeEach(() => {});
    it('Load LoadPurityList should set the isLoading to true', () => {
      const payload: PurityListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new actions.LoadPurityList(payload);

      const result: PurityState = purityReducers(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadPurityListSuccess should return list of purity ', () => {
      const payload: PurityListResult = {
        purityList: [
          {
            purity: '90',
            offset: '1',
            materialCode: 'J',
            karat: '24',
            description: 'purity for j',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadPurityListSuccess(payload);

      const result: PurityState = purityReducers(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.purityList.ids.length).toBe(1);
    });
    it('LoadPurityListFailure should return error', () => {
      const action = new actions.LoadPurityListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PurityState = purityReducers(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing CreatePurity Functionality ', () => {
    beforeEach(() => {});
    it('CreatePurity ', () => {
      const payload: CreatePurityPayload = {
        purity: '90',
        offset: '1',
        itemTypeCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };
      const action = new actions.CreatePurity(payload);

      const result: PurityState = purityReducers(initialState, action);

      expect(result.hasSaved).toBe(false);
    });
    it('CreatePuritySuccess should update the hasSaved property to true', () => {
      const action = new actions.CreatePuritySuccess();

      const result: PurityState = purityReducers(initialState, action);

      expect(result.hasSaved).toBe(true);
    });
    it('CreatePurityFailure should return error', () => {
      const action = new actions.CreatePurityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PurityState = purityReducers(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdatePurity ', () => {
    beforeEach(() => {});
    it('UpdatePurity ', () => {
      const payload: UpdatePurityPayload = {
        id: 1,
        data: {
          isActive: false
        }
      };
      const action = new actions.UpdatePurity(payload);

      const result: PurityState = purityReducers(initialState, action);

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdatePuritySuccess should update the hasUpdated property to true', () => {
      const action = new actions.UpdatePuritySuccess();

      const result: PurityState = purityReducers(initialState, action);

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdatePurityFailure should return error', () => {
      const action = new actions.UpdatePurityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PurityState = purityReducers(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPurityByMaterialCodeAndPurity ', () => {
    beforeEach(() => {});
    it('LoadPurityByMaterialCodeAndPurity should return the purity mode ', () => {
      const payload = 'J';
      const action = new actions.LoadPurityByMaterialCodeAndPurity(payload);

      const result: PurityState = purityReducers(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPurityByMaterialCodeAndPuritySuccess should return the purity mode', () => {
      const payload = {
        purity: '90',
        offset: '1',
        materialCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };

      const action = new actions.LoadPurityByMaterialCodeAndPuritySuccess(
        payload
      );

      const result: PurityState = purityReducers(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.purity).toEqual(payload);
    });
    it('LoadPurityByMaterialCodeAndPurityFailure should return error', () => {
      const action = new actions.LoadPurityByMaterialCodeAndPurityFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PurityState = purityReducers(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMetalTypes Functionality ', () => {
    beforeEach(() => {});
    it('LoadMetalTypes should return searched purity mode', () => {
      const action = new actions.LoadMetalTypes();

      const result: PurityState = purityReducers(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadMetalTypesSuccess should return searched purity mode', () => {
      const payload: MaterialType[] = [
        {
          materialCode: 'J',
          description: 'Gold'
        }
      ];

      const action = new actions.LoadMetalTypesSuccess(payload);

      const result: PurityState = purityReducers(initialState, action);

      expect(result.metalType.length).toBe(1);
    });
    it('LoadMetalTypesFailure should return error', () => {
      const action = new actions.LoadMetalTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: PurityState = purityReducers(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: PurityState = purityReducers(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
