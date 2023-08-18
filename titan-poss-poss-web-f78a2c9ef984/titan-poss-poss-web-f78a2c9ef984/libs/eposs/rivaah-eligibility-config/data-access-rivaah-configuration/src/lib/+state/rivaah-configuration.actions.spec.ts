import { CustomErrors, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahEligibilityConfigResponse } from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";
import { CreateRivaahEligibilityConfigurationFailure, CreateRivaahEligibilityConfigurationSuccess, LoadCouponConfiguration, LoadCouponConfigurationFailure, LoadCouponConfigurationSuccess, LoadRivaahEligibilityConfigurationFailure, LoadRivaahEligibilityConfigurationSuccess, RivaahConfigurationActionTypes, UpdateCouponConfigurationFailure, UpdateCouponConfigurationSuccess } from "./rivaah-configuration.actions"

describe('RivaahConfiguration Action Testing Suite', () => {
  describe('LoadCouponConfiguration Action Test Cases', () => {
    it('should check correct type is used for LoadCouponConfiguration action', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const action = new LoadCouponConfiguration(payload);
      expect({ ...action }).toEqual({
        type: RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION,
        payload
      })
    })

    it('should check correct type is used for LoadCouponConfigurationSuccess', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new LoadCouponConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_SUCCESSS,
        payload
      })
    })
    it('should check correct type is used for LoadCouponConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCouponConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RivaahConfigurationActionTypes.LOAD_COUPON_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCouponConfiguration Action Test Cases', () => {
    it('should check correct type is used for UpdateCouponConfigurationSuccess', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new UpdateCouponConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_SUCCESS,
        payload
      })
    })
    it('should check correct type is used for UpdateCouponConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCouponConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RivaahConfigurationActionTypes.UPDATE_COUPON_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadRivaahEligibilityConfiguration Action Test Cases', () => {
    it('should check correct type is used for LoadRivaahEligibilityConfigurationSuccess', () => {
      const payload: RivaahEligibilityConfigResponse = {
        rivaahEligibilityConfig: [{}],
        totalElements: 1
      }
      const action = new LoadRivaahEligibilityConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESSS,
        payload
      })
    })
    it('should check correct type is used for LoadRivaahEligibilityConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRivaahEligibilityConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RivaahConfigurationActionTypes.LOAD_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('CreateRivaahEligibilityConfiguration Action Test Cases', () => {
    it('should check correct type is used for CreateRivaahEligibilityConfigurationSuccess', () => {
      const action = new CreateRivaahEligibilityConfigurationSuccess();
      expect({ ...action }).toEqual({
        type: RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_SUCCESS,
      })
    })
    it('should check correct type is used for CreateRivaahEligibilityConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateRivaahEligibilityConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          RivaahConfigurationActionTypes.CREATE_RIVAAH_ELIGIBILITY_CONFIGURATION_FAILURE,
        payload
      });
    });
  });
});
