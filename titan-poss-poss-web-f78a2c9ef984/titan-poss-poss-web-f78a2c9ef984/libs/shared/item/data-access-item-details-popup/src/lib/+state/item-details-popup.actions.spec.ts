import {
  CustomErrors,
  GSTMappingDetails,
  ItemStoneDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import {
  Clear,
  ItemDetailsPopupActionTypes,
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

describe('Item Detail Popup Action Testing ', () => {
  describe('Load Stone Details Test Cases', () => {
    it('should check correct type and payload is used for  LoadStoneDetails action ', () => {
      const payload: { itemCode: string; lotNumber: string | number } = {
        itemCode: '512115DVAABAP5',
        lotNumber: '2BA000002'
      };
      const action = new LoadStoneDetails(payload);

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS
      );
    });
    it('should check correct type  and payload is used for  LoadStoneDetailsSuccess action ', () => {
      const payload: ItemStoneDetails[] = [
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
      const action = new LoadStoneDetailsSuccess(payload);

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadStoneDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStoneDetailsFailure(payload);

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Product Description Test Cases', () => {
    it('should check correct type and payload is used for  LoadPcDesc action ', () => {
      const action = new LoadPcDesc();

      expect(action.type).toEqual(ItemDetailsPopupActionTypes.LOAD_PC_DESC);
    });
    it('should check correct type  and payload is used for  LoadPcDescSuccess action ', () => {
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

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_PC_DESC_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadPcDescFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPcDescFailure(payload);

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_PC_DESC_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Product Groups Test Cases', () => {
    it('should check correct type and payload is used for  LoadPgDesc action ', () => {
      const action = new LoadPgDesc();

      expect(action.type).toEqual(ItemDetailsPopupActionTypes.LOAD_PG_DESC);
    });
    it('should check correct type  and payload is used for  LoadPgDescSuccess action ', () => {
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

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_PG_DESC_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type  and payload is used for  LoadPgDescFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPgDescFailure(payload);

      expect(action.type).toEqual(
        ItemDetailsPopupActionTypes.LOAD_PG_DESC_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Clear Test Cases', () => {
    it('should check correct type and payload is used for  Clear action ', () => {
      const action = new Clear();

      expect(action.type).toEqual(ItemDetailsPopupActionTypes.CLEAR);
    });
  });
});
