//you should simply assert that you get the right state given the provided inputs.

import * as actions from './weight-value-config.actions';

import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigDetails,
  WeightValueConfigListingResult,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  RuleDetailsWeightValueConfig,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GRNWeightValueConfigReducer,
  initialState
} from './weight-value-config.reducer';
import { GRNWeightValueConfigState } from './weight-value-config.state';

describe('GRNWeightValueConfigReducer  Testing Suite', () => {
  const testState = initialState;

  it('should return the initial state', () => {
    const action: any = {};
    const state: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
      undefined,
      action
    );

    expect(state).toBe(testState);
  });

  describe('Testing LoadWeightValueConfigListing ', () => {
    beforeEach(() => {});
    it('LoadWeightValueConfigListing should set the isLoading to true', () => {
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadWeightValueConfigListing(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
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

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
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

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchWeightValueConfigListing ', () => {
    beforeEach(() => {});
    it('SearchWeightValueConfigListing should set the isLoading to true', () => {
      const payload = 'test';

      const action = new actions.SearchWeightValueConfigListing(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
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

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
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

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('LoadWeightValueConfigDetails should set the isLoading to true', () => {
      const payload = 'test';

      const action = new actions.LoadWeightValueConfigDetails(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadWeightValueConfigDetailsSuccess should return config', () => {
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
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };
      const action = new actions.LoadWeightValueConfigDetailsSuccess(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(payload);
    });
    it('LoadWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.LoadWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('SaveWeightValueConfigDetails should set the isLoading to true', () => {
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
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new actions.SaveWeightValueConfigDetails(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveWeightValueConfigDetailsSuccess should return config', () => {
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
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };
      const action = new actions.SaveWeightValueConfigDetailsSuccess(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(payload);
    });
    it('SaveWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.SaveWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditWeightValueConfigDetails ', () => {
    beforeEach(() => {});
    it('EditWeightValueConfigDetails should set the isLoading to true', () => {
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
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };

      const action = new actions.EditWeightValueConfigDetails(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('EditWeightValueConfigDetailsSuccess should return config', () => {
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
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data
      };

      const payload: WeightValueConfigDetails = {
        ruleDetails: ruleDetailsWeightValueConfig,
        description: 'description',
        ruleId: 1,
        ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        isActive: true
      };
      const action = new actions.EditWeightValueConfigDetailsSuccess(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.weightValueConfigDetails).toEqual(payload);
    });
    it('EditWeightValueConfigDetailsFailure should return error', () => {
      const action = new actions.EditWeightValueConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMappedLocationsCount  ', () => {
    beforeEach(() => {});
    it('LoadMappedLocationsCount  should set the isLoading to true', () => {
      const payload = 'test';

      const action = new actions.LoadMappedLocationsCount(payload);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMappedLocationsCountSuccess should return config', () => {
      const action = new actions.LoadMappedLocationsCountSuccess(1);

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.mappedLocationsCount).toEqual(1);
    });
    it('LoadMappedLocationsCountFailure should return error', () => {
      const action = new actions.LoadMappedLocationsCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );

      expect(result.mappedLocationsCount).toEqual(0);
    });
  });

  describe('Testing Reset Functionality', () => {
    it('LoadReset  should be called', () => {
      const action = new actions.LoadReset();
      const result: GRNWeightValueConfigState = GRNWeightValueConfigReducer(
        testState,
        action
      );
      expect(result.error).toEqual(null);
    });
  });
});
