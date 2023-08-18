import { BankDepositDetails, CustomErrors } from '@poss-web/shared/models';
import { initialState } from './boutique-bank-deposit.reducer';
import { BoutiqueBankDepositSelectors } from './boutique-bank-deposit.selectors';
import { BoutiqueBankDepositState } from './boutique-bank-deposit.state';

describe('Boutique Bank Deposit Selectors Testing Suite', () => {
  it('Should return the courierDetailsListing ', () => {
    const boutiqueBankDepositDetails: BankDepositDetails[] = [
      {
        collectionDate: '2020-10-09',
        paymentCode: 'CASH',
        locationCode: 'URB',
        payerBankName: 'AXIS',
        payeeBankName: ['AXIS', 'ICICI'],
        instrumentDate: '2020-10-09',
        depositDate: '2020-10-09',
        businessDate: '2020-10-09',
        instrumentNo: 12,
        amount: 12222,
        openingBalance: 12222,
        depositAmount: 12222,
        pifNo: 12222,
        midCode: 1222,
        depositDetails: {},
        isGhsIncluded: true,
        depositSlipNo: 123,
        password: 'Welcome@123',
        approvalDetails: {},
        isBankingCompleted: true,
        id: 'abc',
        depositedSlipDate: '2020-10-19'
      }
    ];
    const state: BoutiqueBankDepositState = {
      ...initialState,
      depositDetails: boutiqueBankDepositDetails
    };
    expect(
      BoutiqueBankDepositSelectors.selectBankDepositDetails.projector(state)
    ).toEqual(boutiqueBankDepositDetails);
  });
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: BoutiqueBankDepositState = {
      ...initialState,
      error: error
    };
    expect(BoutiqueBankDepositSelectors.selectError.projector(state)).toEqual(
      error
    );
  });

  it('Should return the hassaved ', () => {
    const state: BoutiqueBankDepositState = {
      ...initialState,
      hasSaved: true
    };
    expect(
      BoutiqueBankDepositSelectors.selectHasSaved.projector(state)
    ).toEqual(true);
  });
  it('Should return the isloading ', () => {
    const state: BoutiqueBankDepositState = {
      ...initialState,
      isLoading: true
    };
    expect(
      BoutiqueBankDepositSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });

  it('Should return the depositAmount ', () => {
    const state: BoutiqueBankDepositState = {
      ...initialState,
      depositedAmount: 123
    };
    expect(
      BoutiqueBankDepositSelectors.selectDepositAmount.projector(state)
    ).toEqual(123);
  });

  it('Should return the hasDenomitionSaved ', () => {
    const state: BoutiqueBankDepositState = {
      ...initialState,
      hasDenomitionSaved: true
    };
    expect(
      BoutiqueBankDepositSelectors.selectHasCashDenomoitonSaved.projector(state)
    ).toEqual(true);
  });

  it('Should return the pendingDates ', () => {
    const state: BoutiqueBankDepositState = {
      ...initialState,
      pendingDates: ['123']
    };
    expect(
      BoutiqueBankDepositSelectors.selectPendingDates.projector(state)
    ).toEqual(['123']);
  });

  it('Should return the saveResponse ', () => {
    const saveResponse: BankDepositDetails[] = [
      {
        collectionDate: '2020-10-09',
        paymentCode: 'CASH',
        locationCode: 'URB',
        payerBankName: 'AXIS',
        payeeBankName: ['AXIS', 'ICICI'],
        instrumentDate: '2020-10-09',
        depositDate: '2020-10-09',
        businessDate: '2020-10-09',
        instrumentNo: 12,
        amount: 12222,
        openingBalance: 12222,
        depositAmount: 12222,
        pifNo: 12222,
        midCode: 1222,
        depositDetails: {},
        isGhsIncluded: true,
        depositSlipNo: 123,
        password: 'Welcome@123',
        approvalDetails: {},
        isBankingCompleted: true,
        id: 'abc',
        depositedSlipDate: '2020-10-19'
      }
    ];
    const state: BoutiqueBankDepositState = {
      ...initialState,
      saveResponse: saveResponse
    };
    expect(
      BoutiqueBankDepositSelectors.selectSaveResponse.projector(state)
    ).toEqual(saveResponse);
  });
});
