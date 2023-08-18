import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  StoneActionTypes,
  // LoadStoneDetails,
  // LoadStoneDetailsSuccess,
  // LoadStoneDetailsFailure,
  SearchStoneCode,
  SearchStoneCodeSuccess,
  SearchStoneCodeFailure,
  FilterStone,
  FilterStoneSuccess,
  FilterStoneFailure,
  ResetFilter
} from './stone.actions';

import {
  StoneDetails,
  LoadStoneListingPayload,
  LoadStoneListingSuccessPayload,
  CustomErrors,
  StoneFilter
} from '@poss-web/shared/models';

describe('Stone Action Testing Suite', () => {
  describe('FilterStone Action Test Cases', () => {
    it('should check correct type is used for  FilterStone action ', () => {
      const payload: StoneFilter = {
        payloadData: {
          color: 'AAA',
          fromStdValue: 10,
          quality: 'AAA',
          ratePerCarat: 10,
          stoneCode: 'AAA',
          stoneTypeCode: 'AAA',
          toStdValue: 10
        },
        pageIndex: 0,
        pageSize: 100
      };
      const action = new FilterStone(payload);
      expect({ ...action }).toEqual({
        type: StoneActionTypes.FILTER_STONE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  FilterStoneSuccess action ', () => {
      const payload: LoadStoneListingSuccessPayload = {
        stoneListing: [],
        totalElements: 0
      };
      const action = new FilterStoneSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneActionTypes.FILTER_STONE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  FilterStoneFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FilterStoneFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneActionTypes.FILTER_STONE_DETAILS_FAILURE,
        payload
      });
    });
  });

  //search

  describe('SearchStoneCode Action Test Cases', () => {
    it('should check correct type is used for  SearchStoneCode action ', () => {
      const payload = 'ABC';
      const action = new SearchStoneCode(payload);
      expect({ ...action }).toEqual({
        type: StoneActionTypes.SEARCH_STONE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchStoneCodeSuccess action ', () => {
      const payload: StoneDetails[] = [
        {
          stoneCode: 'ABC',
          stoneTypeCode: 'ABC',
          stdWeight: 'ABC',
          color: 'ABC',
          stdValue: 'ABC',
          quality: 'ABC',
          configDetails: { StoneTEPDiscount: 0 },
          ratePerCarat: 0,
          isActive: true
        }
      ];
      const action = new SearchStoneCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneActionTypes.SEARCH_STONE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchStoneCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchStoneCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneActionTypes.SEARCH_STONE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('ResetFilter Action Test Cases', () => {
    it('should check correct type is used for  ResetFilter action ', () => {
      const action = new ResetFilter();
      expect({ ...action }).toEqual({
        type: StoneActionTypes.RESET_FILTER_DATA
      });
    });
  });
});
