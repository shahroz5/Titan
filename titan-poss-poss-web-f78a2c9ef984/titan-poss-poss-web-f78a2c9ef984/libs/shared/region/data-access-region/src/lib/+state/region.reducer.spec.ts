import * as actions from './region.actions';
import { initialState, RegionReducer } from './region.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RegionsData,
  LoadRegionListingPayload,
  LoadRegionDetailsListingSuccessPayload,
  SaveRegionDetailsPayload,
  EditRegionDetailsPayload
} from '@poss-web/shared/models';
import { RegionsState } from './region.state';
describe('Region reducer Testing Suite', () => {
  describe('Testing Load Region details list', () => {
    beforeEach(() => {});
    it('LoadRegionDetails should return list of Region data', () => {
      const payload: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadRegionDetails(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadRegionDetailsSuccess should return list of Region data', () => {
      const payload: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [
          {
            regionCode: 'AAA',
            description: 'AAA',
            orgCode: 'AAA',
            configDetails: {},
            parentRegionCode: 'AAA',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadRegionDetailsSuccess(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalRegionDetails).toBe(
        payload.regionDetailsListing.length
      );
    });

    it('LoadRegionDetailsFailure should return list of Region data', () => {
      const action = new actions.LoadRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Region by Region code

  describe('Testing Load Region details by Region code list', () => {
    beforeEach(() => {});
    it('LoadRegionByCode should return list of Region data', () => {
      const payload = 'AZ';
      const action = new actions.LoadRegionByCode(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadRegionByCodeSuccess should return list of Region data', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.LoadRegionByCodeSuccess(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.regionDetailsByRegionCode).toBe(payload);
    });

    it('LoadRegionByCodeFailure should return error', () => {
      const action = new actions.LoadRegionByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save region details', () => {
    beforeEach(() => {});
    it('SaveRegionFormDetails should return list of Region', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.SaveRegionFormDetails(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveRegionFormDetailsSuccess should return list of Region', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.SaveRegionFormDetailsSuccess(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveRegionDetailsResponse).toBe(payload);
    });

    it('SaveRegionFormDetailsFailure should return error', () => {
      const action = new actions.SaveRegionFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit Region details', () => {
    beforeEach(() => {});
    it('EditRegionDetails should return list Region data', () => {
      const payload: EditRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        configDetails: {},
        isActive: true
      };
      const action = new actions.EditRegionDetails(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditRegionDetailsSuccess should return list of region data', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.EditRegionDetailsSuccess(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editRegionDetailsResponse).toBe(payload);
    });

    it('EditRegionDetailsFailure should return error', () => {
      const action = new actions.EditRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing  SearchRegion details by SearchRegion code list', () => {
    beforeEach(() => {});
    it(' SearchRegion should return list of matched Regioncode', () => {
      const payload = 'ABC';
      const action = new actions.SearchRegion(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error).toBe(null);
    });

    it('SearchRegionSuccess should return list of Region data', () => {
      const payload: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [
          {
            regionCode: 'AAA',
            description: 'AAA',
            orgCode: 'AAA',
            configDetails: {},
            parentRegionCode: 'AAA',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchRegionSuccess(payload);
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.totalRegionDetails).toBe(
        payload.regionDetailsListing.length
      );
    });

    it('SearchRegionFailure should return error', () => {
      const action = new actions.SearchRegionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetRegionDialog ', () => {
    beforeEach(() => {});
    it('ResetRegionDialog should reset the store', () => {
      const action = new actions.ResetRegionDialog();
      const result: RegionsState = RegionReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
