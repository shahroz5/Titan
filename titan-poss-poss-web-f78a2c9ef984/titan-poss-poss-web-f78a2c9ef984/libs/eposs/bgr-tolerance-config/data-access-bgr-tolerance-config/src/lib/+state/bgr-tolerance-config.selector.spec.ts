import {
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  CustomErrors
} from '@poss-web/shared/models';
import { BgrToleranceConfigState } from './bgr-tolerance-config.state';
import * as selectors from './bgr-tolerance-config.selector';
import { initialState } from './bgr-tolerance-config.reducer';

describe('BgrToleranceConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing BgrToleranceConfigState related Selectors', () => {
    it('selectBgrToleranceConfigList Should return the config  list', () => {
      const configDetails: AbToleranceConfigResponse[] = [
        {
          ruleType: 'ORDER_BGR_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      ];

      const state: BgrToleranceConfigState = {
        ...initialState,
        bgrToleranceConfigList: configDetails
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectBgrToleranceConfigList.projector(
          state
        )
      ).toEqual(configDetails);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: BgrToleranceConfigState = {
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
        selectors.BgrToleranceConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpda Should return the true or false', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
    it('selectConfig  Should return configId', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        configId: '10'
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectConfigId.projector(state)
      ).toEqual('10');
    });

    it('selectIsCleared  ', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectIsCleared.projector(state)
      ).toEqual(true);
    });
    it('selectHasUpdate  ', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectHasUpdated.projector(state)
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
      const state: BgrToleranceConfigState = {
        ...initialState,
        rangeWeight: rangeWeight
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectResidualWeightRanges.projector(
          state
        )
      ).toEqual(rangeWeight);
    });

    it('selectMetalTypes  Should return total count of metal types', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        metalType: [{ materialTypeCode: 'J', description: 'GOLD' }]
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectMetalTypes.projector(state)
      ).toEqual([{ materialTypeCode: 'J', description: 'GOLD' }]);
    });
    it('selectToleranceConfigMapping', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        toleranceConfigMapping: null
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectToleranceConfigMapping.projector(
          state
        )
      ).toEqual(null);
    });
    it('selectBgrToleranceConfig', () => {
      const state: BgrToleranceConfigState = {
        ...initialState,
        bgrToleranceConfig: {
          ruleType: 'ORDER_BGR_TOLERANCE',
          ruleId: 1,
          description: 'testconfig',
          isActive: true
        }
      };
      expect(
        selectors.BgrToleranceConfigSelectors.selectBgrToleranceConfig.projector(
          state
        )
      ).toEqual({
        ruleType: 'ORDER_BGR_TOLERANCE',
        ruleId: 1,
        description: 'testconfig',
        isActive: true
      });
    });
  });
});
