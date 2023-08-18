import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  RuleDetailsWeightValueConfig,
  WeightValueConfigDetails,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import {
  GRNWeightValueConfigActionTypes,
  LoadWeightValueConfigListing,
  LoadWeightValueConfigListingSuccess,
  LoadWeightValueConfigListingFailure,
  SearchWeightValueConfigListing,
  SearchWeightValueConfigListingFailure,
  SearchWeightValueConfigListingSuccess,
  LoadWeightValueConfigDetails,
  LoadWeightValueConfigDetailsSuccess,
  LoadWeightValueConfigDetailsFailure,
  SaveWeightValueConfigDetails,
  SaveWeightValueConfigDetailsSuccess,
  SaveWeightValueConfigDetailsFailure,
  EditWeightValueConfigDetails,
  EditWeightValueConfigDetailsSuccess,
  EditWeightValueConfigDetailsFailure,
  LoadMappedLocationsCount,
  LoadMappedLocationsCountSuccess,
  LoadMappedLocationsCountFailure,
  LoadReset
} from './weight-value-config.actions';
describe('WeightValueConfigActions  Action Testing Suite', () => {
  describe('LoadWeightValueConfigListing Action Test Cases', () => {
    it('should check correct type is used for  LoadWeightValueConfigListing action ', () => {
      const payload: LoadWeightValueConfigListingPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadWeightValueConfigListing(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadWeightValueConfigListingSuccess action ', () => {
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const payload: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };
      const action = new LoadWeightValueConfigListingSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadWeightValueConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWeightValueConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchWeightValueConfigListing Action Test Cases', () => {
    it('should check correct type is used for  SearchWeightValueConfigListing action ', () => {
      const payload = 'test';
      const action = new SearchWeightValueConfigListing(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING,
        payload
      });
    });
    it('should check correct type is used for SearchWeightValueConfigListingSuccess action ', () => {
      const weightValueConfigListing: WeightValueConfigDetails[] = [];
      const payload: WeightValueConfigListingResult = {
        results: weightValueConfigListing,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 10,
        totalElements: 1
      };

      const action = new SearchWeightValueConfigListingSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchWeightValueConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchWeightValueConfigListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadWeightValueConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadWeightValueConfigDetails action ', () => {
      const payload = 'test';
      const action = new LoadWeightValueConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for LoadWeightValueConfigDetailsSuccess action ', () => {
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

      const action = new LoadWeightValueConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadWeightValueConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWeightValueConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveWeightValueConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveWeightValueConfigDetails action ', () => {
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

      const action = new SaveWeightValueConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchWeightValueConfigListingSuccess action ', () => {
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

      const action = new SaveWeightValueConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchWeightValueConfigListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveWeightValueConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditWeightValueConfigDetails Action Test Cases', () => {
    it('should check correct type is used for  EditWeightValueConfigDetails action ', () => {
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

      const action = new EditWeightValueConfigDetails(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditWeightValueConfigDetailsSuccess action ', () => {
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

      const action = new EditWeightValueConfigDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditWeightValueConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditWeightValueConfigDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadMappedLocationsCount  Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedLocationsCount  action ', () => {
      const payload = '1';
      const action = new LoadMappedLocationsCount(payload);
      expect({ ...action }).toEqual({
        type: GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadMappedLocationsCountSuccess action ', () => {
      const payload = 1;

      const action = new LoadMappedLocationsCountSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedLocationsCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedLocationsCountFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset  Test Cases', () => {
    it('should check correct type is used for  LoadReset  action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type:
          GRNWeightValueConfigActionTypes.LOAD_RESET
      });
    });
  });
});
