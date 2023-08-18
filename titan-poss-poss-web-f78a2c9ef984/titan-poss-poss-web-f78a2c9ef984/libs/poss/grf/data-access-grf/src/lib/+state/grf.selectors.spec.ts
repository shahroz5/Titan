import * as selectors from './grf.selectors';
import { initialState } from './grf.reducer';
import { CtGrfState } from './grf.state';
import {
  CreditNote,
  FrozenCNs,
  InitiateGrfResponse,
  MergeCNResponse,
  UpdateGrfTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { creditNoteAdaptor } from './grf.entity';

describe('Grf Selector Testing Suite', () => {
  it('Testing selectSelectedRsoName selector', () => {
    const state: CtGrfState = {
      ...initialState,
      selectedRsoName: { value: 'abc123', description: 'RSO' }
    };
    expect(
      selectors.CtGrfSelectors.selectSelectedRsoName.projector(state)
    ).toEqual({ value: 'abc123', description: 'RSO' });
  });
  it('Testing selectInitiateAdvanceResponse selector', () => {
    const initiateGrfResponse: InitiateGrfResponse = {
      docNo: 0,
      id: '',
      status: '',
      txnType: '',
      subTxnType: ''
    };
    const state: CtGrfState = {
      ...initialState,
      initiateGrfResponse
    };
    expect(
      selectors.CtGrfSelectors.selectInitiateGrfResponse.projector(state)
    ).toEqual(initiateGrfResponse);
  });
  it('Testing selectUpdateGrfResponse selector', () => {
    const updateGrfResponse: UpdateGrfTransactionResponse = {
      docNo: 45,
      cndocNos: [],
      id: ''
    };
    const state: CtGrfState = {
      ...initialState,
      updateGrfResponse
    };
    expect(
      selectors.CtGrfSelectors.selectUpdateGrfResponse.projector(state)
    ).toEqual(updateGrfResponse);
  });
  it('Testing selectPartiallyUpdateGrfResponse selector', () => {
    const state: CtGrfState = {
      ...initialState,
      partiallyGrfResponse: null
    };
    expect(
      selectors.CtGrfSelectors.selectPartiallyUpdateGrfResponse.projector(state)
    ).toEqual(null);
  });
  it('Testing selectIsLoading selector', () => {
    const state: CtGrfState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.CtGrfSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('Testing selectGoldWeight selector', () => {
    const state: CtGrfState = {
      ...initialState,
      goldWeight: 2.5
    };
    expect(selectors.CtGrfSelectors.selectGoldWeight.projector(state)).toEqual(
      2.5
    );
  });
  it('Testing selectRemarks selector', () => {
    const state: CtGrfState = {
      ...initialState,
      remarks: 'Test'
    };
    expect(selectors.CtGrfSelectors.selectRemarks.projector(state)).toEqual(
      'Test'
    );
  });
  it('Testing selectRsoDetails selector', () => {
    const state: CtGrfState = {
      ...initialState,
      rsoDetails: [
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ]
    };
    expect(
      selectors.CtGrfSelectors.selectRsoDetails.projector(state).length
    ).toEqual(1);
  });
  it('Testing selectError selector', () => {
    const state: CtGrfState = {
      ...initialState,
      errors: null
    };
    expect(selectors.CtGrfSelectors.selectError.projector(state)).toEqual(null);
  });
});
describe('Merge GRF Selector Testing Suite', () => {
  const frozenCNs: FrozenCNs[] = [
    {
      docNo: '123',
      fiscalYear: '2021',
      cnDocNo: '123',
      cnFiscalYear: '2021'
    }
  ];
  const response: CreditNote = {
    amount: 123,
    creditNoteType: 'CN',
    customerId: 12,
    customerName: 'Rama',
    docDate: moment('123'),
    docNo: 12,
    fiscalYear: 2021,
    ratePerUnit: 12,
    weight: 12,
    id: 'abc123',
    linkedTxnId: 'abc123',
    linkedTxnType: 'abc456',
    locationCode: 'CPD',
    mobileNumber: '9010462817',
    status: 'OPEN',
    utilisedAmount: 100,
    workflowStatus: 'OPEN',
    cashCollected: 123
  };

  const creditNotes = [response];
  const creditNoteEntity = creditNoteAdaptor.setAll(creditNotes, {
    ...creditNoteAdaptor.getInitialState()
  });
  it('Should return the frozenCNs ', () => {
    const state: CtGrfState = {
      ...initialState,
      frozenCNs: frozenCNs
    };
    expect(selectors.CtGrfSelectors.selectFrozenCNs.projector(state)).toEqual(
      frozenCNs
    );
  });
  it('Should return the anotherCustomerCNs ', () => {
    const state: CtGrfState = {
      ...initialState,
      anotherCustomerCN: response
    };
    expect(
      selectors.CtGrfSelectors.selectAnotherCustomerCN.projector(state)
    ).toEqual(response);
  });

  it('Should return the mergeCNResponse ', () => {
    const mergeCNResponse: MergeCNResponse = {
      amount: 12,
      cnDocNo: 12,
      docNo: 12,
      id: 'abc123'
    };
    const state: CtGrfState = {
      ...initialState,
      mergeCNsResponse: mergeCNResponse
    };
    expect(
      selectors.CtGrfSelectors.selectMergeCNsResponse.projector(state)
    ).toEqual(mergeCNResponse);
  });

  // it('Should return the hasOTPGenerated ', () => {
  //   const state: CtGrfState = {
  //     ...initialState,
  //     hasOtpGenerated: true
  //   };
  //   expect(
  //     selectors.CtGrfSelectors.select.projector(state)
  //   ).toEqual(true);
  // });

  it('Should return the hasOTPValidated ', () => {
    const state: CtGrfState = {
      ...initialState,
      hasOtpValidated: true
    };
    expect(
      selectors.CtGrfSelectors.selectHasOtpValidated.projector(state)
    ).toEqual(true);
  });

  it('Should return the creditNoteEntty', () => {
    const state: CtGrfState = {
      ...initialState,
      creditNote: creditNoteEntity
    };
    expect(selectors.creditNotes.projector(state)).toEqual(creditNoteEntity);
  });

  it('Should return the creditNotes', () => {
    expect(
      selectors.CtGrfSelectors.selectGRFCN.projector(creditNoteEntity)
    ).toEqual(creditNotes);
  });
});
