import * as actions from './sub-region.actions';
import { initialState, SubRegionReducer } from './sub-region.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RegionsData,
  LoadRegionDetailsListingSuccessPayload,
  SaveRegionDetailsPayload,
  EditSubRegionDetailsPayload,
  LoadSubRegionListingPayload,
  LoadSubRegionListingSuccessPayload
} from '@poss-web/shared/models';
import { SubRegionState } from './sub-region.state';
describe(' Sub Region reducer Testing Suite', () => {
  // Region List
  describe('Testing Load Region details list', () => {
    beforeEach(() => {});
    it('LoadRegionDetails should return list of Region data', () => {
      const action = new actions.LoadRegionDetails();
      const result: SubRegionState = SubRegionReducer(initialState, action);
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
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalSubRegionDetails).toBe(
        payload.regionDetailsListing.length
      );
    });

    it('LoadRegionDetailsFailure should return list of Region data', () => {
      const action = new actions.LoadRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Sub region List
  describe('Testing Load Sub Region details list', () => {
    beforeEach(() => {});
    it('LoadSubRegionDetails should return list of Region data', () => {
      const payload: LoadSubRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100,
        parentRegionCode: 'AAA'
      };
      const action = new actions.LoadSubRegionDetails(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadRegionDetailsSuccess should return list of Region data', () => {
      const payload: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [
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
      const action = new actions.LoadSubRegionDetailsSuccess(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalSubRegionDetails).toBe(
        payload.subRegionDetailsListing.length
      );
    });

    it('LoadRegionDetailsFailure should return list of Region data', () => {
      const action = new actions.LoadSubRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Sub Region by Region Sub code
  describe('Testing Load Sub Region details by Sub Region code list', () => {
    beforeEach(() => {});
    it('LoadSubRegionByCode should return list of Region data', () => {
      const payload = 'AZ';
      const action = new actions.LoadSubRegionByCode(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadSubRegionByCodeSuccess should return list of Region data', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.LoadSubRegionByCodeSuccess(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.subRegionDetailsBySubRegionCode).toBe(payload);
    });

    it('LoadSubRegionByCodeFailure should return error', () => {
      const action = new actions.LoadSubRegionByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save Sub region details', () => {
    beforeEach(() => {});
    it('SaveSubRegionFormDetails should return list of Region', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.SaveSubRegionFormDetails(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveSubRegionFormDetailsSuccess should return list of Region', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.SaveSubRegionFormDetailsSuccess(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveSubRegionDetailsResponse).toBe(payload);
    });

    it('SaveSubRegionFormDetailsFailure should return error', () => {
      const action = new actions.SaveSubRegionFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit
  describe('Testing edit Sub Region details', () => {
    beforeEach(() => {});
    it('EditSubRegionDetails should return list Region data', () => {
      const payload: EditSubRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        configDetails: {},
        isActive: true
      };
      const action = new actions.EditSubRegionDetails(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditSubRegionDetailsSuccess should return list of region data', () => {
      const payload: RegionsData = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const action = new actions.EditSubRegionDetailsSuccess(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editSubRegionDetailsResponse).toBe(payload);
    });

    it('EditSubRegionDetailsFailure should return error', () => {
      const action = new actions.EditSubRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search
  describe('Testing  SearchSubRegion details by SearchSubRegion code list', () => {
    beforeEach(() => {});
    it(' SearchSubRegion should return list of matched Regioncode', () => {
      const payload = { regionCode: 'ABC', parentRegionCode: 'AAA' };
      const action = new actions.SearchSubRegion(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error).toBe(null);
    });

    it('SearchSubRegionSuccess should return list of Region data', () => {
      const payload: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [
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
      const action = new actions.SearchSubRegionSuccess(payload);
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.totalSubRegionDetails).toBe(
        payload.subRegionDetailsListing.length
      );
    });

    it('SearchSubRegionFailure should return error', () => {
      const action = new actions.SearchSubRegionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //Reset
  describe('Testing ResetSubRegionDialog ', () => {
    beforeEach(() => {});
    it('ResetSubRegionDialog should reset the store', () => {
      const action = new actions.ResetSubRegionDialog();
      const result: SubRegionState = SubRegionReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
