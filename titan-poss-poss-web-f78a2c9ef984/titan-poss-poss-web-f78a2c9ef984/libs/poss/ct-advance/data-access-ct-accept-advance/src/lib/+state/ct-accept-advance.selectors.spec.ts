import * as selectors from './ct-accept-advance.selectors';
import { initialState } from './ct-accept-advance.reducer';
import { CtAcceptAdvanceState } from './ct-accept-advance.state';
import {
  InitiateAdvanceResponse,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';

describe('Accept Advance Selector Testing Suite', () => {
  it('Testing selectSelectedRsoName selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      selectedRsoName: { value: 'rso.urb.2', description: 'rso.urb.2' }
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectSelectedRsoName.projector(state)
    ).toEqual({ value: 'rso.urb.2', description: 'rso.urb.2' });
  });
  it('Testing selectInitiateAdvanceResponse selector', () => {
    const initiateAdvanceResponse: InitiateAdvanceResponse = {
      docNo: 0,
      id: '',
      status: '',
      txnType: '',
      subTxnType: ''
    };
    const state: CtAcceptAdvanceState = {
      ...initialState,
      initiateAdvanceResponse
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectInitiateAdvanceResponse.projector(
        state
      )
    ).toEqual(initiateAdvanceResponse);
  });
  it('Testing selectUpdateAdvanceResponse selector', () => {
    const updateAdvanceResponse: UpdateAdvanceTransactionResponse = {
      docNo: 45,
      cndocNos: [],
      id: ''
    };
    const state: CtAcceptAdvanceState = {
      ...initialState,
      updateAdvanceResponse
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectUpdateAdvanceResponse.projector(
        state
      )
    ).toEqual(updateAdvanceResponse);
  });
  it('Testing selectPartiallyUpdateAdvanceResponse selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      partiallyAdvanceResponse: null
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectPartiallyUpdateAdvanceResponse.projector(
        state
      )
    ).toEqual(null);
  });
  it('Testing selectIsLoading selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectRemarks selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      remarks: 'Test'
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectRemarks.projector(state)
    ).toEqual('Test');
  });
  it('Testing selectRsoDetails selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      rsoDetails: [
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ]
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectLoadRSODetails.projector(state)
    ).toEqual([
      {
        value: 'rso.urb.2',
        description: 'rso.urb.2'
      }
    ]);
  });
  it('Testing selectError selector', () => {
    const state: CtAcceptAdvanceState = {
      ...initialState,
      errors: null
    };
    expect(
      selectors.CtAcceptAdvanceSelectors.selectError.projector(state)
    ).toEqual(null);
  });
});
