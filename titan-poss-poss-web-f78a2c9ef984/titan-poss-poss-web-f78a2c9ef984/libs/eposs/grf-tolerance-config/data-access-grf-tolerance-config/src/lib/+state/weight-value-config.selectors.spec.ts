// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  WeightValueConfigDetails,
  RuleDetailsWeightValueConfig,
  BasedWeightValueConfig,
  DataWeightValueConfig
} from '@poss-web/shared/models';

import { initialState } from './weight-value-config.reducer';
import * as selectors from './weight-value-config.selectors';

import { WeightValueConfigState } from './weight-value-config.state';

describe('WeightValueConfigState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  const weightBased: BasedWeightValueConfig[] = [
    {
      rowId: '1',
      fromRange: '100',
      toRange: '200',
      toleranceAllowed: '1',
      tolerancePercent: '1',
      toleranceValue: '1'
    }
  ];
  const valueBased: BasedWeightValueConfig[] = [
    {
      rowId: '1',
      fromRange: '100',
      toRange: '200',
      toleranceAllowed: '1',
      tolerancePercent: '1',
      toleranceValue: '1'
    }
  ];
  const data: DataWeightValueConfig = {
    weightBased,
    valueBased
  };

  const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
    type: 'GRF_CONFIGURATION',
    data
  };

  const weightValueConfigDetails: WeightValueConfigDetails = {
    ruleDetails: ruleDetailsWeightValueConfig,
    description: 'description',
    ruleId: 1,
    ruleType: 'GRF_CONFIGURATION',
    isActive: true
  };

  describe('Testing WeightValueConfigState related Selectors', () => {
    it('selectWeightValueConfigListing Should return the weight value config list', () => {
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const state: WeightValueConfigState = {
        ...initialState,
        weightValueConfigListing: weightValueConfigListing
      };
      expect(
        selectors.WeightValueConfigSelectors.selectWeightValueConfigListing.projector(
          state
        )
      ).toEqual(weightValueConfigListing);
    });

    it('selectIsLoading Should return the true or false', () => {
      const state: WeightValueConfigState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.WeightValueConfigSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectWeightValueConfigDetails Should return the weightValueConfigDetails', () => {
      const state: WeightValueConfigState = {
        ...initialState,
        weightValueConfigDetails: weightValueConfigDetails
      };
      expect(
        selectors.WeightValueConfigSelectors.selectWeightValueConfigDetails.projector(
          state
        )
      ).toEqual(weightValueConfigDetails);
    });

    it('selectWeightValueConfigDetailsSaved Should return the weightValueConfigDetails', () => {
      const state: WeightValueConfigState = {
        ...initialState,
        weightValueConfigDetailsSaved: weightValueConfigDetails
      };
      expect(
        selectors.WeightValueConfigSelectors.selectWeightValueConfigDetailsSaved.projector(
          state
        )
      ).toEqual(weightValueConfigDetails);
    });

    it('selectWeightValueConfigDetailsEdited Should return the weightValueConfigDetails', () => {
      const state: WeightValueConfigState = {
        ...initialState,
        weightValueConfigDetailsEdited: weightValueConfigDetails
      };
      expect(
        selectors.WeightValueConfigSelectors.selectWeightValueConfigDetailsEdited.projector(
          state
        )
      ).toEqual(weightValueConfigDetails);
    });
    it('selectError Should return the error object', () => {
      const state: WeightValueConfigState = {
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
        selectors.WeightValueConfigSelectors.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectWeightValueConfigTotal  Should return total elements', () => {
      const state: WeightValueConfigState = {
        ...initialState,
        totalWeightValueConfig: 10
      };
      expect(
        selectors.WeightValueConfigSelectors.selectWeightValueConfigTotal.projector(
          state
        )
      ).toEqual(10);
    });
  });
});
