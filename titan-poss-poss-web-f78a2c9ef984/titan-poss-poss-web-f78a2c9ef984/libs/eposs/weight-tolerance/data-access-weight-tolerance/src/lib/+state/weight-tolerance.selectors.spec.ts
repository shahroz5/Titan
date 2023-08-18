// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  ConfigDetails,
  WeightToleranceResponse,
  WeightRange,
  ProductGroup,
  WeightTolerance
} from '@poss-web/shared/models';

import { initialState } from './weight-tolerance.reducer';
import * as selectors from './weight-tolerance.selectors';

import { WeightToleranceState } from './weight-tolerances.state';

describe('WeightToleranceState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing WeightToleranceState related Selectors', () => {
    it('selectConfigList Should return the config  list', () => {
      const configDetails: ConfigDetails[] = [
        {
          configName: 'weight tolerance config'
        }
      ];

      const state: WeightToleranceState = {
        ...initialState,
        configList: configDetails
      };
      expect(
        selectors.weightToleranceSelectors.selectConfigList.projector(state)
      ).toEqual(configDetails);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: WeightToleranceState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.weightToleranceSelectors.selectisLoading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: WeightToleranceState = {
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
        selectors.weightToleranceSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: WeightToleranceState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.weightToleranceSelectors.selecthasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: WeightToleranceState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.weightToleranceSelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });
    it('selectConfigDetailsByconfigId ', () => {
      const configDetails: ConfigDetails = {
        configName: 'weight tolerance config'
      };

      const state: WeightToleranceState = {
        ...initialState,
        selectedConfigIdDetails: configDetails
      };
      expect(
        selectors.weightToleranceSelectors.selectConfigDetailsByconfigId.projector(
          state
        )
      ).toEqual(configDetails);
    });

    it('selectWeightTolerance  Should return total elements', () => {
      const weightTolerance: WeightTolerance[] = [
        {
          tolerance: '0.03',
          range: '100-200',
          productGroupCode: '76',
          id: ['1']
        }
      ];
      const state: WeightToleranceState = {
        ...initialState,
        weightTolerance: weightTolerance
      };
      expect(
        selectors.weightToleranceSelectors.selectWeightTolerance.projector(
          state
        )
      ).toEqual(weightTolerance);
    });

    it('selectRangeWeight  Should return total elements', () => {
      const rangeWeight: WeightRange[] = [
        {
          id: '1',
          range: '100-200',
          rowId: '1'
        }
      ];
      const state: WeightToleranceState = {
        ...initialState,
        rangeWeight: rangeWeight
      };
      expect(
        selectors.weightToleranceSelectors.selectRangeWeight.projector(state)
      ).toEqual(rangeWeight);
    });

    it('selectConfigId  ', () => {
      const state: WeightToleranceState = {
        ...initialState,
        configId: '10'
      };
      expect(
        selectors.weightToleranceSelectors.selectConfigId.projector(state)
      ).toEqual('10');
    });

    it('selectIsCleared  ', () => {
      const state: WeightToleranceState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.weightToleranceSelectors.selectIsCleared.projector(state)
      ).toEqual(true);
    });

    it('selectProductGroups  ', () => {
      const productGroup: ProductGroup[] = [
        {
          description: 'gold coin',
          productGroupCode: '76'
        }
      ];

      const state: WeightToleranceState = {
        ...initialState,
        productGroups: productGroup
      };
      expect(
        selectors.weightToleranceSelectors.selectProductGroups.projector(state)
      ).toEqual(productGroup);
    });
  });
});
