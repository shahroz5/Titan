import {
  CustomErrors,
  FileResponse,
  PayerBankMasterResponse
} from '@poss-web/shared/models';
import { initialState } from './payer-bank.reducer';
import { PayerBankSelectors } from './payer-bank.selector';
import { PayerBankState } from './payer-bank.state';

describe('PayerBank Selectors Testing Suite', () => {
  const payerBanksListing: PayerBankMasterResponse = {
    payerBanks: [
      {
        bankName: 'AXIS',
        isActive: true
      }
    ],
    totalElements: 1
  };

  it('Should return the payerBankListing ', () => {
    const state: PayerBankState = {
      ...initialState,
      bankDetails: payerBanksListing.payerBanks
    };
    expect(PayerBankSelectors.selectBankDetails.projector(state)).toEqual(
      payerBanksListing.payerBanks
    );
  });
  it('Should return the totalElements ', () => {
    const state: PayerBankState = {
      ...initialState,
      totalElements: payerBanksListing.totalElements
    };
    expect(PayerBankSelectors.selectTotalElements.projector(state)).toEqual(
      payerBanksListing.totalElements
    );
  });
  it('Should return the isLoading ', () => {
    const state: PayerBankState = {
      ...initialState,
      isLoading: true
    };
    expect(PayerBankSelectors.selectIsLoading.projector(state)).toEqual(true);
  });
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: PayerBankState = {
      ...initialState,
      error: error
    };
    expect(PayerBankSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the fileRespose', () => {
    const fileResponse: FileResponse = {
      totalCount: 2,
      successCount: 2,
      failureCount: 2,
      errorLogId: 12,
      hasError: true
    };
    const state: PayerBankState = {
      ...initialState,
      fileResponse: fileResponse
    };
    expect(PayerBankSelectors.selectFileResponse.projector(state)).toEqual(
      fileResponse
    );
  });
  it('Should return the errorLof ', () => {
    const state: PayerBankState = {
      ...initialState,
      errorLog: {}
    };
    expect(PayerBankSelectors.selectErrorLog.projector(state)).toEqual({});
  });
});
