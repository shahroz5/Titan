import {
  CustomErrors,
  OrderPaymentConfigPayload
} from '@poss-web/shared/models';
import { initialState } from './order-config.reducer';
import { OrderPaymentConfigState } from './order-config.state';
import * as selectors from './order-config.selectors';

describe('OrderPaymentConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing OrderPaymentConfigState related Selectors', () => {
    it('selectOrderPaymentConfigList Should return the config  list', () => {
      const configDetails: OrderPaymentConfigPayload[] = [
        {
          description: 'config test',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'AB_ORDER_PAYMENT_CONFIG'
        }
      ];

      const state: OrderPaymentConfigState = {
        ...initialState,
        orderConfigList: configDetails
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectOrderPaymentConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });
    it('selectOrderPaymentConfig Should return the config  list', () => {
      const configDetails: OrderPaymentConfigPayload = {
        description: 'config test',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'AB_ORDER_PAYMENT_CONFIG'
      };
      const state: OrderPaymentConfigState = {
        ...initialState,
        orderConfig: configDetails
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectOrderPaymentConfig.projector(
          state
        )
      ).toEqual(configDetails);
    });
    it('selectError Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
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
        selectors.selectOrderPaymentConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectIsLoading Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectHassaved Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectHassaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectIsUpdated Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        IsUpdated: true
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectIsUpdated.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectTotalElement Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectTotalElement.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectProductGroups Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        productGroups: [
          {
            description: 'PLAIN GOLD',
            productGroupCode: '71'
          }
        ]
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectProductGroups.projector(
          state
        )
      ).toEqual([
        {
          description: 'PLAIN GOLD',
          productGroupCode: '71'
        }
      ]);
    });
    it('selectConfigId Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        configId: null
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectConfigId.projector(
          state
        )
      ).toEqual(null);
    });
    it('selectIsCleared Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectIsCleared.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectOrderPaymentConfigDetails Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        orderPaymentConfigDetails: []
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectOrderPaymentConfigDetails.projector(
          state
        )
      ).toEqual([]);
    });
    it('selectRuleDetailsCount Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        ruleDetailsCount: 10
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectRuleDetailsCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectAllRuleDetails Should return the config  list', () => {
      const state: OrderPaymentConfigState = {
        ...initialState,
        allOrderPaymentConfigDetails: []
      };
      expect(
        selectors.selectOrderPaymentConfigSelectors.selectAllRuleDetails.projector(
          state
        )
      ).toEqual([]);
    });
  });
});
