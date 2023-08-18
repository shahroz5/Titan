import { ItemStoneDetails } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  Clear,
  LoadPcDesc,
  LoadPcDescFailure,
  LoadPcDescSuccess,
  LoadPgDesc,
  LoadPgDescFailure,
  LoadPgDescSuccess,
  LoadStoneDetails,
  LoadStoneDetailsFailure,
  LoadStoneDetailsSuccess
} from './item-details-popup.actions';
import {
  initialState,
  ItemDetailsPopupReducer
} from './item-details-popup.reducer';
import { ItemDetailsPopupState } from './item-details-popup.state';

describe('Item Detail Popup Reducer Testing Suite', () => {
  let testState = initialState;
  const stoneDetails: ItemStoneDetails[] = [
    {
      color: 'Blue',
      description: 'Blue Stone 1',
      noOfStones: 12,
      price: 1234,
      quality: 'A',
      ratePerCarat: 2345,
      stoneCode: 'DA',
      stoneWeight: 12.33,
      currencyCode: 'IND',
      weightUnit: 'gms'
    },
    {
      color: 'Blue',
      description: 'Blue Stone 2',
      noOfStones: 12,
      price: 1234,
      quality: 'A',
      ratePerCarat: 2345,
      stoneCode: 'DA',
      stoneWeight: 12.33,
      currencyCode: 'IND',
      weightUnit: 'gms'
    }
  ];

  describe('Actions should check intial state', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: ItemDetailsPopupState = ItemDetailsPopupReducer(
        undefined,
        action
      );
      expect(state).toEqual(testState);
    });
  });

  describe('Actions should load stone details', () => {
    it('LOAD_STONE_DETAILS action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        isLoading: false,
        stoneDetails: stoneDetails
      };

      const payload: { itemCode: string; lotNumber: string | number } = {
        itemCode: '512115DVAABAP5',
        lotNumber: '2BA000002'
      };

      const action = new LoadStoneDetails(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.isLoading).toBeTruthy();

      expect(result.stoneDetails).toEqual([]);
    });

    it('LOAD_STONE_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        stoneDetails: []
      };

      const payload = stoneDetails;

      const action = new LoadStoneDetailsSuccess(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();

      expect(result.stoneDetails).toEqual(payload);
    });

    it('LOAD_STONE_DETAILS_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true,
        stoneDetails: stoneDetails
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadStoneDetailsFailure(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );
      expect(result.error).toEqual(payload);

      expect(result.isLoading).toBeFalsy();

      expect(result.stoneDetails).toEqual([]);
    });
  });

  describe('Actions should PC description details', () => {
    it('LOAD_PC_DESC action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        isLoading: false
      };

      const action = new LoadPcDesc();

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_PC_DESC_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        productCategoryDesc: null
      };

      const payload = [
        {
          code: 'Description 1',
          description: 'Description 2'
        },
        {
          code: 'Description 1',
          description: 'Description 2'
        }
      ];

      const action = new LoadPcDescSuccess(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();

      expect(result.productCategoryDesc).toEqual(payload);
    });

    it('LOAD_PC_DESC_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadPcDescFailure(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );
      expect(result.error).toEqual(payload);

      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should PG description details', () => {
    it('LOAD_PG_DESC action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        isLoading: false
      };

      const action = new LoadPgDesc();

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.error).toBeNull();
      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_PG_DESC_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        productGroupDesc: null
      };

      const payload = [
        {
          code: 'Description 1',
          description: 'Description 2'
        },
        {
          code: 'Description 1',
          description: 'Description 2'
        }
      ];

      const action = new LoadPgDescSuccess(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );

      expect(result.isLoading).toBeFalsy();

      expect(result.productGroupDesc).toEqual(payload);
    });

    it('LOAD_PG_DESC_FAILURE action', () => {
      testState = {
        ...testState,
        error: null,
        isLoading: true
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadPgDescFailure(payload);

      const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
        testState,
        action
      );
      expect(result.error).toEqual(payload);

      expect(result.isLoading).toBeFalsy();
    });
  });

  it('CLEAR action', () => {
    testState = {
      ...testState,
      error: CustomErrorAdaptor.fromJson(Error('Some Error')),
      isLoading: false,
      stoneDetails: stoneDetails
    };

    const action = new Clear();

    const result: ItemDetailsPopupState = ItemDetailsPopupReducer(
      testState,
      action
    );
    expect(result.error).toBeNull();

    expect(result.isLoading).toBeTruthy();

    expect(result.stoneDetails).toEqual([]);
  });
});
