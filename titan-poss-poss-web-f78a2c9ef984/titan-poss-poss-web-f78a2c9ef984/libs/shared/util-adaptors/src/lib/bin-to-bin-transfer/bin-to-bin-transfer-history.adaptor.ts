import { BinToBinTransferHistoryItemHeader } from '@poss-web/shared/models';
import * as moment from 'moment';

export class BinToBinTransferHistoryAdaptor {
  static historyItemFromJson(data: any): BinToBinTransferHistoryItemHeader {
    if (!data) {
      return null;
    }
    const binToBinHistoryData = data;
    const binToBinHistory: BinToBinTransferHistoryItemHeader = {
      id: binToBinHistoryData.id,
      transactionType: binToBinHistoryData.transactionType,
      locationCode: binToBinHistoryData.locationCode,
      srcDocNo: binToBinHistoryData.srcDocNo,
      srcFiscalYear: binToBinHistoryData.srcFiscalYear,
      srcDocDate: binToBinHistoryData.srcDocDate
        ? moment(binToBinHistoryData.srcDocDate)
        : null,
      destDocNo: binToBinHistoryData.destDocNo,
      destDocDate: binToBinHistoryData.destDocDate,
      totalAvailableQuantity: binToBinHistoryData.totalAvailableQuantity,
      totalMeasuredQuantity: binToBinHistoryData.totalMeasuredQuantity,
      locationCodeDescription: binToBinHistoryData.locationCodeDescription,
      totalAvailableValue: binToBinHistoryData.totalAvailableValue,
      totalMeasuredValue: binToBinHistoryData.totalMeasuredValue,
      totalAvailableWeight: binToBinHistoryData.totalAvailableWeight,
      totalMeasuredWeight: binToBinHistoryData.totalMeasuredWeight,
      carrierDetails: binToBinHistoryData.carrierDetails,
      weightUnit: binToBinHistoryData.weightUnit,
      currencyCode: binToBinHistoryData.currencyCode,
      status: binToBinHistoryData.status,
      destFiscalYear: binToBinHistoryData.destFiscalYear,
      remarks: binToBinHistoryData.remarks
        ? binToBinHistoryData.remarks
        : 'No Remarks Given',
      otherDetails: binToBinHistoryData.otherDetails
    };
    return binToBinHistory;
  }
}
