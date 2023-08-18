import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  ComplexityListPayload,
  ComplexityListing,
  ComplexityCode
} from '@poss-web/shared/models';

import {
  LoadComplexityCodeList,
  LoadComplexityCodeListSuccess,
  LoadComplexityCodeListFailure,
  SearchComplexityCode,
  SearchComplexityCodeSuccess,
  SearchComplexityCodeFailure,
  SaveComplexityCode,
  SaveComplexityCodeSuccess,
  SaveComplexityCodeFailure,
  UpdateComplexityByCode,
  UpdateComplexityByCodeSuccess,
  UpdateComplexityByCodeFailure,
  LoadComplexityByCode,
  LoadComplexityByCodeSuccess,
  LoadComplexityByCodeFailure,
  ComplexityCodeActionTypes,
  LoadReset
} from './complexity-code.actions';

describe('Complexity code Action Testing Suite', () => {
  describe('LoadComplexityCodeList Action Test Cases', () => {
    it('should check correct type is used for  LoadComplexityCodeList action ', () => {
      const payload: ComplexityListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadComplexityCodeList(payload);
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadComplexityCodeListSuccess action ', () => {
      const payload: ComplexityListing = { results: [], totalElements: 0 };
      const action = new LoadComplexityCodeListSuccess(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadComplexityCodeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadComplexityCodeListFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchComplexityCode Action Test Cases', () => {
    it('should check correct type is used for  SearchComplexityCode action ', () => {
      const payload = 'J';
      const action = new SearchComplexityCode(payload);
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchComplexityCodeSuccess action ', () => {
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
      const action = new SearchComplexityCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchComplexityCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchComplexityCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveComplexityCode Action Test Cases', () => {
    it('should check correct type is used for  SaveComplexityCode action ', () => {
      const payload: ComplexityCode = {
        complexityCode: 'J',

        description: 'Gold',
        isActive: true
      };
      const action = new SaveComplexityCode(payload);
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE,
        payload
      });
    });
    it('should check correct type is used for SaveComplexityCodeSuccess action ', () => {
      const action = new SaveComplexityCodeSuccess();

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_SUCCESS
      });
    });
    it('should check correct type is used for  SaveComplexityCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveComplexityCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateComplexityByCode Action Test Cases', () => {
    it('should check correct type is used for  UpdateComplexityByCode action ', () => {
      const payload: ComplexityCode = {
        description: 'j',
        complexityCode: 'j',

        isActive: true
      };
      const action = new UpdateComplexityByCode(payload);
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for UpdateComplexityByCodeSuccess action ', () => {
      const action = new UpdateComplexityByCodeSuccess();

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateComplexityByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateComplexityByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadComplexityByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadComplexityByCode action ', () => {
      const payload = 'J';
      const action = new LoadComplexityByCode(payload);
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadComplexityByCodeSuccess action ', () => {
      const payload: ComplexityCode = {
        complexityCode: 'J',
        description: 'Gold',
        isActive: true
      };

      const action = new LoadComplexityByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadComplexityByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadComplexityByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: ComplexityCodeActionTypes.LOAD_RESET
      });
    });
  });
});
