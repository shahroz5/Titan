import {
  CustomErrors,
  ResidualWeightConfigResponse,
  WeightToleranceList
} from '@poss-web/shared/models';
import { ResidualWeightConfigState } from './residual-weight-config.state';
import { initialState } from './residual-weight-config.reducer';
import * as selectors from './residual-weight-config.selector';
describe('ResidualWeightConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing ResidualWeightConfigState related Selectors', () => {
    it('selectResidualWeightConfigList Should return the config  list', () => {
      const configDetails: ResidualWeightConfigResponse[] = [
        { description: 'configtest', isActive: true, ruleId: 111111 }
      ];
      const state: ResidualWeightConfigState = {
        ...initialState,
        residualWeightConfigList: configDetails
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectResidualWeightConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });
    it('selectResidualWeightConfig Should return the config', () => {
      const configDetails: ResidualWeightConfigResponse = {
        description: 'configtest',
        isActive: true,
        ruleId: 111111
      };
      const state: ResidualWeightConfigState = {
        ...initialState,
        residualWeightConfig: configDetails
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectResidualWeightConfig.projector(
          state
        )
      ).toEqual(configDetails);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectTotalElements Should return count', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectError Should return the error', () => {
      const state: ResidualWeightConfigState = {
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
        selectors.ResidualWeightConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectHasSaved Should return true or false', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdated Should return true or false', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectHasUpdated.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectRangeMapping Should return mapped object', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        rangeMapping: [
          {
            ruleId: 1,
            ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
            rules: [
              {
                id: '123456',
                rangeId: '22222222',
                ruleDetails: {
                  data: null,
                  type: 'AB_RESIDUAL_TOLERANCE_CONFIG'
                }
              }
            ]
          }
        ]
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectRangeMapping.projector(
          state
        )
      ).toEqual([
        {
          ruleId: 1,
          ruleType: 'AB_RESIDUAL_TOLERANCE_CONFIG',
          rules: [
            {
              id: '123456',
              rangeId: '22222222',
              ruleDetails: {
                data: null,
                type: 'AB_RESIDUAL_TOLERANCE_CONFIG'
              }
            }
          ]
        }
      ]);
    });
    it('selectConfigId Should return mapped object', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        configId: {
          description: 'configtest',
          isActive: true,
          ruleDetails: null,
          ruleId: 2,
          ruleType: 'AB_RESIDUALTOLERANCE_CONFIG'
        }
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectConfigId.projector(state)
      ).toEqual({
        description: 'configtest',
        isActive: true,
        ruleDetails: null,
        ruleId: 2,
        ruleType: 'AB_RESIDUALTOLERANCE_CONFIG'
      });
    });
    it('selectIsCleared Should return true or false', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectIsCleared.projector(state)
      ).toEqual(true);
    });
    it('selectRuleDetailsCount Should return count', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        ruleDetailsCount: 10
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectRuleDetailsCount.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectResidualWeightRanges Should return mapped object', () => {
      const state: ResidualWeightConfigState = {
        ...initialState,
        rangeWeight: [
          {
            id: '1111',
            range: '1-10',
            rowId: '2'
          }
        ]
      };
      expect(
        selectors.ResidualWeightConfigSelectors.selectResidualWeightRanges.projector(
          state
        )
      ).toEqual([
        {
          id: '1111',
          range: '1-10',
          rowId: '2'
        }
      ]);
    });
  });
});
