import {
  CPGProductGroupConfigForQCGCListingResult,
  WeightValueConfigListingResult,
  WeightValueConfigDetails,
  RuleDetailsWeightValueConfig,
  DataWeightValueConfig,
  BasedWeightValueConfig,
  ConfigTypeEnum
} from '@poss-web/shared/models';

export class WeightValueConfigAdaptor {
  static getWeightValueConfigListing(
    dataObj: any
  ): WeightValueConfigListingResult {
    const weightValueConfigListing: WeightValueConfigDetails[] = [];
    for (const listItem of dataObj.results) {
      const weightBased: BasedWeightValueConfig[] = [];
      const valueBased: BasedWeightValueConfig[] = [];

      console.log(
        'Log: WeightValueConfigAdaptor -> getWeightValueConfigListing -> listItem.ruleDetails.',
        listItem.ruleDetails
      );
      if (listItem.ruleDetails.data.weightBased) {
        for (const valueBasedItem of listItem.ruleDetails.data.weightBased) {
          weightBased.push({
            rowId: valueBasedItem.rowId,
            fromRange: valueBasedItem.fromRange,
            toRange: valueBasedItem.toRange,
            toleranceAllowed: valueBasedItem.toleranceAllowed,
            tolerancePercent: valueBasedItem.tolerancePercent,
            toleranceValue: valueBasedItem.toleranceValue
          });
        }
      }

      if (listItem.ruleDetails.data.valueBased) {
        for (const valueBasedItem of listItem.ruleDetails.data.valueBased) {
          valueBased.push({
            rowId: valueBasedItem.rowId,
            fromRange: valueBasedItem.fromRange,
            toRange: valueBasedItem.toRange,
            toleranceAllowed: valueBasedItem.toleranceAllowed,
            tolerancePercent: valueBasedItem.tolerancePercent,
            toleranceValue: valueBasedItem.toleranceValue
          });
        }
      }

      const data: DataWeightValueConfig = {
        weightBased,
        valueBased
      };
      const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
        type: listItem.ruleDetails.type,
        data
      };
      weightValueConfigListing.push({
        ruleId: listItem.ruleId,
        description: listItem.description,
        isActive: listItem.isActive,
        ruleDetails: ruleDetailsWeightValueConfig,
        ruleType: listItem.ruleType
      });
    }

    const weightValueConfigListingResult: WeightValueConfigListingResult = {
      results: weightValueConfigListing,
      pageNumber: dataObj.pageNumber,
      pageSize: dataObj.pageSize,
      totalPages: dataObj.totalPages,
      totalElements: dataObj.totalElements
    };

    return weightValueConfigListingResult;
  }

  static getWeightValueConfigDetails(dataObj: any): WeightValueConfigDetails {
    const weightBased: BasedWeightValueConfig[] = [];
    const valueBased: BasedWeightValueConfig[] = [];
    if (dataObj.ruleDetails) {
      for (const valueBasedItem of dataObj.ruleDetails.data.weightBased) {
        weightBased.push({
          rowId: valueBasedItem.rowId.toString(),
          fromRange: valueBasedItem.fromRange,
          toRange: valueBasedItem.toRange,
          toleranceAllowed: valueBasedItem.toleranceAllowed,
          tolerancePercent: valueBasedItem.tolerancePercent,
          toleranceValue: valueBasedItem.toleranceValue
        });
      }
      for (const valueBasedItem of dataObj.ruleDetails.data.valueBased) {
        valueBased.push({
          rowId: valueBasedItem.rowId.toString(),
          fromRange: valueBasedItem.fromRange,
          toRange: valueBasedItem.toRange,
          toleranceAllowed: valueBasedItem.toleranceAllowed,
          tolerancePercent: valueBasedItem.tolerancePercent,
          toleranceValue: valueBasedItem.toleranceValue
        });
      }
    }
    const data: DataWeightValueConfig = {
      weightBased,
      valueBased
    };

    const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
      type: dataObj?.ruleDetails?.type,
      data
    };

    const weightValueConfigDetails: WeightValueConfigDetails = {
      ruleDetails: ruleDetailsWeightValueConfig,
      description: dataObj.description,
      ruleId: dataObj.ruleId,
      ruleType: dataObj.ruleType,
      isActive: dataObj.isActive
    };

    return weightValueConfigDetails;
  }

  static getWeightValueConfigDetailsNew(): WeightValueConfigDetails {
    const weightValueConfigDetails: WeightValueConfigDetails = {
      isActive: true,
      description: '',
      ruleId: null,
      ruleType: 'GRF_CONFIGURATION',
      ruleDetails: {
        type: 'GRF_CONFIGURATION',
        data: {
          valueBased: [],
          weightBased: []
        }
      }
    };

    return weightValueConfigDetails;
  }

  static getGRNWeightValueConfigDetailsNew(): WeightValueConfigDetails {
    const weightValueConfigDetails: WeightValueConfigDetails = {
      isActive: true,
      description: '',
      ruleId: null,
      ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
      ruleDetails: {
        type: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
        data: {
          valueBased: [
            {
              rowId: '1',
              fromRange: '',
              toRange: '',
              tolerancePercent: ''
            }
          ],
          weightBased: [
            {
              rowId: '1',
              fromRange: '',
              toRange: '',
              toleranceValue: ''
            }
          ]
        }
      }
    };

    return weightValueConfigDetails;
  }
}
