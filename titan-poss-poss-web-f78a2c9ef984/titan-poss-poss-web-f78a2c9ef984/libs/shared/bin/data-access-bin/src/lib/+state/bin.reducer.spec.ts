import * as actions from './bin.actions';
import { initialState, BinReducer } from './bin.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadBinCodeDetailsListingSuccessPayload,
  LoadSearchBinCodeDetails,
  LocationList,
  LocationsByBinGroupAndBinCodePayload,
  SaveBinCodeFormPayload,
  BinCodeSaveModel,
  LoadBinGroupDetailsListingPayload,
  LocationMappingPostPayload,
  LocationMappingPost
} from '@poss-web/shared/models';
import { BinState } from './bin.state';
describe('Bin reducer Testing Suite', () => {
  describe('Testing Load Bin  list', () => {
    beforeEach(() => {});
    it('LoadBinCodeDetails should return list of Bin data', () => {
      const payload: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadBinCodeDetails(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('LoadBinCodeDetailsSuccess should return list of Bin data', () => {
      const payload: LoadBinCodeDetailsListingSuccessPayload = {
        binCodeDetailsListing: [
          {
            regionCode: 'AAA',
            locationCode: 'aaa',
            brandCode: 'aaa',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadBinCodeDetailsSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
      expect(result.totalBinCodeDetails).toBe(
        payload.binCodeDetailsListing.length
      );
    });

    it('LoadBinCodeDetailsFailure should return list of Bin data', () => {
      const action = new actions.LoadBinCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Bin by Bin Group code

  describe('Testing Load Bin by Bin Group Code list', () => {
    beforeEach(() => {});
    it('LoadBinCodesByBinGroupCode should return list of Bin data', () => {
      const payload = { binGroupCode: 'aaa', pageIndex: 0, pageSize: 10 };
      const action = new actions.LoadBinCodesByBinGroupCode(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('LoadBinCodesByBinGroupCodeSuccess should return list of Bin data', () => {
      const payload: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [
          {
            binCode: 'aaa',
            description: 'aaa',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadBinCodesByBinGroupCodeSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
    });

    it('LoadBinCodesByBinGroupCodeFailure should return error', () => {
      const action = new actions.LoadBinCodesByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // Locations By BinGroup And BinCode

  describe('Testing Load Locations By BinGroup And BinCode', () => {
    beforeEach(() => {});
    it('LoadLocationsByBinGroupAndBinCode should return list of Bin data', () => {
      const payload: LocationsByBinGroupAndBinCodePayload = {
        binGroup: 'aaa',
        binCodes: ['aaa']
      };
      const action = new actions.LoadLocationsByBinGroupAndBinCode(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('LoadLocationsByBinGroupAndBinCodeSuccess should return list of Bin data', () => {
      const payload: LocationList[] = [
        {
          id: '1',
          description: 'aaa'
        }
      ];
      const action = new actions.LoadLocationsByBinGroupAndBinCodeSuccess(
        payload
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
    });

    it('LoadLocationsByBinGroupAndBinCodeFailure should return error', () => {
      const action = new actions.LoadLocationsByBinGroupAndBinCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // save location mapping

  describe('Testing save Location Mapping details', () => {
    beforeEach(() => {});
    it('SaveLocationMappingDetails should return list of Bin', () => {
      const payload: LocationMappingPostPayload = {
        binGroup: 'aaa',
        data: { addLocations: [], binCodes: [], removeLocations: [] }
      };
      const action = new actions.SaveLocationMappingDetails(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('SaveLocationMappingDetailsSuccess should return list of Bin', () => {
      const payload: LocationMappingPost = {
        addLocations: [],
        binCodes: [],
        removeLocations: []
      };

      const action = new actions.SaveLocationMappingDetailsSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
      expect(result.locationMappingResponse).toBe(payload);
    });

    it('SaveLocationMappingDetailsFailure should return error', () => {
      const action = new actions.SaveLocationMappingDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // save

  describe('Testing save Bin details', () => {
    beforeEach(() => {});
    it('SaveBinCodeNewFormDetails should return list of Bin', () => {
      const payload: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const action = new actions.SaveBinCodeNewFormDetails(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('SaveBinCodeNewFormDetailsSuccess should return list of Bin', () => {
      const payload: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const action = new actions.SaveBinCodeNewFormDetailsSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
      expect(result.binCodeSaveNewResponses).toBe(payload);
    });

    it('SaveBinCodeNewFormDetailsFailure should return error', () => {
      const action = new actions.SaveBinCodeNewFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // edit

  describe('Testing edit Bin details', () => {
    beforeEach(() => {});
    it('EditBinCodeFormDetails should return list Bin data', () => {
      const payload: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };
      const action = new actions.EditBinCodeFormDetails(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(true);
    });

    it('EditBinCodeFormDetailsSuccess should return list of Bin data', () => {
      const payload: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };
      const action = new actions.EditBinCodeFormDetailsSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.isBinCodeLoading).toBe(false);
      expect(result.editBinCodeResponses).toBe(payload);
    });

    it('EditBinCodeFormDetailsFailure should return error', () => {
      const action = new actions.EditBinCodeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing  SearchBinName details by SearchBinName code list', () => {
    beforeEach(() => {});
    it(' SearchBinName should return list of matched Bincode', () => {
      const payload = { binCode: 'ABC', binGroupCode: 'AAA' };
      const action = new actions.SearchBinName(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.error).toBe(null);
    });

    it('SearchBinNameSuccess should return list of Bin data', () => {
      const payload: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [
          {
            binCode: 'aaa',
            description: 'aaa',
            isActive: true
          }
        ],
        totalElements: 0
      };
      const action = new actions.SearchBinNameSuccess(payload);
      const result: BinState = BinReducer(initialState, action);
      expect(result.totalBinCodeDetails).toBe(payload.totalElements);
    });

    it('SearchBinNameFailure should return error', () => {
      const action = new actions.SearchBinNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: BinState = BinReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //Reset

  describe('Testing ResetBinCodeDialog ', () => {
    beforeEach(() => {});
    it('ResetBinCodeDialog should reset the store', () => {
      const action = new actions.ResetBinCodeDialog();
      const result: BinState = BinReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
