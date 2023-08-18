import * as selectors from './grn-interboutique-config.selectors';

import { initialState } from './grn-interboutique-config.reducer';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  InstrumentType,
  PaymentCode,
  ProductGroupMappingOption,
  RedemptionType
} from '@poss-web/shared/models';

describe('GRN Interboutique Config Selector Testing Suite', () => {
  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: GrnInterboutiqueConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.GrnInterboutiqueConfigSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectEditGrnInterboutiqueConfigResponses Related Selectors', () => {
    it('should return selectEditGrnInterboutiqueConfigResponses Selector', () => {
      const payload = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const state: GrnInterboutiqueConfigState = {
        ...initialState,
        editGrnInterboutiqueConfigResponses: payload
      };
      expect(
        selectors.GrnInterboutiqueConfigSelectors.selectEditGrnInterboutiqueConfigResponses.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectGrnInterboutiqueConfigDetails Related Selectors', () => {
    it('should return selectGrnInterboutiqueConfigDetails Selector', () => {
      const payload = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const state: GrnInterboutiqueConfigState = {
        ...initialState,
        grnInterboutiqueConfigDetails: payload
      };
      expect(
        selectors.GrnInterboutiqueConfigSelectors.selectGrnInterboutiqueConfigDetails.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: GrnInterboutiqueConfigState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.GrnInterboutiqueConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
