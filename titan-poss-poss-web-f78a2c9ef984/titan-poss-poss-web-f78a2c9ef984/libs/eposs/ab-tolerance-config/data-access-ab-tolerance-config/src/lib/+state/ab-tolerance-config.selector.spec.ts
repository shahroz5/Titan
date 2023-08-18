import {
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  CustomErrors
} from '@poss-web/shared/models';
import { AbToleranceConfigState } from './ab-tolerance-config.state';
import * as selectors from './ab-tolerance-config.selector';
import { initialState } from './ab-tolerance-config.reducer';

describe('ABToleranceConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing ABToleranceConfigState related Selectors', () => {
    it('selectAbToleranceConfigList Should return the config  list', () => {
      const configDetails: AbToleranceConfigResponse[] = [
        {
          ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      ];

      const state: AbToleranceConfigState = {
        ...initialState,
        abToleranceConfigList: configDetails
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectAbToleranceConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: AbToleranceConfigState = {
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
        selectors.AbToleranceConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpda Should return the true or false', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectConfig  Should return configId', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        configId: 10
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectConfigId.projector(state)
      ).toEqual(10);
    });

    it('selectIsCleared  ', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectIsCleared.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdate  ', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectRangeWeight  Should return total elements', () => {
      const rangeWeight: AbToleranceWeightRange[] = [
        {
          id: '1',
          range: '100-200',
          rowId: '1'
        }
      ];
      const state: AbToleranceConfigState = {
        ...initialState,
        rangeWeight: rangeWeight
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectResidualWeightRanges.projector(
          state
        )
      ).toEqual(rangeWeight);
    });

    it('selectRuleDetailsTotalCount  Should return total count of rules', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        ruleDetailsCount: 10
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectRuleDetailsTotalCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectUniqueNameCheckCount  Should return total count of rules', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        uniqueNameCheckCount: 10
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectUniqueNameCheckCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectMetalTypes  Should return total count of metal types', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        metalType: [{ materialTypeCode: 'J', description: 'GOLD' }]
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectMetalTypes.projector(state)
      ).toEqual([{ materialTypeCode: 'J', description: 'GOLD' }]);
    });
    it('selectToleranceConfigMapping', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        toleranceConfigMapping: null
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectToleranceConfigMapping.projector(
          state
        )
      ).toEqual(null);
    });
    it('selectAbToleranceConfig', () => {
      const state: AbToleranceConfigState = {
        ...initialState,
        abToleranceConfig: {
          ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      };
      expect(
        selectors.AbToleranceConfigSelectors.selectAbToleranceConfig.projector(
          state
        )
      ).toEqual({
        ruleType: 'ORDER_AB_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      });
    });
  });
});
