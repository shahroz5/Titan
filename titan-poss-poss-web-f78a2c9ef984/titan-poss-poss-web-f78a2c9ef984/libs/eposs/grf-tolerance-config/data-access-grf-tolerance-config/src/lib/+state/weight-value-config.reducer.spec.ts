//you should simply assert that you get the right state given the provided inputs.

import * as actions from './weight-value-config.actions';

import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigDetails,
  WeightValueConfigListingResult,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  RuleDetailsWeightValueConfig
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  WeightValueConfigReducer,
  initialState
} from './weight-value-config.reducer';
import { WeightValueConfigState } from './weight-value-config.state';

describe('WeightValueConfigReducer  Testing Suite', () => {
  const testState = initialState;
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
  describe('Testing LoadWeightValueConfigListing ', () => {
    beforeEach(() => {});
    it('Load LoadWeightValueConfigListing should set the isLoading to true', () => {
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadWeightValueConfigListing(payload);

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadWeightValueConfigListingSuccess should return list of weight value config', () => {
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const payload: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };

      const action = new actions.LoadWeightValueConfigListingSuccess(payload);

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigListing.length).toBe(0);
    });
    it('LoadWeightValueConfigListingFailure should return error', () => {
      const action = new actions.LoadWeightValueConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchWeightValueConfigListing ', () => {
    beforeEach(() => {});
    it('Load SearchWeightValueConfigListing should set the isLoading to true', () => {
      const payload = 'test';

      const action = new actions.SearchWeightValueConfigListing(payload);

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SearchWeightValueConfigListingSuccess should return weight value config', () => {
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const payload: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };

      const action = new actions.SearchWeightValueConfigListingSuccess(payload);

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigListing.length).toBe(0);
    });
    it('SearchWeightValueConfigListingFailure should return error', () => {
      const action = new actions.SearchWeightValueConfigListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('Load LoadWeightValueConfigDetails should set the isLoading to true', () => {
      const payload = 'test';

      const action = new actions.LoadWeightValueConfigDetails(payload);

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadWeightValueConfigDetailsSuccess should return config', () => {
      const action = new actions.LoadWeightValueConfigDetailsSuccess(
        weightValueConfigDetails
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(weightValueConfigDetails);
    });
    it('LoadWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.LoadWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('Load SaveWeightValueConfigDetails should set the isLoading to true', () => {
      const action = new actions.SaveWeightValueConfigDetails(
        weightValueConfigDetails
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveWeightValueConfigDetailsSuccess should return config', () => {
      const action = new actions.SaveWeightValueConfigDetailsSuccess(
        weightValueConfigDetails
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(weightValueConfigDetails);
    });
    it('SaveWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.SaveWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('Load EditWeightValueConfigDetails should set the isLoading to true', () => {
      const action = new actions.EditWeightValueConfigDetails(
        weightValueConfigDetails
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('EditWeightValueConfigDetailsSuccess should return config', () => {
      const action = new actions.EditWeightValueConfigDetailsSuccess(
        weightValueConfigDetails
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(weightValueConfigDetails);
    });
    it('EditWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.EditWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: WeightValueConfigState = WeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: WeightValueConfigState = WeightValueConfigReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
