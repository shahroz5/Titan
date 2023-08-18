import * as actions from './stone-type.actions';
import { StoneTypeState } from './stone-type.state';
import {
  StoneTypeDetails,
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload
} from '@poss-web/shared/models';
import { initialState, StoneTypeReducer } from './stone-type.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Stone Type reducer Testing Suite', () => {
  const createStoneType = (
    stoneTypeCode: string,
    description: string,
    configDetails: {
      karatageWeightPrint: string;
    },
    isActive: boolean
  ): StoneTypeDetails => {
    return {
      stoneTypeCode,
      description,
      configDetails,
      isActive
    };
  };

  const stoneType1 = createStoneType(
    'stoneType1',
    'stoneType1',
    { karatageWeightPrint: 'aaa' },
    true
  );

  const stoneType2 = createStoneType(
    'stoneType2',
    'stoneType2',
    { karatageWeightPrint: 'aaa' },
    true
  );

  describe('Testing Load stone type details list', () => {
    beforeEach(() => {});
    it('LoadStoneTypeDetails should return list of stone types', () => {
      const payload: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadStoneTypeDetails(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: LoadStoneTypeListingSuccessPayload = {
        stoneTypeListing: [stoneType1],
        totalElements: 1
      };
      const action = new actions.LoadStoneTypeDetailsSuccess(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.totalStoneTypeDetails).toBe([stoneType1].length);
    });

    it('LoadStoneTypeDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadStoneTypeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  // stonetype by stone type code

  describe('Testing Load stone type details by stone type code list', () => {
    beforeEach(() => {});
    it('LoadStoneTypeDetailsByStoneTypeCode should return list of stone types', () => {
      const payload = 'AZ';
      const action = new actions.LoadStoneTypeByStoneTypeCode(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('LoadStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: StoneTypeDetails = stoneType1;
      const action = new actions.LoadStoneTypeByStoneTypeCodeSuccess(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.stoneTypeDetails).toBe(stoneType1);
    });

    it('LoadStoneTypeByStoneTypeCodeFailure should return list of stonetypecode', () => {
      const action = new actions.LoadStoneTypeByStoneTypeCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save stone type details', () => {
    beforeEach(() => {});
    it('SaveStoneTypeDetails should return list of stone types', () => {
      const payload: SaveStoneTypeFormDetailsPayload = stoneType1;
      const action = new actions.SaveStoneTypeFormDetails(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SaveStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: StoneTypeDetails = stoneType1;
      const action = new actions.SaveStoneTypeFormDetailsSuccess(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.saveStoneTypeResponses).toBe(stoneType1);
    });

    it('SaveStoneTypeDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.SaveStoneTypeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //edit

  describe('Testing edit stone type details', () => {
    beforeEach(() => {});
    it('EditStoneTypeDetails should return list of stone types', () => {
      const payload: SaveStoneTypeFormDetailsPayload = stoneType1;
      const action = new actions.EditStoneTypeFormDetails(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('EditStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: StoneTypeDetails = stoneType1;
      const action = new actions.EditStoneTypeFormDetailsSuccess(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.editStoneTypeResponses).toBe(stoneType1);
    });

    it('EditStoneTypeDetailsFailure should return list of stonetypecode', () => {
      const action = new actions.EditStoneTypeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  //search

  describe('Testing Search stone type details by stone type code list', () => {
    beforeEach(() => {});
    it('Search stone type should return list of stone types', () => {
      const payload = 'stonetypecode';
      const action = new actions.SearchStoneTypeCode(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    });

    it('SearchStoneTypeDetailsSuccess should return list of stone types', () => {
      const payload: StoneTypeDetails[] = [stoneType1];
      const action = new actions.SearchStoneTypeCodeSuccess(payload);
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    });

    it('SearchStoneTypeByStoneTypeCodeFailure should return list of stonetypecode', () => {
      const action = new actions.SearchStoneTypeCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.ResetStoneTypeDialog();
      const result: StoneTypeState = StoneTypeReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
