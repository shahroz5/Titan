import { CustomErrors } from "@poss-web/shared/models";
import { initialState } from "./amendment-config.reducer";
import { AmendmentConfigState } from "./amendment-config.state";
import * as selectors from './amendment-config.selectors'

describe('OrderPaymentConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing AmendmentConfigState related Selectors', () => {
    it('selectAmendmentConfiguration should return amendmentConfigValue', () => {
      const state: AmendmentConfigState = {
        ...initialState,
        amendmentConfigValue: 6
      };
      expect(
        selectors.AmendmentConfigurationSelectors.selectAmendmentConfiguration.projector(
          state
        )
      ).toEqual(6);
    })
  })
  it('selectError should return error', () => {
    const state: AmendmentConfigState = {
      ...initialState,
      error: error
    };
    expect(
      selectors.AmendmentConfigurationSelectors.selectError.projector(
        state
      )
    ).toEqual(error);
  })
})
it('selectIsLoading should return isLoading', () => {
  const state: AmendmentConfigState = {
    ...initialState,
    isLoading: false
  };
  expect(
    selectors.AmendmentConfigurationSelectors.selectIsLoading.projector(
      state
    )
  ).toEqual(false);
})
it('selectHasUpdated should return hasUpdated', () => {
  const state: AmendmentConfigState = {
    ...initialState,
    hasUpdated: false
  };
  expect(
    selectors.AmendmentConfigurationSelectors.selectHasUpdated.projector(
      state
    )
  ).toEqual(false);
})
