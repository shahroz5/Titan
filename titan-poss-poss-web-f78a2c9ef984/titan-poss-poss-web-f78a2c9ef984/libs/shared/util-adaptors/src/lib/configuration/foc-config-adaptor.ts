import {
  FocConfigurationList,
  SchemeDetails,
  VariantDetails,
  ValueBasedVariantDetails,
  WeightBasedVariantDetails,
  focSchemeBasedEnums,
  FocLocationList,
  FOCItemCodes,
  FocItemsResponse,
  ProductGroupMappingOption,
  LocationListSuccessPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class FocConfigurationAdaptor {
  static getFocConfigurationList(data: any) {
    let focConfigurationList: FocConfigurationList;
    let totalElements;
    const focConfiguration: SchemeDetails[] = [];
    for (const focConfig of data.results) {
      focConfiguration.push({
        id: focConfig.id,
        name: focConfig.name,
        description: focConfig.description,
        isActive: focConfig.isActive,
        lastPublishedDate: focConfig.publishTime
          ? moment(focConfig.publishTime)
          : '',
        lastModifiedDate: focConfig.lastModifiedDate
          ? moment(focConfig.lastModifiedDate)
          : '',
        lastModifiedTime: focConfig.lastModifiedDate
          ? moment(focConfig.lastModifiedDate).format('HH:mm A')
          : '',
        lastPublishTime: focConfig.publishTime
          ? moment(focConfig.publishTime).format('HH:mm A')
          : '',
        isPublishPending: focConfig.isPublishPending
      });
    }

    totalElements = data.totalElements;

    focConfigurationList = {
      focConfigList: focConfiguration,
      totalElements: totalElements
    };
    return focConfigurationList;
  }
  static getRangeWeight(data: any): string[] {
    const rangeWeight: string[] = [];
    for (const rangeWeightdata of data.results) {
      rangeWeight.push(
        rangeWeightdata.fromRange + '-' + rangeWeightdata.toRange
      );
    }

    return rangeWeight;
  }
  static getFocSchemeConfiguration(data: any) {
    let schemeDetails: SchemeDetails;

    schemeDetails = {
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      clubbingConfigData: data.clubbingConfig,
      tepConfigData: data.tepConfig,
      orderConfigData: data.orderConfig,
      grnConfigData: data.grnConfig,
      isAccrualUlp: data?.isAccrualUlp
    };
    return schemeDetails;
  }
  static getVariantDetails(data: any) {
    let variantDetails: VariantDetails;
    let valueBasedVariantDetails: ValueBasedVariantDetails[] = [];
    let weightBasedVariantDetails: WeightBasedVariantDetails[] = [];

    for (const variantItem of data.results) {
      if (variantItem.category === focSchemeBasedEnums.VALUE_BASED) {
        valueBasedVariantDetails.push({
          id: variantItem.id,
          stdValue: variantItem?.stdSaleValue?.toString(),
          slabFrom: variantItem?.fromSaleValue?.toString(),
          slabTo: variantItem?.toSaleValue?.toString(),
          multiplyingValue: variantItem?.stdSaleValue?.toString(),
          isMultiple: variantItem.isMultiple,
          karatage: variantItem.karat,
          totalFocWt: variantItem?.weight?.toString(),
          isSingle: variantItem.isSingle,
          isActive: variantItem.isActive,
          itemCode: variantItem.itemCode,
          quantity: variantItem?.quantity?.toString(),
          rowId: variantItem.rowId,
          productGroupCount: variantItem.productGroupCount,
          focEligibility: variantItem.focEligibility
        });
      } else {
        weightBasedVariantDetails.push({
          id: variantItem.id,
          stdValue: variantItem?.stdSaleValue?.toString(),
          slabFrom: variantItem?.fromSaleValue?.toString(),
          slabTo: variantItem?.toSaleValue?.toString(),
          multiplyingValue: variantItem?.stdSaleValue?.toString(),
          isMultiple: variantItem.isMultiple,
          karatage: variantItem.karat,
          totalFocWt: variantItem?.weight?.toString(),
          isSingle: variantItem.isSingle,
          isActive: variantItem.isActive,
          itemCode: variantItem.itemCode,
          quantity: variantItem?.quantity?.toString(),
          rowId: variantItem.rowId,
          productGroupCount: variantItem.productGroupCount,
          focEligibility: variantItem.focEligibility
        });
      }
    }

    valueBasedVariantDetails = valueBasedVariantDetails.sort((a, b) =>
      a.rowId < b.rowId ? -1 : 1
    );
    weightBasedVariantDetails = weightBasedVariantDetails.sort((a, b) =>
      a.rowId < b.rowId ? -1 : 1
    );
    return (variantDetails = {
      valueBasedVariantDetails: valueBasedVariantDetails,
      weightBasedVariantDetails: weightBasedVariantDetails
    });
  }
  static getLocationList(data: any) {
    const focLocationList: FocLocationList[] = [];
    let locationListSuccessPayload: LocationListSuccessPayload = null;
    for (const location of data.results) {
      focLocationList.push({
        locationCode: location.locationCode,
        description: location.description,
        startDate: moment(location.startDate),
        endDate: moment(location.endDate),
        id: location.id,
        mobileNo: location.mobileNo,
        isActive: location.status,
        subBrandCode: location.subBrandCode
      });
    }
    locationListSuccessPayload = {
      totalLocations: data.totalElements,
      locationList: focLocationList
    };

    return locationListSuccessPayload;
  }
  static getMappedProductGroup(data: any) {
    const selectedProductGroups: ProductGroupMappingOption[] = [];

    for (const p of data.results) {
      selectedProductGroups.push({
        uuid: p.id,
        id: p.productGroupCode
      });
    }

    return selectedProductGroups;
  }

  static getFocItemCodes(data: any): FOCItemCodes[] {
    const focItemCodes: FOCItemCodes[] = [];
    for (const itemCodes of data.results) {
      focItemCodes.push({
        itemCode: itemCodes.itemCode,
        stdWeight: itemCodes.stdWeight,
        karat: itemCodes.karat
      });
    }
    return focItemCodes;
  }
  static getFocMappedItems(data: any): FocItemsResponse {
    const focItemCodes: FOCItemCodes[] = [];
    for (const itemCodes of data.results) {
      focItemCodes.push({
        itemCode: itemCodes.itemCode,
        stdWeight: itemCodes.stdWeight,
        karat: itemCodes.karat,
        id: itemCodes.id
      });
    }
    return {
      items: focItemCodes,
      totalElements: data.totalElements
    };
  }
}
