import {
  ActiveConfig,
  SelectedLocation,
  ActiveConfigs,
  CnValidationList,
  CnValidationResponse,
  CnTypeList
} from '@poss-web/shared/models';

export class CnValidationAdaptor {
  static getCnValidationList(data: any): CnValidationList {
    let cnValidationList: CnValidationList;
    let totalElements;
    const cnValidations: CnValidationResponse[] = [];
    for (const cnValidation of data.results) {
      cnValidations.push({
        ruleId: cnValidation.ruleId,
        ruleType: cnValidation.ruleType,
        description: cnValidation.description,
        isActive: cnValidation.isActive,
        isCancellationAllowed: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.isCancellationAllowed
                ? cnValidation.ruleDetails.data.isCancellationAllowed
                : false
              : false
            : false
          : false,
        deductionRate: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.deductionRate
                ? cnValidation.ruleDetails.data.deductionRate
                : ''
              : ''
            : ''
          : '',
        criteriaRateForDeduction: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.criteriaRateForDeduction
                ? cnValidation.ruleDetails.data.criteriaRateForDeduction
                : ''
              : ''
            : ''
          : '',
        residentialValueAmount: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.residentialValueAmount
                ? cnValidation.ruleDetails.data.residentialValueAmount
                : ''
              : ''
            : ''
          : '',
        isBrandWiseTransferAllowed: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.isBrandWiseTransferAllowed
                ? cnValidation.ruleDetails.data.isBrandWiseTransferAllowed
                : false
              : false
            : false
          : false,
        isBoutiqueWiseTransferAllowed: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.isBoutiqueWiseTransferAllowed
                ? cnValidation.ruleDetails.data.isBoutiqueWiseTransferAllowed
                : false
              : false
            : false
          : false,
        GHSUtilizationTransferPercent: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.gHSUtilizationTransferPercent
                ? cnValidation.ruleDetails.data.gHSUtilizationTransferPercent
                : ''
              : ''
            : ''
          : '',
        GHSMaxAmountTransfer: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.gHSMaxAmountTransfer
                ? cnValidation.ruleDetails.data.gHSMaxAmountTransfer
                : ''
              : ''
            : ''
          : '',
        isMergingGRFCNAllowed: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.isMergingGRFCNAllowed
                ? cnValidation.ruleDetails.data.isMergingGRFCNAllowed
                : false
              : false
            : false
          : false,
        gRFResidualValueAmount: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.gRFResidualValueAmount
                ? cnValidation.ruleDetails.data.gRFResidualValueAmount
                : ''
              : ''
            : ''
          : '',
        isPercent: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.isPercent
                ? cnValidation.ruleDetails.data.isPercent
                : false
              : false
            : false
          : false,
        gRFResidentialClosure: cnValidation
          ? cnValidation.ruleDetails
            ? cnValidation.ruleDetails.data
              ? cnValidation.ruleDetails.data.gRFResidentialClosure
                ? cnValidation.ruleDetails.data.gRFResidentialClosure
                : ''
              : ''
            : ''
          : ''
      });
    }
    if (cnValidations.length === 1) {
      totalElements = 1;
    } else {
      totalElements = data.totalElements;
    }
    cnValidationList = {
      cnValidationList: cnValidations,
      totalElements: totalElements
    };
    return cnValidationList;
  }

  static getCnValidation(data: any): CnValidationResponse {
    let cnValidations: CnValidationResponse;
    if (data) {
      cnValidations = {
        ruleId: data.ruleId ? data.ruleId : '',
        ruleType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        isCancellationAllowed: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isCancellationAllowed
                ? data.ruleDetails.data.isCancellationAllowed
                : false
              : false
            : false
          : false,
        deductionRate: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.deductionRate
                ? data.ruleDetails.data.deductionRate
                : ''
              : ''
            : ''
          : '',
        criteriaRateForDeduction: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.criteriaRateForDeduction
                ? data.ruleDetails.data.criteriaRateForDeduction
                : ''
              : ''
            : ''
          : '',
        residentialValueAmount: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.residentialValueAmount
                ? data.ruleDetails.data.residentialValueAmount
                : ''
              : ''
            : ''
          : '',
        isBrandWiseTransferAllowed: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isBrandWiseTransferAllowed
                ? data.ruleDetails.data.isBrandWiseTransferAllowed
                : false
              : false
            : false
          : false,
        isBoutiqueWiseTransferAllowed: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isBoutiqueWiseTransferAllowed
                ? data.ruleDetails.data.isBoutiqueWiseTransferAllowed
                : false
              : false
            : false
          : false,
        GHSUtilizationTransferPercent: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.gHSUtilizationTransferPercent
                ? data.ruleDetails.data.gHSUtilizationTransferPercent
                : ''
              : ''
            : ''
          : '',
        GHSMaxAmountTransfer: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.gHSMaxAmountTransfer
                ? data.ruleDetails.data.gHSMaxAmountTransfer
                : ''
              : ''
            : ''
          : '',
        isMergingGRFCNAllowed: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isMergingGRFCNAllowed
                ? data.ruleDetails.data.isMergingGRFCNAllowed
                : false
              : false
            : false
          : false,
        gRFResidualValueAmount: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.gRFResidualValueAmount
                ? data.ruleDetails.data.gRFResidualValueAmount
                : ''
              : ''
            : ''
          : '',
        isOnlyCNCustomerAllowedForMergeGRF: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isOnlyCNCustomerAllowedForMergeGRF
                ? data.ruleDetails.data.isOnlyCNCustomerAllowedForMergeGRF
                : null
              : null
            : null
          : null,
        isPercent: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.isPercent
                ? data.ruleDetails.data.isPercent
                : false
              : false
            : false
          : false,
        gRFResidentialClosure: data
          ? data.ruleDetails
            ? data.ruleDetails.data
              ? data.ruleDetails.data.gRFResidentialClosure
                ? data.ruleDetails.data.gRFResidentialClosure
                : ''
              : ''
            : ''
          : ''
      };
    } else {
      cnValidations = {
        ruleId: 'new',
        ruleType: '',
        description: '',
        isActive: true,
        isCancellationAllowed: false,
        deductionRate: '',
        criteriaRateForDeduction: '',
        residentialValueAmount: '',
        isBrandWiseTransferAllowed: false,
        isBoutiqueWiseTransferAllowed: false,
        GHSUtilizationTransferPercent: '',
        GHSMaxAmountTransfer: '',
        isMergingGRFCNAllowed: false,
        gRFResidualValueAmount: '',
        isPercent: false,
        gRFResidentialClosure: ''
      };
    }

    return cnValidations;
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

  static getCnTypeList(data: any): CnTypeList[] {
    const cnTypeList: CnTypeList[] = [];
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          cnTypeList.push({
            id: key,
            description: data[key]
          });
        }
      }
    }

    return cnTypeList;
  }
}
