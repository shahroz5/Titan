import {
  RivaahConfigurationResponse,
  RivaahEligibilityConfigResponse,
  RivaahEligibilityConfig,
  RivaahLocationSuccessList,
  RivaahLocationList,
  MappedLocDetails,
  ProductGroupMappingOption,
  ProductCategory
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class RivaahConfigurationAdaptor {
  static getCouponConfiguration(data: any): RivaahConfigurationResponse {
    let configData;
    configData = {
      ruleId: data.ruleId,
      description: data.description.replace(/ {2,}/g, ' ').trim(),
      ruleType: data.ruleType,
      isActive: data.isActive,
      ruleDetails: data.ruleDetails
    };
    return configData;
  }

  static updateCouponConfiguration(data: any): RivaahConfigurationResponse {
    let config: RivaahConfigurationResponse;
    if (data) {
      config = {
        ruleId: data.ruleId ? data.ruleId : '',
        ruleType: data.ruleType ? data.ruleType : '',
        description: data.description ? data.description : '',
        isActive: data.isActive,
        ruleDetails: data.ruleDetails ? data.ruleDetails : ''
      };
    } else {
      config = null;
    }
    return config;
  }

  static getRivaahEligibilityConfiguration(
    data: any
  ): RivaahEligibilityConfigResponse {
    const rivaahEligibilityConfig: RivaahEligibilityConfig[] = [];
    console.log(data);
    if (data && data?.results) {
      for (const ob of data?.results) {
        rivaahEligibilityConfig.push({
          id: ob?.rules[0]?.id,
          isNew: false,
          isConcate: true,
          isActive: ob?.rules[0]?.ruleDetails?.data?.isActive,
          grammage: ob?.rules[0].ruleDetails?.data?.grammage,
          eleventhDigit: ob?.rules[0].ruleDetails?.data?.eleventhDigit,
          occasion: ob?.rules[0].ruleDetails?.data?.occasion,
          productCategoryCode: ob?.rules[0]?.productCategoryCode,
          productGroupCount: ob?.rules[0]?.productGroupCode
        });
      }
    }

    return {
      rivaahEligibilityConfig: rivaahEligibilityConfig,
      totalElements: data?.totalElements
    };
  }

  static getMappedProductCategory(
    data: any
  ): ProductCategory[] {
    const productCategory: ProductCategory[] = [];
    console.log(data);
    if (data && data?.results) {
      for (const ob of data?.results) {
        productCategory.push({
          description: ob?.rules[0]?.description ? ob?.rules[0]?.description : '',
          productCategoryCode: ob?.rules[0]?.productCategoryCode
        });
      }
    }

    return productCategory;
  }

  static getMappedProductGroup(data: any) {
    const selectedProductGroups: ProductGroupMappingOption[] = [];

    if(data && data?.results) {
      for (const p of data.results) {
        selectedProductGroups.push({
          uuid: p.id,
          id: p.productGroupCode
        });
      }
    }

    return selectedProductGroups;
  }

  static getRivaahLocations(data: any): RivaahLocationSuccessList {
    const locationList: RivaahLocationList[] = [];
    for (const listItem of data.results) {
      locationList.push({
        description: listItem.description ? listItem.description : '',
        ruleId: listItem.ruleId ? listItem.ruleId : '',
        locationCode: listItem.locationCode ? listItem.locationCode : '',
        offerEndDate: moment(listItem.offerEndDate),
        offerStartDate: moment(listItem.offerStartDate),
        subBrandCode: listItem.subBrandCode ? listItem.subBrandCode : ''
      });
    }
    return {
      rivaahLocationList: locationList,
      count: data.totalElements
    };
  }

  static getRivaahAllLocationList(data: any): MappedLocDetails[] {
    const locations: MappedLocDetails[] = [];
    for (const detail of data.results) {
      locations.push({
        ruleId: detail.ruleId,
        id: detail.locationCode,
        description: detail.description,
      });
    }

    return locations;
  }
}
