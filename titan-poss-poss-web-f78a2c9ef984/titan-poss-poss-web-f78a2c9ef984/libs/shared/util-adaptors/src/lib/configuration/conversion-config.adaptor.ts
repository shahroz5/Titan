import {
  ConversionConfigList,
  ConversionConfig,
  ConversionConfigByIdPayload,
  CheckBoxHeader,
  ProductGroups
} from '@poss-web/shared/models';

export class ConversionConfigAdaptor {
  static ConversionConfigList(data: any): ConversionConfigList {
    let conversionConfigList: ConversionConfigList;
    const conversionConfig: ConversionConfig[] = [];
    for (const conversionsConfigs of data.results) {
      conversionConfig.push({
        configId: conversionsConfigs.ruleId,
        configType: conversionsConfigs.ruleType,
        description: conversionsConfigs.description,
        isActive: conversionsConfigs.isActive
      });
    }
    conversionConfigList = {
      conversionConfigList: conversionConfig,
      totalElements: data.totalElements
    };
    return conversionConfigList;
  }
  static ConversionConfigDetailsById(
    createConfig,
    data
  ): ConversionConfigByIdPayload {
    console.log('data', data.results);
    const selectedProductGroups: ProductGroups[] = [];
    let conversionConfigDetails: ConversionConfigByIdPayload;
    for (const productGroups of data.results) {
      selectedProductGroups.push({
        id: productGroups.rules[0].id,
        productGroupCode: productGroups.rules[0].productGroupCode,
        productCategoryCode: productGroups.rules[0].productCategoryCode,
        allowedLimitWeight: productGroups.rules[0].ruleDetails.data
          .allowedLimitWeight
          ? productGroups.rules[0].ruleDetails.data.allowedLimitWeight
          : '',
        allowedLimitValue: productGroups.rules[0].ruleDetails.data
          .allowedLimitValue
          ? productGroups.rules[0].ruleDetails.data.allowedLimitValue
          : '',
        autoApprovalLimitWeight: productGroups.rules[0].ruleDetails.data
          .autoApprovalLimitWeight
          ? productGroups.rules[0].ruleDetails.data.autoApprovalLimitWeight
          : '',
        autoApprovalLimitValue: productGroups.rules[0].ruleDetails.data
          .autoApprovalLimitValue
          ? productGroups.rules[0].ruleDetails.data.autoApprovalLimitValue
          : ''
      });
    }
    conversionConfigDetails = {
      createConfig: createConfig,
      productGroups: selectedProductGroups
    };
    return conversionConfigDetails;
  }
  static ConversionConfigSuccessPayload(
    createConfig: any,
    selectedGroups: any
  ): ConversionConfigByIdPayload {
    let saveSuccessPayload: ConversionConfigByIdPayload;
    const selectedProductGroups: ProductGroups[] = [];
    for (const productGroups of selectedGroups.rules) {
      selectedProductGroups.push({
        id: productGroups.id,
        productGroupCode: productGroups.productGroupCode,
        productCategoryCode: productGroups.productCategoryCode,
        allowedLimitWeight: productGroups.ruleDetails.data.allowedLimitWeight
          ? productGroups.ruleDetails.data.allowedLimitWeight
          : '',
        allowedLimitValue: productGroups.ruleDetails.data.allowedLimitValue
          ? productGroups.ruleDetails.data.allowedLimitValue
          : '',
        autoApprovalLimitWeight: productGroups.ruleDetails.data
          .autoApprovalLimitWeight
          ? productGroups.ruleDetails.data.autoApprovalLimitWeight
          : '',
        autoApprovalLimitValue: productGroups.ruleDetails.data
          .autoApprovalLimitValue
          ? productGroups.ruleDetails.data.autoApprovalLimitValue
          : ''
      });
    }

    saveSuccessPayload = {
      createConfig: createConfig,
      productGroups: selectedProductGroups
    };
    return saveSuccessPayload;
  }
  static ConversionConfigValuesSuccessPayload(
    data
  ): ConversionConfigByIdPayload {
    let conversionConfigDetails: ConversionConfigByIdPayload;
    console.log('data', data.rules);
    const selectedProductGroups: ProductGroups[] = [];
    for (const productGroups of data.rules) {
      selectedProductGroups.push({
        id: productGroups.id,
        productGroupCode: productGroups.productGroupCode,
        productCategoryCode: productGroups.productCategoryCode,
        allowedLimitWeight: productGroups.ruleDetails.allowedLimitWeight,
        allowedLimitValue: productGroups.ruleDetails.allowedLimitValue,
        autoApprovalLimitWeight:
          productGroups.ruleDetails.autoApprovalLimitWeight,
        autoApprovalLimitValue: productGroups.ruleDetails.autoApprovalLimitValue
      });
    }
    conversionConfigDetails = {
      createConfig: {
        ruleId: data.ruleId,
        ruleType: data.ruleType,
        description: '',
        isActive: false
      },
      productGroups: selectedProductGroups
    };
    return conversionConfigDetails;
  }
  static getProductGroups(data): CheckBoxHeader[] {
    const productGroups: CheckBoxHeader[] = [];
    for (const productGroup of data.results) {
      if (
        productGroup &&
        productGroup.configDetails &&
        productGroup.configDetails.data &&
        productGroup.configDetails.data.isConversionEnabled
      ) {
        productGroups.push({
          title: productGroup.description,
          key: productGroup.productGroupCode
        });
      }
    }
    return productGroups;
  }

  static getProductCategories(data): CheckBoxHeader[] {
    const productCategories: CheckBoxHeader[] = [];
    for (const productCateory of data.results) {
      if (productCateory && productCateory.isConversionEnabled) {
        productCategories.push({
          title: productCateory.description,
          key: productCateory.productCategoryCode
        });
      }
    }
    return productCategories;
  }
}
