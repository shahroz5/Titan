import * as moment from 'moment';
import {
  SearchItemPayloadSuccess,
  LoadItemsSuccessPayload,
  StockReturnItem,
  StockReturnFilterOption,
  RequestInvoice,
  StockIssueInvoiceHistorySuccess
} from '@poss-web/shared/models';
import { Item, CFAddress } from '@poss-web/shared/models';

export class StockReturnAdaptor {
  static invoiceIdFromJson(data: any): number {
    return data.id;
  }
  static confirmedIssueInvoiceTocfa(data: any): number {
    return data.srcDocNo;
  }
  static searchedItems(
    data: any,
    studdedProductGroups: string[] = []
  ): SearchItemPayloadSuccess {
    let searchItemPayloadSuccess: SearchItemPayloadSuccess;
    const items: StockReturnItem[] = [];
    let count: number = null;
    count = data.totalElements;
    for (const item of data.results) {
      items.push({
        id: item.inventoryId,
        itemCode: item.itemCode,
        lotNumber: item.lotNumber,
        mfgDate: item.mfgDate ? moment(item.mfgDate) : null,
        productCategory: item.productCategory,
        productGroup: item.productGroup,
        binCode: item.binCode,
        binGroupCode: item.binGroupCode,
        stdValue: item.stdValue,
        stdWeight: item.stdWeight,
        currencyCode: item.currencyCode,
        weightUnit: item.weightUnit,
        status: item.status,
        imageURL: item.imageURL,
        thumbnailImageURL: item.thumbnailImageURL,
        itemDetails: item.itemDetails,
        availableQuantity: item.availableQuantity,
        availableWeight: item.availableWeight,
        availableValue: item.availableValue,
        measuredQuantity: item.measuredQuantity,
        measuredWeight: item.measuredWeight,
        measuredValue: item.measuredValue,
        orderType: item.orderType,
        inventoryId: item.inventoryId,
        productCategoryDesc: item.productCategoryDesc,
        productGroupDesc: item.productGroupDesc,
        // for l3
        remarks: item.remarks,
        isStudded: studdedProductGroups.includes(item.productGroup),
        taxDetails: item.isacDetails
          ? this.getTaxDetails(item.isacDetails)
          : item.taxDetails,
        isLoadingImage: false,
        isLoadingThumbnailImage: false,
        finalValue: item.finalValue ? item.finalValue : 0,
        preTaxValue: item.preTaxValue ? item.preTaxValue : 0,
        pricePerUnit: item.pricePerUnit ? item.pricePerUnit : 0,
        totalTax: item.totalTax ? item.totalTax : 0,
        itemLevelDiscount: item.itemLevelDiscount ? item.itemLevelDiscount : 0,
        ishallmarking: item.ishallmarking,
        value: item.value ? item.value : 0
      });
    }

    searchItemPayloadSuccess = { items: items, count: count };

    return searchItemPayloadSuccess;
  }
  static getItemsFromJson(
    data: any,
    studdedProductGroups: string[] = []
  ): LoadItemsSuccessPayload {
    let loadItemSuccessPayload: LoadItemsSuccessPayload;
    const items: StockReturnItem[] = [];
    const count = data.totalElements;
    for (const item of data.results) {
      if (item.itemCode !== null) {
        items.push({
          id: item.id,
          itemCode: item.itemCode,
          lotNumber: item.lotNumber,
          mfgDate: item.mfgDate ? moment(item.mfgDate) : null,
          productCategory: item.productCategory,
          productGroup: item.productGroup,
          binCode: item.binCode,
          binGroupCode: item.binGroupCode,
          stdValue: item.stdValue,
          stdWeight: item.stdWeight,
          currencyCode: item.currencyCode,
          weightUnit: item.weightUnit,
          status: item.status,
          imageURL: item.imageURL,
          thumbnailImageURL: item.thumbnailImageURL,
          itemDetails: item.itemDetails,
          availableQuantity: item.availableQuantity,
          availableWeight: item.availableWeight,
          availableValue: item.availableValue,
          measuredQuantity: item.measuredQuantity,
          measuredWeight: item.measuredWeight,
          measuredValue: item.measuredValue,
          ishallmarking: item.ishallmarking,
          orderType: item.orderType,
          inventoryId: item.inventoryId,
          productCategoryDesc: item.productCategoryDesc,
          productGroupDesc: item.productGroupDesc,
          isStudded: studdedProductGroups.includes(item.productGroup),
          remarks: item.remarks,
          taxDetails: item.isacDetails
            ? this.getTaxDetails(item.isacDetails)
            : item.taxDetails,
          isLoadingImage: false,
          isLoadingThumbnailImage: false,
          finalValue: item.finalValue ? item.finalValue : 0,
          preTaxValue: item.preTaxValue ? item.preTaxValue : 0,
          pricePerUnit: item.pricePerUnit ? item.pricePerUnit : 0,
          totalTax: item.totalTax ? item.totalTax : 0,
          itemLevelDiscount: item.itemLevelDiscount
            ? item.itemLevelDiscount
            : 0,
          value: item.value ? item.value : 0
        });
      }
    }
    loadItemSuccessPayload = { items: items, count: count };
    return loadItemSuccessPayload;
  }

  static CourierDetailsFromJson(data: any): string[] {
    const courierNames: string[] = [];
    for (const courier of data.results) {
      courierNames.push(courier.courierName);
    }
    return courierNames;
  }
  static getCFAddress(data: any): CFAddress {
    if (data.cfaDetails === null) {
      return null;
    }
    const CFAdreess: CFAddress = {
      locationCode: data.cfaDetails.locationCode,
      brandCode: data.cfaDetails.brandCode,
      townCode: data.cfaDetails.townCode,
      stateCode: data.cfaDetails.stateCode,
      regionCode: data.cfaDetails.regionCode,
      locationTypeCode: data.cfaDetails.locationTypeCode,
      isActive: data.cfaDetails.isActive,
      address: data.cfaDetails.address,
      phoneNo: data.cfaDetails.phoneNo,
      description: data.cfaDetails.description
    };

    return CFAdreess;
  }
  static getHeaderLevelDetails(item: any): StockReturnItem {
    console.log('headerDetails', item);
    const headerLevelDetails: StockReturnItem = {
      id: item.id,
      itemCode: item.itemCode,
      lotNumber: item.lotNumber,
      mfgDate: item.mfgDate ? moment(item.mfgDate) : null,
      productCategory: item.productCategory,
      productGroup: item.productGroup,
      binCode: item.binCode,
      binGroupCode: item.binGroupCode,
      stdValue: item.stdValue,
      stdWeight: item.stdWeight,
      currencyCode: item.currencyCode,
      weightUnit: item.weightUnit,
      status: item.status,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      itemDetails: item.itemDetails,
      availableQuantity: item.totalAvailableQuantity,
      availableWeight: item.totalAvailableWeight,
      availableValue: item.totalAvailableValue,
      measuredQuantity: item.totalMeasuredQuantity,
      measuredWeight: item.totalMeasuredWeight,
      measuredValue: item.totalMeasuredValue,
      orderType: item.orderType,
      inventoryId: item.inventoryId,
      productCategoryDesc: item.productCategoryDesc,
      productGroupDesc: item.productGroupDesc,
      // for l3
      remarks: item.remarks,
      taxDetails: item.isacDetails
        ? this.getTaxDetails(item.isacDetails)
        : item.taxDetails,
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      finalValue: item.finalValue ? item.finalValue : 0,
      preTaxValue: item.preTaxValue ? item.preTaxValue : 0,
      pricePerUnit: item.pricePerUnit ? item.pricePerUnit : 0,
      totalTax: item.totalTax ? item.totalTax : 0,
      itemLevelDiscount: item.itemLevelDiscount ? item.itemLevelDiscount : 0,
      value: item.value ? item.value : 0
    };
    return headerLevelDetails;
  }
  static filterAdaptor(
    data: any,
    idField: string,
    descriptionField: string = 'description'
  ): StockReturnFilterOption {
    if (!data) {
      return null;
    }
    const filterOption: StockReturnFilterOption = {
      id: data[idField],
      description: data[descriptionField]
    };
    return filterOption;
  }
  static StockInvoiceHistory(data: any): StockIssueInvoiceHistorySuccess {
    if (!data) {
      return null;
    }
    let stockIssueInvoiceHistorySuccessPayload: StockIssueInvoiceHistorySuccess;
    const stockIssueInvoiceHistory: RequestInvoice[] = [];
    for (const stockInvoiceHistory of data.results) {
      console.log('data', stockInvoiceHistory.carrierDetails['type']);
      stockIssueInvoiceHistory.push({
        id: stockInvoiceHistory.id,
        srcLocationCode: stockInvoiceHistory.srcLocationCode
          ? stockInvoiceHistory.srcLocationCode
          : '',
        destLocationCode: stockInvoiceHistory.destLocationCode
          ? stockInvoiceHistory.destLocationCode
          : '',
        status: stockInvoiceHistory.status ? stockInvoiceHistory.status : '',
        weightUnit: stockInvoiceHistory.weightUnit
          ? stockInvoiceHistory.weightUnit
          : '',
        currencyCode: stockInvoiceHistory.currencyCode
          ? stockInvoiceHistory.currencyCode
          : '',
        srcLocationDescription: stockInvoiceHistory.srcLocationDescription
          ? stockInvoiceHistory.srcLocationDescription
          : '',
        destLocationDescription: stockInvoiceHistory.destLocationDescription
          ? stockInvoiceHistory.destLocationDescription
          : '',
        srcDocNo: stockInvoiceHistory.srcDocNo
          ? stockInvoiceHistory.srcDocNo
          : '',
        srcFiscalYear: stockInvoiceHistory.srcFiscalYear
          ? stockInvoiceHistory.srcFiscalYear
          : '',
        srcDocDate: moment(stockInvoiceHistory.srcDocDate)
          ? moment(stockInvoiceHistory.srcDocDate)
          : null,
        destDocNo: stockInvoiceHistory.destDocNo
          ? stockInvoiceHistory.destDocNo
          : '',
        destDocDate: moment(stockInvoiceHistory.destDocDate)
          ? moment(stockInvoiceHistory.destDocDate)
          : null,
        orderType: stockInvoiceHistory.orderType
          ? stockInvoiceHistory.orderType
          : '',
        totalAvailableQuantity: stockInvoiceHistory.totalAvailableQuantity
          ? stockInvoiceHistory.totalAvailableQuantity
          : 0,
        totalMeasuredQuantity: stockInvoiceHistory.totalMeasuredQuantity
          ? stockInvoiceHistory.totalMeasuredQuantity
          : 0,
        totalAvailableValue: stockInvoiceHistory.totalAvailableValue
          ? stockInvoiceHistory.totalAvailableValue
          : 0,
        totalMeasuredValue: stockInvoiceHistory.totalMeasuredValue
          ? stockInvoiceHistory.totalMeasuredValue
          : 0,
        totalAvailableWeight: stockInvoiceHistory.totalAvailableWeight
          ? stockInvoiceHistory.totalAvailableWeight
          : 0,
        totalMeasuredWeight: stockInvoiceHistory.totalMeasuredWeight
          ? stockInvoiceHistory.totalMeasuredWeight
          : 0,
        invoiceType: stockInvoiceHistory.invoiceType
          ? stockInvoiceHistory.invoiceType
          : '',
        remarks: stockInvoiceHistory.remarks ? stockInvoiceHistory.remarks : '',
        courierDetails: stockInvoiceHistory.carrierDetails
          ? {
              type: stockInvoiceHistory.carrierDetails['type']
                ? (stockInvoiceHistory.carrierDetails[
                    'type'
                  ] as string).toLowerCase()
                : null,
              data: stockInvoiceHistory.carrierDetails['data']
                ? stockInvoiceHistory.carrierDetails['data']
                : null
            }
          : null,
        totalDiscount: stockInvoiceHistory.totalDiscount
          ? stockInvoiceHistory.totalDiscount
          : 0
      });
    }
    stockIssueInvoiceHistorySuccessPayload = {
      requestInvoice: stockIssueInvoiceHistory,
      totalElements: data.totalElements
    };

    return stockIssueInvoiceHistorySuccessPayload;
  }

  static getTaxDetails(isacDetails) {
    const taxDetails = {
      data: {
        SGSTVal: 0,
        CGSTVal: 0,
        IGSTVal: 0,
        UTGSTVal: 0
      }
    };
    if (isacDetails?.data?.IsacDetails?.length) {
      for (const item of isacDetails?.data?.IsacDetails) {
        if (item.glKey === 'SGST') {
          taxDetails.data.SGSTVal = item.amount;
        } else if (item.glKey === 'CGST') {
          taxDetails.data.CGSTVal = item.amount;
        } else if (item.glKey === 'IGST') {
          taxDetails.data.IGSTVal = item.amount;
        } else if (item.glKey === 'UTGST') {
          taxDetails.data.UTGSTVal = item.amount;
        }
      }
    }
    return taxDetails;
  }
}
