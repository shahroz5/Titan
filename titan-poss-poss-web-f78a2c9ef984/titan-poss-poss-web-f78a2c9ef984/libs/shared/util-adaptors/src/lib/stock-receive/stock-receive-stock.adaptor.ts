import * as moment from 'moment';
import {
  StockReceiveStock,
  StockReceiveTotalMeasuredWeight
} from '@poss-web/shared/models';

export class StockReceiveStockAdaptor {
  static fromJson(data: any, typeField: string): StockReceiveStock {
    if (!data) {
      return null;
    }
    const stock: StockReceiveStock = {
      id: data.id,
      srcDocNo: data.srcDocNo,
      srcLocationCode: data.srcLocationCode,
      type: data[typeField],
      courierDetails: data.carrierDetails
        ? {
            type: data.carrierDetails['type']
              ? (data.carrierDetails['type'] as string).toLowerCase()
              : null,
            data: {
              companyName: data.carrierDetails['data']?.courierCompany
                ? data.carrierDetails['data']?.courierCompany
                : data.carrierDetails['data']?.companyName,
              docketNumber: data.carrierDetails['data']?.docketNumber,
              lockNumber: data.carrierDetails['data']?.lockNumber,
              roadPermitNumber: data.carrierDetails['data']?.roadPermitNumber,
              employeeId: data.carrierDetails['data']?.employeeId,
              employeeMobileNumber: data.carrierDetails['data']?.mobileNo,
              employeeName: data.carrierDetails['data']?.employeeName
            }
          }
        : {
            type: null,
            data: null
          },
      orderType: data.orderType,
      courierReceivedDate: moment(data.courierReceivedDate),
      totalAvailableValue: data.totalAvailableValue
        ? data.totalAvailableValue
        : 0,
      totalAvailableWeight: data.totalAvailableWeight
        ? data.totalAvailableWeight
        : 0,
      totalAvailableQuantity: data.totalAvailableQuantity
        ? data.totalAvailableQuantity
        : 0,
      totalMeasuredQuantity: data.totalMeasuredQuantity
        ? data.totalMeasuredQuantity
        : 0,
      totalMeasuredValue: data.totalMeasuredValue ? data.totalMeasuredValue : 0,
      totalMeasuredWeight: data.totalMeasuredWeight
        ? data.totalMeasuredWeight
        : 0,

      srcDocDate: moment(data.srcDocDate),
      currencyCode: data.currencyCode,
      weightUnit: data.weightUnit,
      status: data.status,
      srcFiscalYear: data.srcFiscalYear,
      destDocDate: moment(data.destDocDate),
      destDocNo: data.destDocNo,
      destLocationCode: data.destLocationCode,
      srcLocationDescription: data.srcLocationDescription,
      destLocationDescription: data.destLocationDescription,
      reasonForDelay: data.reasonForDelay,
      remarks: data.remarks,
      totalDiscount: data.totalDiscount,
      invoiceType: data.invoiceType,
      totalValue: data.totalValue ? data.totalValue : 0
    };
    return stock;
  }

  static mapTotalMeasuredWeight(data: any): StockReceiveTotalMeasuredWeight {
    if (!data) {
      return null;
    }

    const measuredWeight: StockReceiveTotalMeasuredWeight = {
      totalMeasuredWeight: data?.totalWeight
    };

    return measuredWeight;
  }
}
