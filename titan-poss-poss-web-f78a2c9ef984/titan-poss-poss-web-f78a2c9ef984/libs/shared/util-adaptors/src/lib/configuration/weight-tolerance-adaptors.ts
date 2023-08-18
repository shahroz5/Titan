import {
  WeightToleranceResponse,
  SelectedLocation,
  WeightToleranceList,
  ConfigDetails,
  ActiveConfigs,
  ActiveConfig,
  WeightRange,
  WeightTolerance
} from '@poss-web/shared/models';

export class WeightToleranceAdaptor {
  static getMappedLocations(data: any) {
    const selectedLocations: { id: string; description: string }[] = [];

    for (const locations of data) {
      selectedLocations.push({
        id: locations,
        description: locations
      });
    }

    return selectedLocations;
  }

  static getSearchConfigDetailsByConfigIdData(data) {
    let configDetailsList;
    const configDetails = [];

    configDetails.push({
      configId: data.configId,
      configType: data.configType,
      description: data.description,
      productCategoryCode: data.productCategoryCode,
      orgCode: data.orgCode,
      isActive: data.isActive
    });
    let totalElements;
    if (data) {
      totalElements = 1;
    } else {
      totalElements = 0;
    }
    configDetailsList = {
      configDetails: configDetails,
      totalConfigDetails: totalElements
    };
    return configDetailsList;
  }

  static getConfigDetailsListData(data: any): WeightToleranceList {
    const configDetalis: ConfigDetails[] = [];
    let configDetailsList;
    for (const configData of data.results) {
      configDetalis.push({
        configId: configData.ruleId,
        configName: configData.description,
        configType: configData.configType,
        isActive: configData.isActive
      });
    }
    configDetailsList = {
      configList: configDetalis,
      totalElements: data.totalElements
    };
    return configDetailsList;
  }
  static getSelectedConfigData(data: any): ConfigDetails {
    let configData;
    configData = {
      configId: data.configId,
      configName: data.description,
      configType: data.configType,
      isActive: data.isActive
    };

    return configData;
  }

  static getWeightTolerance(data: any): WeightToleranceResponse {
    const weightTolerance: WeightTolerance[] = [];

    if (data.results && data.results.length) {
      for (const result of data.results) {
        for (const rule of result.rules) {
          weightTolerance.push({
            rangeId: rule.rangeId,
            productGroupCode: rule.productGroupCode,
            tolerance: rule.ruleDetails.data.weightTolGrams,
            id: rule.id
          });
        }
      }

      return {
        weightTolerance: weightTolerance,
        totalElements: data.totalElements
      };
    }
  }

  static getUpdatedTolerance(data: any) {
    let updatedToleranceData;
    updatedToleranceData = {
      configProductId: data.id,
      newTolerance: data
    };

    return updatedToleranceData;
  }
  static getRangeWeight(data: any): WeightRange[] {
    const rangeWeight: WeightRange[] = [];
    for (const rangeWeightData of data.results) {
      rangeWeight.push({
        range: rangeWeightData.fromRange + '-' + rangeWeightData.toRange,
        id: rangeWeightData.id,
        rowId: rangeWeightData.rowId
      });
    }

    return rangeWeight;
  }

  static getSelectedLocations(data: any): SelectedLocation[] {
    const selectedLocations: SelectedLocation[] = [];
    for (const locations of data.results) {
      selectedLocations.push({
        id: locations.locationCode,
        description: locations.locationCode
      });
    }

    return selectedLocations;
  }

  static getActiveConfigs(data: any): ActiveConfigs[] {
    const activeConfigs: ActiveConfig[] = [];
    if (data) {
      for (const activeConfig of data.error.errorCause) {
        activeConfigs.push({
          configId: activeConfig.configId,
          locationCode: activeConfig.locationCode,
          configName: activeConfig.configName
        });
      }
    }

    return activeConfigs;
  }
}
