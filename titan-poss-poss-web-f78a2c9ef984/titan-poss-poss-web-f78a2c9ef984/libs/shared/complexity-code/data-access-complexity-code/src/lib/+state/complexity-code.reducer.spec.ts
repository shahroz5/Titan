//you should simply assert that you get the right state given the provided inputs.

import * as actions from './complexity-code.actions';

import {
  MaterialType,
  ComplexityListPayload,
  ComplexityListing,
  ComplexityCode
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { complexityCodeReducer, initialState } from './complexity-code.reducer';
import { ComplexityCodeState } from './complexity-code.state';

describe('Complexity code  reducer Testing Suite', () => {
  describe('Testing LoadComplexityCodeList ', () => {
    beforeEach(() => {});
    it('Load LoadComplexityCodeList should set the isLoading to true', () => {
      const payload: ComplexityListPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadComplexityCodeList(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadComplexityCodeListSuccess should return list of complexity code', () => {
      const complexityCodes = [
        { complexityCode: 'J', description: 'j', isActive: true }
      ];
      const payload: ComplexityListing = {
        results: complexityCodes,
        totalElements: 0
      };
      const action = new actions.LoadComplexityCodeListSuccess(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.compexityCodeList.length).toBe(1);
    });
    it('LoadComplexityCodeListFailure should return error', () => {
      const action = new actions.LoadComplexityCodeListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveComplexityCode Functionality ', () => {
    beforeEach(() => {});
    it('SaveComplexityCode ', () => {
      const payload: ComplexityCode = {
        complexityCode: 'J',

        description: 'Gold',
        isActive: true
      };
      const action = new actions.SaveComplexityCode(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(false);
    });
    it('SaveComplexityCodeSuccess should update the hasSaved property to true', () => {
      const action = new actions.SaveComplexityCodeSuccess();

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
    });
    it('SaveComplexityCodeFailure should return error', () => {
      const action = new actions.SaveComplexityCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateComplexityByCode ', () => {
    beforeEach(() => {});
    it('UpdateComplexityByCode ', () => {
      const payload: ComplexityCode = {
        description: 'j',
        complexityCode: 'j',

        isActive: true
      };
      const action = new actions.UpdateComplexityByCode(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateComplexityByCodeSuccess should update the hasUpdated property to true', () => {
      const payload: MaterialType = {
        materialCode: 'J'
      };
      const action = new actions.UpdateComplexityByCodeSuccess();

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateComplexityByCodeFailure should return error', () => {
      const action = new actions.UpdateComplexityByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadComplexityByCode ', () => {
    beforeEach(() => {});
    it('LoadComplexityByCode should return the metal type ', () => {
      const payload = 'J';
      const action = new actions.LoadComplexityByCode(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadComplexityByCodeSuccess should return the brand', () => {
      const payload: ComplexityCode = {
        complexityCode: 'J',
        description: 'Gold',
        isActive: true
      };

      const action = new actions.LoadComplexityByCodeSuccess(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.complexityCode).toEqual(payload);
    });
    it('LoadComplexityByCodeFailure should return error', () => {
      const action = new actions.LoadComplexityByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchComplexityCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchComplexityCode should return searched material type', () => {
      const payload = 'J';
      const action = new actions.SearchComplexityCode(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchComplexityCodeSuccess should return searched brand', () => {
      const payload: ComplexityListing = {
        totalElements: 1,
        results: [
          {
            complexityCode: 'J',
            description: 'Gold',
            isActive: true
          }
        ]
      };
      const action = new actions.SearchComplexityCodeSuccess(payload);

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.totalElements).toBe(1);
      expect(result.compexityCodeList.length).toBe(1);
    });
    it('SearchComplexityCodeFailure should return error', () => {
      const action = new actions.SearchComplexityCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: ComplexityCodeState = complexityCodeReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
