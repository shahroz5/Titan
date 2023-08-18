import { CustomErrors } from "@poss-web/shared/models";
import { initialState } from "./ab-manual-request.reducer";
import { AbManualRequestState } from "./ab-manual-request.state";
import * as selectors from './ab-manual-request.selectors'

describe('AbManualRequestState selector Testing suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing AbManualRequestState related Selectors', () => {
    it('selectHasError should return hasError', () => {
      const state: AbManualRequestState = {
        ...initialState,
        hasError: error
      }
      expect(
        selectors.AbManualRequestSelectors.selectHasError.projector(state)
      ).toEqual(error);
    })
  })
})
