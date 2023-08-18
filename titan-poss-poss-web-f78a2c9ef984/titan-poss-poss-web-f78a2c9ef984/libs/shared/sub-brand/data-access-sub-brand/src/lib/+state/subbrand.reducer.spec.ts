//you should simply assert that you get the right state given the provided inputs.
import * as actions from './subbrand.actions';
import { SubBrandState } from './subbrand.state';
import { initialState, SubbrandReducer } from './subbrand.reducers';
import {
  BrandMaster,
  UpadateIsActivePayload,
  SubBrandListingPayload,
  UpdateBrandMasterDetailsPayload,
  SearchPayload,
  BrandListing
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Brand reducer Testing Suite', () => {
  describe('Testing LoadSubBrandListing ', () => {
    beforeEach(() => {});
    it('LoadSubBrandListing should set the isLoading to true', () => {
      const payload: SubBrandListingPayload = {
        pageEvent: { pageIndex: 0, pageSize: 100 },
        parentBrandCode: 'Tanishq'
      };

      const action = new actions.LoadSubBrandListing(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadSubBrandListingSuccess should return list of brands', () => {
      const payload: BrandListing = { results: [], totalElements: 0 };
      const action = new actions.LoadSubBrandListingSuccess(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.subBrandList.ids.length).toBe(0);
    });
    it('LoadSubBrandListingFailure should return error', () => {
      const action = new actions.LoadSubBrandListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveSubBrandMasterDetails Functionality ', () => {
    beforeEach(() => {});
    it('SaveSubBrandMasterDetails ', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new actions.SaveSubBrandMasterDetails(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveSubBrandMasterDetailsSuccess should update the hasSaved property to true', () => {
      const action = new actions.SaveSubBrandMasterDetailsSuccess();

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });
    it('SaveSubBrandMasterDetailsFailure should return error', () => {
      const action = new actions.SaveSubBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateSubBrandMasterDetails ', () => {
    beforeEach(() => {});
    it('UpdateSubBrandMasterDetails ', () => {
      const payload: UpdateBrandMasterDetailsPayload = {
        brandCode: 'tanishq',
        data: {
          isActive: false
        }
      };
      const action = new actions.UpdateSubBrandMasterDetails(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateSubBrandMasterDetailsSuccess ', () => {
      const action = new actions.UpdateSubBrandMasterDetailsSuccess();

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });

    it('UpdateSubBrandMasterDetailsFailure should return error', () => {
      const action = new actions.UpdateSubBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSubrandDetailsByBrandCode Functionality ', () => {
    beforeEach(() => {});
    it('LoadSubrandDetailsByBrandCode should return searched brand', () => {
      const payload = 'tanishq';

      const action = new actions.LoadSubrandDetailsByBrandCode(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadSubrandDetailsByBrandCodeSuccess should return searched brand', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new actions.LoadSubrandDetailsByBrandCodeSuccess(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.subBrandDetails).toEqual({
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      });
    });
    it('LoadSubrandDetailsByBrandCodeFailure should return error', () => {
      const action = new actions.LoadSubrandDetailsByBrandCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateIsActive Functionality ', () => {
    beforeEach(() => {});
    it('UpdateIsActive should update isActive', () => {
      const payload: UpadateIsActivePayload = {
        brandCode: 'tanishq',
        isActive: true
      };

      const action = new actions.UpdateIsActive(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.isActiveUpdated).toBe(false);
    });
    it('UpdateIsActiveSuccess should update isActive property', () => {
      const payload: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new actions.UpdateIsActiveSuccess(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isActiveUpdated).toBe(true);
    });
    it('UpdateIsActiveFailure should return error', () => {
      const action = new actions.UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadParenBrands Functionality ', () => {
    beforeEach(() => {});
    it('LoadParenBrands should return list of parent brands', () => {
      const action = new actions.LoadParenBrands();

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(null);
    });
    it('LoadParenBrandsSuccess should return list of parent brands', () => {
      const payload: BrandMaster[] = [
        {
          brandCode: 'new',
          description: '',
          parentBrandCode: '',
          configDetails: {},
          orgCode: '',
          isActive: true
        }
      ];
      const action = new actions.LoadParenBrandsSuccess(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.parentBrands).toEqual(payload);
    });
    it('LoadParenBrandsFailure should return error', () => {
      const action = new actions.LoadParenBrandsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchSubBrandByBrandCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchSubBrandByBrandCode should return searched brand', () => {
      const payload: SearchPayload = {
        brandCode: 'tanishq',
        parentBrandCode: 'Titan'
      };

      const action = new actions.SearchSubBrandByBrandCode(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isLoading).toBe(null);
    });
    it('SearchSubBrandByBrandCodeSuccess should return searched brand', () => {
      const payload: BrandListing = { results: [], totalElements: 0 };

      const action = new actions.SearchSubBrandByBrandCodeSuccess(payload);

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.subBrandList.ids.length).toBe(0);
    });
    it('SearchSubBrandByBrandCodeFailure should return error', () => {
      const action = new actions.SearchSubBrandByBrandCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('Testing ResetIsActiveToggle Functionality ', () => {
    beforeEach(() => {});
    it('ResetIsActiveToggle should reset the isActiveUpdated', () => {
      const action = new actions.ResetIsActiveToggle();

      const result: SubBrandState = SubbrandReducer(initialState, action);

      expect(result.isActiveUpdated).toEqual(false);
    });
  });
});
