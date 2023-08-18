import * as actions from './corporate-town.actions';
import { CorporateTownState } from './corporate-town.state';
import { initialState, CorporateTownReducer } from './corporate-town.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CorporateTown,
  LoadCorporateTownListingPayload,
  LoadCorporateTownListingSuccessPayload,
  SaveTownFormDetailsPayload
} from '@poss-web/shared/models';

describe('Stone Type reducer Testing Suite', () => {
  const createTown = (
    townId: number,
    townCode: string,
    stateId: string,
    description: string,
    stateName: string,
    isActive: boolean
  ): CorporateTown => {
    return {
      townId,
      townCode,
      stateId,
      description,
      stateName,
      isActive
    };
  };
  const town1 = createTown(
    1,
    'GNT',
    '111AAA',
    'GUNTUR',
    'ANDHRA PRADESH',
    true
  );
  const town2 = createTown(
    1,
    'RK NAGAR',
    '111BBB',
    'BANGLORE',
    'KARNATAKA',
    true
  );

  describe('Testing Load stone type details list', () => {
    beforeEach(() => {});
    it('LoadCorporateTownDetails should return list of stone types', () => {
      const payload: LoadCorporateTownListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadCorporateTownDetails(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(true);
    });

    it('LoadCorporateTownDetailsSuccess should return list of stone types', () => {
      const payload: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 0
      };
      const action = new actions.LoadCorporateTownDetailsSuccess(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(false);
      return expect(result.totalCorporateTownDetails).toBe([town1].length);
    });

    it('LoadCorporateTownDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadCorporateTownDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  // stonetype by stone type code

  describe('Testing Load stone type details by stone type code list', () => {
    beforeEach(() => {});
    it('LoadTownDetailsByTownCode should return list of stone types', () => {
      const payload = 'AZ';
      const action = new actions.LoadTownDetailsByTownCode(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(true);
    });

    it('LoadStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: CorporateTown = town1;
      const action = new actions.LoadTownDetailsByTownCodeSuccess(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(false);
      expect(result.townDetailsByTownCode).toBe(town1);
    });

    it('LoadTownDetailsByTownCodeFailure should return list of stonetypecode', () => {
      const action = new actions.LoadTownDetailsByTownCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //save

  describe('Testing save stone type details', () => {
    beforeEach(() => {});
    it('SaveTownFormDetails should return list of stone types', () => {
      const payload: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new actions.SaveTownFormDetails(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(true);
    });

    it('SaveTownFormDetailsSuccess should return list of stone types', () => {
      const payload: CorporateTown = town1;
      const action = new actions.SaveTownFormDetailsSuccess(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(false);
      expect(result.saveTownDetailsResponses).toBe(town1);
    });

    it('SaveStoneTypeDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.SaveTownFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit stone type details', () => {
    beforeEach(() => {});
    it('EditTownFormDetails should return list of stone types', () => {
      const payload: SaveTownFormDetailsPayload = {
        townCode: 'TEST',
        stateId: 'TEST',
        description: 'TEST',
        isActive: true
      };
      const action = new actions.EditTownFormDetails(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(true);
    });

    it('EditTownFormDetailsSuccess should return list of stone types', () => {
      const payload: CorporateTown = town1;
      const action = new actions.EditTownFormDetailsSuccess(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(false);
      expect(result.editTownDetailsResponses).toBe(town1);
    });

    it('EditTownFormDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.EditTownFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing Search stone type details by stone type code list', () => {
    beforeEach(() => {});
    it('Search stone type should return list of stone types', () => {
      const payload = 'stonetypecode';
      const action = new actions.SearchCorporateTownCode(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      return expect(result.isCorporateTownLoading).toBe(true);
    });

    it('SearchCorporateTownCodeSuccess should return list of stone types', () => {
      const payload: LoadCorporateTownListingSuccessPayload = {
        corporateTownDetailsListing: [],
        totalElements: 1
      };
      const action = new actions.SearchCorporateTownCodeSuccess(payload);
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.isCorporateTownLoading).toBe(false);
    });

    it('SearchCorporateTownCodeFailure should return list of stonetypecode', () => {
      const action = new actions.SearchCorporateTownCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetTownDetailsDialog ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.ResetTownDetailsDialog();
      const result: CorporateTownState = CorporateTownReducer(
        initialState,
        action
      );
      expect(result).toEqual(initialState);
    });
  });
});
