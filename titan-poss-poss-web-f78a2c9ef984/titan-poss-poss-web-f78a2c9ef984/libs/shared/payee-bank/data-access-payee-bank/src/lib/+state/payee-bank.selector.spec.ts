import { CustomErrors } from "libs/shared/models/src/lib/error.model";
import { initialState } from "./payee-bank.reducer";
import { PayeeBankSelectors } from "./payee-bank.selector";
import { PayeeBankState } from "./payee-bank.state";

describe('PayeeBank Selectors Testing Suite', () => {
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: PayeeBankState = {
      ...initialState,
      error: error
    };
    expect(PayeeBankSelectors.selectError.projector(state)).toEqual(error);
  });
})
