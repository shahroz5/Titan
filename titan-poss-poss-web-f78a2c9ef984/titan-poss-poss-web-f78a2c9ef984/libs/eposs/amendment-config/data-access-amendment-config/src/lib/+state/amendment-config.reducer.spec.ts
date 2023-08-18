import { CustomErrors } from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";
import * as actions from "./amendment-config.actions";
import { AmendmentConfigReducer, initialState } from './amendment-config.reducer'
import { AmendmentConfigState } from "./amendment-config.state";

describe('AmendmentConfigReducer reucer Testing Suite', () => {
  it('should return the initial state', () => {
    const action: any = {};
    const state = AmendmentConfigReducer(null, action);

    expect(initialState).toBe(initialState);
  })

  describe('Testing LoadAmendmentConfigurationFiledValue', () => {
    beforeEach(() => {});
    it('LoadAmendmentConfigurationFiledValue should return proper state', () => {
      const action = new actions.LoadAmendmentConfigurationFiledValue()
      const result: AmendmentConfigState = AmendmentConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
    })
    it('LoadAmendmentConfigurationFiledValueSuccess should return proper state', () => {
      const action = new actions.LoadAmendmentConfigurationFiledValueSuccess(6)
      const result: AmendmentConfigState = AmendmentConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.amendmentConfigValue).toBe(6);
    })
    it('Load SaveAmendmentConfigurationFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new actions.SaveAmendmentConfigurationFailure(payload)
      const result: AmendmentConfigState = AmendmentConfigReducer(initialState, action);
      expect(result.isLoading).toBe(null);
      expect(result.error.message).toBe('Some Error');
    });
  })
})

