import {
  CustomErrors,
  SaveRulesPayload,
  ClubDiscountsSuccessList,
  ClubDiscountsListPayload,
  ClubDiscountsList,
  DiscountTypeBasedCodes
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ClubDiscountsActionTypes,
  LoadClubbingDiscountConfigList,
  LoadClubbingDiscountConfigListSuccess,
  LoadClubbingDiscountConfigListFailure,
  SaveClubbingDiscountConfigList,
  SaveClubbingDiscountConfigListSuccess,
  SaveClubbingDiscountConfigListFailure,
  LoadType1Discounts,
  LoadType1DiscountsSuccess,
  LoadType1DiscountsFailure,
  LoadType2Discounts,
  LoadType2DiscountsSuccess,
  LoadType2DiscountsFailure,
  LoadType3Discounts,
  LoadType3DiscountsSuccess,
  LoadType3DiscountsFailure,
  DeleteClubbingDiscountConfigList,
  ResetClubbingDiscountConfigList
} from './clubbing-discount.actions';

describe('Clubbing Discounts Action Testing Suite', () => {
  describe('LoadClubbingDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadCurrencyDetails action ', () => {
      const payload: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const discountCode = 'MMOP';
      const action = new LoadClubbingDiscountConfigList(payload, discountCode);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS,
        payload,
        discountCode
      });
    });
    it('should check correct type is used for  LoadClubbingDiscountConfigListSuccess action ', () => {
      const payload: ClubDiscountsSuccessList = {
        clubDiscountsList: [],
        count: 0
      };
      const action = new LoadClubbingDiscountConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadClubbingDiscountConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadClubbingDiscountConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadType1Discounts Action Test Cases', () => {
    it('should check correct type is used for  LoadType1Discounts action ', () => {
      const payload = 'TYPE1';
      const action = new LoadType1Discounts(payload);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadType1DiscountsSuccess action ', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new LoadType1DiscountsSuccess(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadType1DiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadType1DiscountsFailure(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('LoadType2Discounts Action Test Cases', () => {
    it('should check correct type is used for  LoadType2Discounts action ', () => {
      const payload = 'TYPE2';
      const action = new LoadType2Discounts(payload);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadType2DiscountsSuccess action ', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new LoadType2DiscountsSuccess(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadType2DiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadType2DiscountsFailure(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS_FAILURE,
        payload
      });
    });
  });
  describe('LoadType3Discounts Action Test Cases', () => {
    it('should check correct type is used for  LoadType3Discounts action ', () => {
      const payload = 'TYPE3';
      const action = new LoadType3Discounts(payload);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for  LoadType3DiscountsSuccess action ', () => {
      const payload: DiscountTypeBasedCodes[] = [
        {
          id: '12',
          discountCode: 'AAA'
        }
      ];
      const action = new LoadType3DiscountsSuccess(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadType3DiscountsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadType3DiscountsFailure(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('SaveGlLocationPayment Action Test Cases', () => {
    it('should check correct type is used for  SaveCurrencyFormDetails action ', () => {
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
      const action = new SaveClubbingDiscountConfigList(payload);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS,
        payload
      });
    });
    it('should check correct type is used for SaveClubbingDiscountConfigListSuccess action ', () => {
      const payload: ClubDiscountsList = {
        id: '4567890',
        type1DiscountCode: 'AAA',
        type2DiscountCode: 'BBB',
        type3DiscountCode: 'CCC'
      };

      const action = new SaveClubbingDiscountConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveClubbingDiscountConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveClubbingDiscountConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS_FAILURE,
        payload
      });
    });
  });

  describe('DeleteClubbingDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  DeleteClubbingDiscountConfigList action ', () => {
      const payload = '12345678';
      const action = new DeleteClubbingDiscountConfigList(payload);
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.DELETE_CLUBBING_DISCOUNTS,
        payload
      });
    });
  });

  describe('ResetClubbingDiscountConfigList Action Test Cases', () => {
    it('should check correct type is used for  ResetClubbingDiscountConfigList action ', () => {
      const action = new ResetClubbingDiscountConfigList();
      expect({ ...action }).toEqual({
        type: ClubDiscountsActionTypes.RESET_CLUBBING_DISCOUNTS
      });
    });
  });
});
