import {
  CustomErrors,
  PayerBankConfigDetails,
  PayerBankConfiguration,
  PayerBankMaster,
  PaymentModeResponse
} from '@poss-web/shared/models';
import { PayerBankConfigState } from './payer-bank-config.state';
import { initialState } from './payer-bank-config.reducer';
import { PayerBankConfigSelectors } from './payer-bank-config.selector';
describe('PayerBank Selector Testing Suite', () => {
  const payerBankConfiguration: PayerBankConfiguration[] = [
    {
      id: 'abc123',
      description: 'Configuration',
      paymentCode: 'cc',
      isActive: true
    }
  ];
  const payerBankConfigDetails: PayerBankConfigDetails = {
    configDetails: {
      description: 'Configuration',
      paymentCode: 'cc',
      paymentDetails: {},
      isActive: true
    },
    selectedBanks: [
      {
        id: 'abc123',
        configId: 'abc123',
        bankName: 'Axis'
      }
    ]
  };
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: PayerBankConfigState = {
      ...initialState,
      error: error
    };
    expect(PayerBankConfigSelectors.selectError.projector(state)).toEqual(
      error
    );
  });

  it('Should return the payerbankconfig list', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      payerBankConfigListing: payerBankConfiguration
    };
    expect(
      PayerBankConfigSelectors.selectPayerBankConfigurations.projector(state)
    ).toEqual(payerBankConfiguration);
  });
  it('Should return the totalelements', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      totalElements: 1
    };
    expect(
      PayerBankConfigSelectors.selectTotalElements.projector(state)
    ).toEqual(1);
  });

  it('Should return the isloading', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(PayerBankConfigSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });

  it('Should return the hassaved', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      hasSaved: true
    };
    expect(PayerBankConfigSelectors.selectHasSaved.projector(state)).toEqual(
      true
    );
  });
  it('Should return the hasupdated ', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      hasUpdated: true
    };
    expect(PayerBankConfigSelectors.selectHasUpdated.projector(state)).toEqual(
      true
    );
  });

  it('Should return the hassearched', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      hasSearched: true
    };
    expect(PayerBankConfigSelectors.selectHasSearched.projector(state)).toEqual(
      true
    );
  });
  it('Should return the configid', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      configId: 'abc123'
    };
    expect(PayerBankConfigSelectors.selectConfigId.projector(state)).toEqual(
      'abc123'
    );
  });
  it('Should return the payerbanks', () => {
    const payerBanks: PayerBankMaster[] = [
      {
        bankName: 'Axis',
        isActive: true
      }
    ];
    const state: PayerBankConfigState = {
      ...initialState,
      payerBanks: payerBanks
    };
    expect(PayerBankConfigSelectors.selectPayerBanks.projector(state)).toEqual(
      payerBanks
    );
  });

  it('Should return the payerbanksconfig details', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      payerBanksConfigDetails: payerBankConfigDetails
    };
    expect(
      PayerBankConfigSelectors.selectPayerBankDetails.projector(state)
    ).toEqual(payerBankConfigDetails);
  });

  it('Should return the payerbanks count', () => {
    const state: PayerBankConfigState = {
      ...initialState,
      banksCount: 1
    };
    expect(PayerBankConfigSelectors.selectBanksCount.projector(state)).toEqual(
      1
    );
  });

  it('Should return the paymentmodes', () => {
    const paymentModes: PaymentModeResponse[] = [
      {
        value: 'abc123',
        description: 'cc'
      }
    ];
    const state: PayerBankConfigState = {
      ...initialState,
      paymentModes: paymentModes
    };
    expect(
      PayerBankConfigSelectors.selectPaymentModes.projector(state)
    ).toEqual(paymentModes);
  });
});
