import {
  CashPaymentConfiguration,
  CustomErrors
} from '@poss-web/shared/models';
import { AddNewCashPaymentConfiguration, AddNewCashPaymentConfigurationFailure, AddNewCashPaymentConfigurationSuccess, CashPaymentConfigurationActionTypes, EditCashPaymentConfiguration, EditCashPaymentConfigurationFailure, EditCashPaymentConfigurationSuccess, LoadCashPaymentConfiguration, LoadCashPaymentConfigurationFailure, LoadCashPaymentConfigurationSuccess, } from './cash-payment-configuration.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Cash Payment Configuration Action Testing Suite', () => {
  describe('LoadCashPaymentConfiguration Action Test Cases', () => {
    it('should check correct type is used for LoadCashPaymentConfiguration action', () => {
      const payload = 8;
      const action = new LoadCashPaymentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION,
        payload
      });
    });

    it('should check correct type is used for LoadCashPaymentConfigurationSuccess action', () => {
      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new LoadCashPaymentConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductCategoryDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCashPaymentConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.LOAD_CASH_PAYMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('AddNewCashPaymentConfiguration Action Test Cases', () => {
    it('should check correct type is used for AddNewCashPaymentConfiguration action', () => {
      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new AddNewCashPaymentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION,
        payload
      });
    });

    it('should check correct type is used for AddNewCashPaymentConfigurationSuccess action', () => {
      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new AddNewCashPaymentConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadProductCategoryByProductCategoryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddNewCashPaymentConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.ADDNEW_CASH_PAYMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('EditCashPaymentConfiguration Action Test Cases', () => {
    it('should check correct type is used for EditCashPaymentConfiguration action', () => {
      const payload: { ruleId: number; cashPaymentConfigurationForm: CashPaymentConfiguration } = {
        ruleId: 1,
        cashPaymentConfigurationForm: {
          description: 'Desc',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'T'
        }
      };

      const action = new EditCashPaymentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION,
        payload
      });
    });

    it('should check correct type is used for EditCashPaymentConfigurationSuccess action', () => {
      const payload: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const action = new EditCashPaymentConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditCashPaymentConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditCashPaymentConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: CashPaymentConfigurationActionTypes.EDIT_CASH_PAYMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

});
