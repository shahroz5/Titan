// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  PaymentConfiguration,
  PaymentModesConfig
} from '@poss-web/shared/models';

import { initialState } from './payment-configuration.reducer';
import * as selectors from './payment-configuration.selector';

import { PaymentConfigurationState } from './payment-configuration.state';
import {
  PaymentModeConfigEntity,
  paymentModeAdaptor
} from './payment-configuration.entity';

describe('PaymentConfigurationState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const paymentMode1 = {
    title: 'CASH',
    totalCount: 1,
    description: 'CASH',
    selectedCount: 1
  };
  const paymentMode2 = {
    title: 'AIRPAY',
    totalCount: 1,
    description: 'AIRPAY',
    selectedCount: 1
  };
  const paymentModeListArray = [paymentMode1, paymentMode2];
  const addElementToEntities = <T extends PaymentModesConfig>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.title]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const paymentModeState: PaymentModeConfigEntity = {
    ids: [paymentMode1.title, paymentMode2.title],
    entities: addElementToEntities(paymentModeListArray)
  };

  describe('Testing PaymentConfigurationState related Selectors', () => {
    it('selectPaymentConfigurationList Should return the list of payment config', () => {
      const paymentConfigurationList: PaymentConfiguration[] = [
        {
          paymentName: 'cash',
          isActive: true,
          configId: '1'
        }
      ];

      const state: PaymentConfigurationState = {
        ...initialState,
        paymentConfigurationlist: paymentConfigurationList
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectPaymentConfigurationList.projector(
          state
        )
      ).toEqual(paymentConfigurationList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectHasUpdated Should return the true or false', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectHasUpdated.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectPaymentConfiguration Should return the true or false', () => {
      const paymentConfiguration: PaymentConfiguration = {
        paymentName: 'cash',
        isActive: true,
        configId: '1'
      };
      const state: PaymentConfigurationState = {
        ...initialState,
        paymentConfiguration: paymentConfiguration
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectPaymentConfiguration.projector(
          state
        )
      ).toEqual(paymentConfiguration);
    });

    it('selectPaymentModeCount Should return the true or false', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        paymentModeCount: 10
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectPaymentModeCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectConfigId Should return the true or false', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        configId: '1'
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectConfigId.projector(state)
      ).toEqual('1');
    });

    it('selectTcsPaymentModes Should return the tcs payment modes', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        tcsPaymentModes: [
          {
            code: 'AIRPAY',
            checked: true,
            id: '1'
          }
        ]
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectTcsPaymentModes.projector(
          state
        )
      ).toEqual([
        {
          code: 'AIRPAY',
          checked: true,
          id: '1'
        }
      ]);
    });

    it('selectedOptions Should return the tcs payment modes', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        selectedOptions: {
          selectedResponse: [
            {
              id: '1',
              rowHeaderKey: 'cm',
              columnHeaderKey: 'cash',
              configDetails: {}
            }
          ],
          selectedMap: null,
          count: 1,
          id: '1'
        }
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectSelectedOptions.projector(
          state
        )
      ).toEqual({
        selectedResponse: [
          {
            id: '1',
            rowHeaderKey: 'cm',
            columnHeaderKey: 'cash',
            configDetails: {}
          }
        ],
        selectedMap: null,
        count: 1,
        id: '1'
      });
    });

    it('selectTransactionType Should return the tcs payment modes', () => {
      const state: PaymentConfigurationState = {
        ...initialState,
        transctionTypes: [{ code: 'CM', description: 'Cash Memo' }]
      };
      expect(
        selectors.PaymentConfigurationSelectors.selectTransactionType.projector(
          state
        )
      ).toEqual([{ code: 'CM', description: 'Cash Memo' }]);
    });

    it('payment mode Should return payment mode list', () => {
      const paymentModeList = paymentModeAdaptor.setAll(paymentModeListArray, {
        ...paymentModeAdaptor.getInitialState()
      });

      const state: PaymentConfigurationState = {
        ...initialState,
        paymentModes: paymentModeState
      };
      expect(selectors.paymentModes.projector(state)).toEqual(paymentModeList);
    });
    it('payment mode Should return payment mode list', () => {
      expect(
        selectors.PaymentConfigurationSelectors.selectPaymentModes.projector(
          paymentModeState
        )
      ).toEqual(paymentModeListArray);
    });
  });
});
