import * as actions from './bin-group.actions';
import { BinGroupState } from './bin-group.state';
import { initialState, BinGroupReducer } from './bin-group.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BinGroupDetails,
  LoadBinGroupDetailsListingPayload,
  LoadBinGroupDetailsListingSuccessPayload,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';

describe('Region reducer Testing Suite', () => {
  describe('Testing Load Region details list', () => {
    beforeEach(() => {});
    it('LoadBinGroupDetails should return list of Region data', () => {
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadBinGroupDetails(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadBinGroupDetailsSuccess should return list of Region data', () => {
      const payload: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [
          {
            binGroupCode: 'AAA',
            description: 'AAA',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadBinGroupDetailsSuccess(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalBinGroupDetails).toBe(
        payload.binGroupDetailsListing.length
      );
    });

    it('LoadBinGroupDetailsFailure should return list of Region data', () => {
      const action = new actions.LoadBinGroupDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Region by Region code

  describe('Testing Load Region details by Region code list', () => {
    beforeEach(() => {});
    it('LoadBinGroupByBinGroupCode should return list of Region data', () => {
      const payload = 'AZ';
      const action = new actions.LoadBinGroupByBinGroupCode(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadBinGroupByBinGroupCodeSuccess should return list of Region data', () => {
      const payload: BinGroupDetails = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new actions.LoadBinGroupByBinGroupCodeSuccess(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.binGroupDetails).toBe(payload);
    });

    it('LoadBinGroupByBinGroupCodeFailure should return error', () => {
      const action = new actions.LoadBinGroupByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save region details', () => {
    beforeEach(() => {});
    it('SaveBinGroupFormDetails should return list of Region', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new actions.SaveBinGroupFormDetails(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveBinGroupFormDetailsSuccess should return list of Region', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new actions.SaveBinGroupFormDetailsSuccess(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveBinGroupResponses).toBe(payload);
    });

    it('SaveBinGroupFormDetailsFailure should return error', () => {
      const action = new actions.SaveBinGroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit Region details', () => {
    beforeEach(() => {});
    it('EditBinGroupFormDetails should return list Region data', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new actions.EditBinGroupFormDetails(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditBinGroupFormDetailsSuccess should return list of region data', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const action = new actions.EditBinGroupFormDetailsSuccess(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editBinGroupResponses).toBe(payload);
    });

    it('EditBinGroupFormDetailsFailure should return error', () => {
      const action = new actions.EditBinGroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing  SearchByBinGroupCode details by SearchByBinGroupCode code list', () => {
    beforeEach(() => {});
    it(' SearchByBinGroupCode should return list of matched Regioncode', () => {
      const payload = 'ABC';
      const action = new actions.SearchByBinGroupCode(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error).toBe(null);
    });

    it('SearchByBinGroupCodeSuccess should return list of Region data', () => {
      const payload: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [],
        totalElements: 0
      };
      const action = new actions.SearchByBinGroupCodeSuccess(payload);
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.totalBinGroupDetails).toBe(
        payload.binGroupDetailsListing.length
      );
    });

    it('SearchByBinGroupCodeFailure should return error', () => {
      const action = new actions.SearchByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetBinGroupDialog ', () => {
    beforeEach(() => {});
    it('ResetBinGroupDialog should reset the store', () => {
      const action = new actions.ResetBinGroupDialog();
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
  describe('Testing SearchClear ', () => {
    beforeEach(() => {});
    it('SearchClear should reset the store', () => {
      const action = new actions.SearchClear();
      const result: BinGroupState = BinGroupReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
