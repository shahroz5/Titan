import {
  CoToleranceConfigResponse,
  CoToleranceWeightRange,
  CustomErrors
} from '@poss-web/shared/models';
import { CoToleranceConfigState } from './co-tolerance-config.state';
import * as selectors from './co-tolerance-config.selector';
import { initialState } from './co-tolerance-config.reducer';

describe('COToleranceConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing COToleranceConfigState related Selectors', () => {
    it('selectCoToleranceConfigList Should return the config  list', () => {
      const configDetails: CoToleranceConfigResponse[] = [
        {
          ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      ];

      const state: CoToleranceConfigState = {
        ...initialState,
        coToleranceConfigList: configDetails
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectCoToleranceConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: CoToleranceConfigState = {
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
        selectors.CoToleranceConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpda Should return the true or false', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectConfig  Should return configId', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        configId: 10
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectConfigId.projector(state)
      ).toEqual(10);
    });

    it('selectIsCleared  ', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectIsCleared.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdate  ', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectHasUpdated.projector(state)
      ).toEqual(true);
    });

    it('selectRangeWeight  Should return total elements', () => {
      const rangeWeight: CoToleranceWeightRange[] = [
        {
          id: '1',
          range: '100-200',
          rowId: '1'
        }
      ];
      const state: CoToleranceConfigState = {
        ...initialState,
        rangeWeight: rangeWeight
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectResidualWeightRanges.projector(
          state
        )
      ).toEqual(rangeWeight);
    });

    it('selectRuleDetailsTotalCount  Should return total count of rules', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        ruleDetailsCount: 10
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectRuleDetailsTotalCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectUniqueNameCheckCount  Should return total count of rules', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        uniqueNameCheckCount: 10
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectUniqueNameCheckCount.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectMetalTypes  Should return total count of metal types', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        metalType: [{ materialTypeCode: 'J', description: 'GOLD' }]
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectMetalTypes.projector(state)
      ).toEqual([{ materialTypeCode: 'J', description: 'GOLD' }]);
    });
    it('selectToleranceConfigMapping', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        toleranceConfigMapping: null
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectToleranceConfigMapping.projector(
          state
        )
      ).toEqual(null);
    });
    it('selectCoToleranceConfig', () => {
      const state: CoToleranceConfigState = {
        ...initialState,
        coToleranceConfig: {
          ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      };
      expect(
        selectors.CoToleranceConfigSelectors.selectCoToleranceConfig.projector(
          state
        )
      ).toEqual({
        ruleType: 'ORDER_CO_FROZEN_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      });
    });
  });
});
