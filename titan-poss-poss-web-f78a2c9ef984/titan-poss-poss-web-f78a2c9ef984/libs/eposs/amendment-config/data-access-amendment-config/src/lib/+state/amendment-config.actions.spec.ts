import { CustomErrors, UpdateFieldValuePayload } from "@poss-web/shared/models"
import { AmendmentConfigurationActionTypes, LoadAmendmentConfigurationFiledValue, LoadAmendmentConfigurationFiledValueFailure, LoadAmendmentConfigurationFiledValueSuccess, LoadReset, SaveAmendmentConfiguration, SaveAmendmentConfigurationFailure, SaveAmendmentConfigurationSuccess } from './amendment-config.actions'
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('AmendmentConfiguration Action Testing Suite', () => {
  describe('SaveAmendmentConfiguration Action Test cases', () => {
    it('should call SaveAmendmentConfiguration', () => {
      const payload: UpdateFieldValuePayload = {
        ruleDetails: {
          data: {},
          type: 'AMENDMENT_CONFIGURATION'
        }
      }

      const action = new SaveAmendmentConfiguration(payload);
      expect({ ...action }).toEqual({
        type: AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION,
        payload
      })
    })
    it('should call SaveAmendmentConfigurationSuccess', () => {
      const payload: number = 6;
      const action = new SaveAmendmentConfigurationSuccess(payload);
      expect({ ...action }).toEqual({
        type: AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_SUCCESS,
        payload
      })
    })
    it('should call SaveAmendmentConfigurationFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveAmendmentConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_FAILURE,
        payload
      });
    });
  })

  describe('LoadAmendmentConfigurationFiledValue  Action Test cases', () => {
    it('should call LoadAmendmentConfigurationFiledValue', () => {
      const action = new LoadAmendmentConfigurationFiledValue();
      expect({ ...action }).toEqual({
        type: AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE,
      })
    })
    it('should call LoadAmendmentConfigurationFiledValueSuccess', () => {
      const payload: number = 6;
      const action = new LoadAmendmentConfigurationFiledValueSuccess(payload);
      expect({ ...action }).toEqual({
        type: AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_SUCCESS,
        payload
      })
    })
    it('should call LoadAmendmentConfigurationFiledValueFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAmendmentConfigurationFiledValueFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_FAILURE,
        payload
      });
    });
  })

  describe('LoadReset', () => {
    it('LoadReset', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: AmendmentConfigurationActionTypes.LOAD_RESET
      })
    })
  })
})
