import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './clubbing-discount.actions';
import { ClubDiscountsState } from './clubbing-discount.state';

import {
  initialState,
  ClubDiscountsReducer
} from './clubbing-discount.reducer';
import {
  ClubDiscountsList,
  ClubDiscountsListPayload,
  ClubDiscountsSuccessList,
  DiscountTypeBasedCodes,
  SaveRulesPayload
} from '@poss-web/shared/models';

describe('Currency reducer Testing Suite', () => {
  describe('Testing Load Currency details list', () => {
    beforeEach(() => {});
    it('LoadClubbingDiscountConfigList should return list of Currency data', () => {
      const payload: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new actions.LoadClubbingDiscountConfigList(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadClubbingDiscountConfigListSuccess should return list of Currency data', () => {
      const payload: ClubDiscountsSuccessList = {
        clubDiscountsList: [
          {
            id: '4567890',
            type1DiscountCode: 'AAA',
            type2DiscountCode: 'BBB',
            type3DiscountCode: 'CCC'
          }
        ],
        count: 1
      };
      const action = new actions.LoadClubbingDiscountConfigListSuccess(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalCount).toBe(payload.clubDiscountsList.length);
    });

    it('LoadClubbingDiscountConfigListFailure should return list of Currency data', () => {
      const action = new actions.LoadClubbingDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //save
  describe('Testing save SaveClubbingDiscounts', () => {
    beforeEach(() => {});
    it('SaveClubbingDiscountConfigList should return list of gl locations', () => {
      const payload: SaveRulesPayload = {
        addRules: [
          {
            type1DiscountCode: 'AAA',
            type2DiscountCode: 'BBB',
            type3DiscountCode: 'CCC'
          }
        ],
        removeRules: []
      };
      const action = new actions.SaveClubbingDiscountConfigList(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });

    it('SaveGlLocationPaymentSuccess should return list of Currency', () => {
      const payload: ClubDiscountsList = {
        id: '4567890',
        type1DiscountCode: 'AAA',
        type2DiscountCode: 'BBB',
        type3DiscountCode: 'CCC'
      };
      const action = new actions.SaveClubbingDiscountConfigListSuccess(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.saveclubbedDiscounts).toBe(payload);
    });

    it('SaveClubbingDiscountConfigListFailure should return error', () => {
      const action = new actions.SaveClubbingDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  //   //edit
  describe('Testing LoadType1Discounts', () => {
    beforeEach(() => {});
    it('LoadType1Discounts should return list of type 1 discounts data', () => {
      const payload = 'TYPE1';
      const action = new actions.LoadType1Discounts(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadType1DiscountsSuccess should return list of type 1 discounts data', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new actions.LoadType1DiscountsSuccess(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.discountCodesType1).toBe(payload);
    });

    it('LoadType1DiscountsFailure should return error', () => {
      const action = new actions.LoadType1DiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadType2Discounts', () => {
    beforeEach(() => {});
    it('LoadType2Discounts should return list of type 2 discounts data', () => {
      const payload = 'TYPE2';
      const action = new actions.LoadType2Discounts(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadType2DiscountsSuccess should return list of type 2 discounts data', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new actions.LoadType2DiscountsSuccess(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.discountCodesType2).toBe(payload);
    });

    it('LoadType2DiscountsFailure should return error', () => {
      const action = new actions.LoadType2DiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadType3Discounts', () => {
    beforeEach(() => {});
    it('LoadType3Discounts should return list of type 3 discounts data', () => {
      const payload = 'TYPE3';
      const action = new actions.LoadType3Discounts(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadType3DiscountsSuccess should return list of type 3 discounts data', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new actions.LoadType3DiscountsSuccess(payload);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.discountCodesType3).toBe(payload);
    });

    it('LoadType3DiscountsFailure should return error', () => {
      const action = new actions.LoadType3DiscountsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });
  describe('Testing DeleteClubbingDiscountConfigList ', () => {
    beforeEach(() => {});
    it('DeleteClubbingDiscountConfigList should reset the store', () => {
      const id = '2345678';
      const action = new actions.DeleteClubbingDiscountConfigList(id);
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
    });
  });

  describe('Testing ResetClubbingDiscountConfigList ', () => {
    beforeEach(() => {});
    it('ResetClubbingDiscountConfigList should reset the store', () => {
      const action = new actions.ResetClubbingDiscountConfigList();
      const result: ClubDiscountsState = ClubDiscountsReducer(
        initialState,
        action
      );
      expect(result.hasSaved).toEqual(false);
      expect(result.isLoading).toEqual(false);
    });
  });
});
