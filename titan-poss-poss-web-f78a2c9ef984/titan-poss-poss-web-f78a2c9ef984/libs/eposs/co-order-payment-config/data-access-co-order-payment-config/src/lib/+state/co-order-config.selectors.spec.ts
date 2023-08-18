import {
  CustomErrors,
  CoOrderPaymentConfigPayload
} from '@poss-web/shared/models';
import { initialState } from './co-order-config.reducer';
import { CoOrderPaymentConfigState } from './co-order-config.state';
import * as selectors from './co-order-config.selectors';

describe('CoOrderPaymentConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing CoOrderPaymentConfigState related Selectors', () => {
    it('selectCoOrderPaymentConfigList Should return the config  list', () => {
      const configDetails: CoOrderPaymentConfigPayload[] = [
        {
          description: 'config test',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'AB_ORDER_PAYMENT_CONFIG'
        }
      ];

      const state: CoOrderPaymentConfigState = {
        ...initialState,
        orderConfigList: configDetails
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });
    it('selectCoOrderPaymentConfig Should return the config  list', () => {
      const configDetails: CoOrderPaymentConfigPayload = {
        description: 'config test',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'AB_ORDER_PAYMENT_CONFIG'
      };
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        orderConfig: configDetails
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfig.projector(
          state
        )
      ).toEqual(configDetails);
    });
    it('selectError Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
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
        selectors.selectCoOrderPaymentConfigSelectors.selectError.projector(
          state
        )
      ).toEqual(error);
    });
    it('selectIsLoading Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectHassaved Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectHassaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectIsUpdated Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        IsUpdated: true
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectIsUpdated.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectTotalElement Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectTotalElement.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectProductGroups Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        productGroups: [
          {
            description: 'PLAIN GOLD',
            productGroupCode: '71'
          }
        ]
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectProductGroups.projector(
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
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        configId: null
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectConfigId.projector(
          state
        )
      ).toEqual(null);
    });
    it('selectIsCleared Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectIsCleared.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectCoOrderPaymentConfigDetails Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        orderPaymentConfigDetails: []
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectCoOrderPaymentConfigDetails.projector(
          state
        )
      ).toEqual([]);
    });
    it('selectRuleDetailsCount Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        ruleDetailsCount: 10
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectRuleDetailsCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectAllRuleDetails Should return the config  list', () => {
      const state: CoOrderPaymentConfigState = {
        ...initialState,
        allCoOrderPaymentConfigDetails: []
      };
      expect(
        selectors.selectCoOrderPaymentConfigSelectors.selectAllRuleDetails.projector(
          state
        )
      ).toEqual([]);
    });
  });
});
