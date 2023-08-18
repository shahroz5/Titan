import { CustomErrors, LoadProductGroupsPayload, ProductCategory, ProductGroupMappingOption, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahEligibilityConfigResponse, RivaahLocationListPayload, RivaahLocationSuccessList, SaveProductGroups, SaveRivaahLocationsPayload } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import * as actions from './rivaah-configuration.actions';

import { RivaahConfigurationReducer, initialState } from './rivaah-configuration.reducer'
import { RivaahConfigurationState } from './rivaah-configuration.state';
describe('RivaahConfigurationReducer Testing suite', () => {
  const rivaahEligibilityConfigRequest: RivaahEligibilityConfigRequest = {
    addProducts: [{
      productCategoryCode: 'prodCategory',
      productGroupCode: 'prodGroup',
      ruleDetails: {
        data: {
          grammage: 'gms',
          eleventhDigit: [''],
          occasion: 'Wedding',
          isActive: false
        },
        type: 'RIVAAH_CARD_ELIGIBILITY'
      }
    }],
    removeProducts: null,
    updateProducts: [{
      id: 'id',
      productCategoryCode: 'prodCategory',
      productGroupCode: 'prodGroup',
      ruleDetails: {
        data: {
          isActive: false
        },
        type: 'RIVAAH_CARD_ELIGIBILITY',
      }
    }]
  }
  it('should return initial state', () => {
    const action: any = {};
    const state = RivaahConfigurationReducer(null, action);
    expect(initialState).toBe(initialState);
  })

  describe('Testing loadCouponConfiguration', () => {
    beforeEach(() => {});
    it('loadCouponConfiguration should be called', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const action = new actions.LoadCouponConfiguration(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
  })

  describe('Testing CreateRivaahEligibilityConfiguration', () => {
    it('CreateRivaahEligibilityConfiguration should be called', () => {
      const action = new actions.CreateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call CreateRivaahEligibilityConfigurationSuccess', () => {
      const action = new actions.CreateRivaahEligibilityConfigurationSuccess();
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    })
    it('should call CreateRivaahEligibilityConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.CreateRivaahEligibilityConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing LoadCouponConfiguration', () => {
    it('should call LoadCouponConfigurationSuccess', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const action = new actions.LoadCouponConfigurationSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
    it('should call LoadCouponConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadCouponConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(null);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing UpdateCouponConfiguration', () => {
    it('UpdateCouponConfiguration should be called', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const action = new actions.UpdateCouponConfiguration(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasUpdated).toBe(false);
      expect(result.couponConfig).toBe(null);
      expect(result.isCouponSaved).toBe(false);
    })
    it('should call UpdateCouponConfigurationSuccess', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const action = new actions.UpdateCouponConfigurationSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.hasUpdated).toBe(true);
      expect(result.couponConfig).toBe(payload);
      expect(result.isCouponSaved).toBe(true);
    })
    it('should call UpdateCouponConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateCouponConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
      expect(result.hasUpdated).toBe(false);
      expect(result.isCouponSaved).toBe(false);
    })
  })
  describe('Testing LoadRivaahEligibilityConfiguration', () => {
    it('should call LoadRivaahEligibilityConfigurationSuccess', () => {
      const payload: RivaahEligibilityConfigResponse = {
        rivaahEligibilityConfig: [{}],
        totalElements: 0
      }
      const action = new actions.LoadRivaahEligibilityConfigurationSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
    it('should call LoadRivaahEligibilityConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRivaahEligibilityConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
    })
  })
  describe('Testing UpdateRivaahEligibilityConfiguration', () => {
    it('should call UpdateRivaahEligibilityConfiguration', () => {
      const action = new actions.UpdateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityUpdated).toBe(false)
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call UpdateRivaahEligibilityConfigurationSuccess', () => {
      const action = new actions.UpdateRivaahEligibilityConfigurationSuccess();
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    })
    it('should call UpdateRivaahEligibilityConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateRivaahEligibilityConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityUpdated).toBe(false)
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing DeleteRivaahEligibilityConfiguration', () => {
    it('should call DeleteRivaahEligibilityConfiguration', () => {
      const action = new actions.DeleteRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityDeleted).toBe(false)
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call DeleteRivaahEligibilityConfigurationSuccess', () => {
      const action = new actions.DeleteRivaahEligibilityConfigurationSuccess();
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityDeleted).toBe(true);
      expect(result.isLoading).toBe(false);
    })
    it('should call DeleteRivaahEligibilityConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.DeleteRivaahEligibilityConfigurationFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityDeleted).toBe(false)
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing ToggleRivaahEligibilityConfigurationStatus', () => {
    it('should call ToggleRivaahEligibilityConfigurationStatus', () => {
      const action = new actions.ToggleRivaahEligibilityConfigurationStatus(rivaahEligibilityConfigRequest);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityToggled).toBe(false)
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call ToggleRivaahEligibilityConfigurationStatusSuccess', () => {
      const action = new actions.ToggleRivaahEligibilityConfigurationStatusSuccess();
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityToggled).toBe(true);
      expect(result.isLoading).toBe(false);
    })
    it('should call ToggleRivaahEligibilityConfigurationStatusFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.ToggleRivaahEligibilityConfigurationStatusFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isRivaElibilityToggled).toBe(false)
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing LoadMappedProductGroupsByProductId', () => {
    it('should call LoadMappedProductGroupsByProductId', () => {
      const payload: LoadProductGroupsPayload = {
        ruleType: 'Config'
      }
      const action = new actions.LoadMappedProductGroupsByProductId(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.productGroups).toBe(null)
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call LoadMappedProductGroupsByProductIdSuccess', () => {
      const payload: ProductGroupMappingOption[] = [{
        id: 'id'
      }]
      const action = new actions.LoadMappedProductGroupsByProductIdSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.productGroups).toBe(payload);
      expect(result.isLoading).toBe(false);
    })
    it('should call LoadMappedProductGroupsByProductIdFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadMappedProductGroupsByProductIdFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.productGroups).toBe(null);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing LoadProductCategory', () => {
    it('should call LoadProductCategorySuccess', () => {
      const payload: ProductCategory[] = [{
        description: 'Description',
        productCategoryCode: 'prodCategory'
      }]
      const action = new actions.LoadProductCategorySuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.productCategory).toBe(payload);
      expect(result.isLoading).toBe(false);
    })
    it('should call LoadProductCategoryFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadProductCategoryFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing LoadRivaahMappedLocationList', () => {
    it('should call LoadRivaahMappedLocationList', () => {
      const payload: RivaahLocationListPayload = {
        ruleId: 'ruleId',
        pageIndex: 0,
        pageSize: 10
      }
      const action = new actions.LoadRivaahMappedLocationList(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call LoadRivaahMappedLocationListSuccess', () => {
      const payload: RivaahLocationSuccessList = {
        rivaahLocationList: [{
          description: 'Description',
          ruleId: 'ruleId',
          locationCode: 'locationCode',
          offerEndDate: moment(165413000),
          offerStartDate: moment(16451000),
          subBrandCode: 'Tanishq'
        }],
        count: 1
      }
      const action = new actions.LoadRivaahMappedLocationListSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(false);
    })
    it('should call LoadRivaahMappedLocationListFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.LoadRivaahMappedLocationListFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing UpdateProductGroupByProductId', () => {
    it('should call UpdateProductGroupByProductId', () => {
      const payload: SaveProductGroups = {
        addProducts: null,
        removeProducts: null,
        ruleType: 'Config'
      }
      const action = new actions.UpdateProductGroupByProductId(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.hasProductsUpdated).toBe(false)
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    })
    it('should call UpdateProductGroupByProductIdSuccess', () => {
      const payload: ProductGroupMappingOption[] = [{
        id: 'id'
      }]
      const action = new actions.UpdateProductGroupByProductIdSuccess(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.hasProductsUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
    })
    it('should call UpdateProductGroupByProductIdFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.UpdateProductGroupByProductIdFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.hasProductsUpdated).toBe(false);
      expect(result.isLoading).toBe(null);
      expect(result.error).toBe(payload);
    })
  })
  describe('Testing SaveRivaahLocations', () => {
    it('should call SaveRivaahLocations', () => {
      const payload: SaveRivaahLocationsPayload = {
        payload: null
      }
      const action = new actions.SaveRivaahLocations(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.savedLocations).toBe(false)
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    })
    it('should call SaveRivaahLocationsSuccess', () => {
      const action = new actions.SaveRivaahLocationsSuccess();
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.savedLocations).toBe(true);
      expect(result.isLoading).toBe(false);
    })
    it('should call SaveRivaahLocationsFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SaveRivaahLocationsFailure(payload);
      const result = RivaahConfigurationReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(payload);
    })
  })
})

