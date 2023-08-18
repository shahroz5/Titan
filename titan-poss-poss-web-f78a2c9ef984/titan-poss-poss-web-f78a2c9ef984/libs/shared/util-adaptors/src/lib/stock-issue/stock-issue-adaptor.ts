import * as moment from 'moment';
import {
  StockRequestNote,
  LoadIssueSTNCountsPayload,
  MeasuredWeightAndValuePayload,
  RegenerateFileResponse,
} from '@poss-web/shared/models';

// import { IssueCountState } from './+state/Issue-count/issue-count.state';

/**
 * Adapters for the Stock Receive
 */
export class StockIssueAdaptor {
  static fromJson(data: any): StockRequestNote {
    if (!data) {
      return null;
    }
    const request: StockRequestNote = {
      carrierDetails: data.carrierDetails,
      currencyCode: data.currencyCode,
      destDocDate: moment(data.destDocDate),
      destDocNo: data.destDocNo,
      destLocationCode: data.destLocationCode,
      destLocationDescription: data.destLocationDescription,
      id: data.id,
      orderType: data.orderType,
      otherDetails: data.otherDetails,
      reqDocDate: moment(data.reqDocDate),
      reqDocNo: data.reqDocNo,
      reqLocationCode: data.reqLocationCode,
      requestType: data.requestType,
      srcDocDate: moment(data.srcDocDate),
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcLocationCode: data.srcLocationCode,
      srcLocationDescription: data.srcLocationDescription,
      status: data.status,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalMeasuredValue: data.totalMeasuredValue,
      totalMeasuredWeight: data.totalMeasuredWeight,
      weightUnit: data.weightUnit,
      courierReceivedDate: data.courierReceivedDate,
      reasonForDelay: data.reasonForDelay,
      remarks: data.remarks,
      transferType: data.transferType
    };
    return request;
  }

  //new
  static stockRequestNotesFromJson(data: any): StockRequestNote[] {
    const stockRequestNotes: StockRequestNote[] = [];
    for (const stockRequestNote of data.results) {
      stockRequestNotes.push({
        carrierDetails: stockRequestNote.carrierDetails,
        currencyCode: stockRequestNote.currencyCode,
        destDocDate: moment(stockRequestNote.destDocDate),
        destDocNo: stockRequestNote.destDocNo,
        destLocationCode: stockRequestNote.destLocationCode,
        destLocationDescription: stockRequestNote.destLocationDescription,
        id: stockRequestNote.id,
        orderType: stockRequestNote.orderType,
        otherDetails: stockRequestNote.otherDetails,
        reqDocDate: moment(stockRequestNote.reqDocDate),
        reqDocNo: stockRequestNote.reqDocNo,
        reqLocationCode: stockRequestNote.reqLocationCode,
        requestType: stockRequestNote.requestType,
        srcDocDate: moment(stockRequestNote.srcDocDate),
        srcDocNo: stockRequestNote.srcDocNo,
        srcFiscalYear: stockRequestNote.srcFiscalYear,
        srcLocationCode: stockRequestNote.srcLocationCode,
        srcLocationDescription: stockRequestNote.srcLocationDescription,
        status: stockRequestNote.status,
        totalAvailableQuantity: stockRequestNote.totalAvailableQuantity,
        totalAvailableValue: stockRequestNote.totalAvailableValue,
        totalAvailableWeight: stockRequestNote.totalAvailableWeight,
        totalMeasuredQuantity: stockRequestNote.totalMeasuredQuantity,
        totalMeasuredValue: stockRequestNote.totalMeasuredValue,
        totalMeasuredWeight: stockRequestNote.totalMeasuredWeight,
        weightUnit: stockRequestNote.weightUnit,
        courierReceivedDate: stockRequestNote.courierReceivedDate,
        reasonForDelay: stockRequestNote.reasonForDelay,
        remarks: stockRequestNote.remarks,
        transferType: stockRequestNote.transferType
      });
    }
    return stockRequestNotes;
  }
  static stockRequestsListFromJson(data: any): StockRequestNote {
    if (!data) {
      return null;
    }
    const stockIssueHeader: StockRequestNote = {
      carrierDetails: data.carrierDetails,
      currencyCode: data.currencyCode,
      destDocDate: moment(data.destDocDate),
      destDocNo: data.destDocNo,
      destLocationCode: data.destLocationCode,
      destLocationDescription: data.destLocationDescription,
      id: data.id,
      orderType: data.orderType,
      otherDetails: data.otherDetails,
      reqDocDate: moment(data.reqDocDate),
      reqDocNo: data.reqDocNo,
      reqLocationCode: data.reqLocationCode,
      requestType: data.requestType,
      srcDocDate: moment(data.srcDocDate),
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcLocationCode: data.srcLocationCode,
      srcLocationDescription: data.srcLocationDescription,
      status: data.status,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalMeasuredValue: data.totalMeasuredValue,
      totalMeasuredWeight: data.totalMeasuredWeight,
      weightUnit: data.weightUnit,
      courierReceivedDate: data.courierReceivedDate,
      reasonForDelay: data.reasonForDelay,
      remarks: data.remarks,
      transferType: data.transferType
    };
    return stockIssueHeader;
  }

  //new
  static stockRequestNoteFromJson(data: any): StockRequestNote {
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    const stockRequestNoteData = data.results[0];
    const stockRequestNote: StockRequestNote = {
      carrierDetails: stockRequestNoteData.carrierDetails,
      currencyCode: stockRequestNoteData.currencyCode,
      destDocDate: moment(stockRequestNoteData.destDocDate),
      destDocNo: stockRequestNoteData.destDocNo,
      destLocationCode: stockRequestNoteData.destLocationCode,
      destLocationDescription: stockRequestNoteData.destLocationDescription,
      id: stockRequestNoteData.id,
      orderType: stockRequestNoteData.orderType,
      otherDetails: stockRequestNoteData.otherDetails,
      reqDocDate: moment(stockRequestNoteData.reqDocDate),
      reqDocNo: stockRequestNoteData.reqDocNo,
      reqLocationCode: stockRequestNoteData.reqLocationCode,
      requestType: stockRequestNoteData.requestType,
      srcDocDate: moment(stockRequestNoteData.srcDocDate),
      srcDocNo: stockRequestNoteData.srcDocNo,
      srcFiscalYear: stockRequestNoteData.srcFiscalYear,
      srcLocationCode: stockRequestNoteData.srcLocationCode,
      srcLocationDescription: stockRequestNoteData.srcLocationDescription,
      status: stockRequestNoteData.status,
      totalAvailableQuantity: stockRequestNoteData.totalAvailableQuantity,
      totalAvailableValue: stockRequestNoteData.totalAvailableValue,
      totalAvailableWeight: stockRequestNoteData.totalAvailableWeight,
      totalMeasuredQuantity: stockRequestNoteData.totalMeasuredQuantity,
      totalMeasuredValue: stockRequestNoteData.totalMeasuredValue,
      totalMeasuredWeight: stockRequestNoteData.totalMeasuredWeight,
      weightUnit: stockRequestNoteData.weightUnit,
      courierReceivedDate: data.courierReceivedDate,
      reasonForDelay: data.reasonForDelay,
      remarks: data.remarks,
      transferType: data.transferType
    };
    return stockRequestNote;
  }

  // static issueConfirmResponseFromJson(data: any): IssueConfirmResponse {
  //   if (!data) {
  //     // Throw
  //     return null;
  //   }
  //   const issueConfirmResponse: IssueConfirmResponse = {
  //     courierDetails: data.courierDetails,
  //     courierReceivedDate: moment(data.courierReceivedDate),
  //     currencyCode: data.currencyCode,
  //     destDocDate: moment(data.destDocDate),
  //     destDocNo: data.destDocNo,
  //     destLocationCode: data.destLocationCode,
  //     id: data.id,
  //     orderType: data.orderType,
  //     srcDocDate: moment(data.srcDocDate),
  //     srcDocNo: data.srcDocNo,
  //     srcFiscalYear: data.srcFiscalYear,
  //     srcLocationCode: data.srcLocationCode,
  //     status: data.status,
  //     totalAvailableQuantity: data.totalAvailableQuantity,
  //     totalAvailableValue: data.totalAvailableValue,
  //     totalAvailableWeight: data.totalAvailableWeight,
  //     totalMeasuredQuantity: data.totalMeasuredQuantity,
  //     totalMeasuredValue: data.totalMeasuredValue,
  //     totalMeasuredWeight: data.totalMeasuredWeight,
  //     transferType: data.transferType,
  //     weightUnit: data.weightUnit
  //   };
  //   return issueConfirmResponse;
  // }

  static IssueSTNCountFromJson(data: any): LoadIssueSTNCountsPayload {
    let pendingIssueBTQ_BTQ_STNCount = 0;
    let pendingIssueBTQ_FAC_STNCount = 0;
    let pendingIssueBTQ_MER_STNCount = 0;

    for (const issueSTNCount of data.results) {
      if (issueSTNCount.type === 'BTQ') {
        pendingIssueBTQ_BTQ_STNCount = issueSTNCount.count;
      }
      if (issueSTNCount.type === 'FAC') {
        pendingIssueBTQ_FAC_STNCount = issueSTNCount.count;
      }
      if (issueSTNCount.type === 'MER') {
        pendingIssueBTQ_MER_STNCount = issueSTNCount.count;
      }
    }
    return {
      pendingIssueBTQ_BTQ_STNCount,
      pendingIssueBTQ_FAC_STNCount,
      pendingIssueBTQ_MER_STNCount
    };
  }

  static measuredWeightAndValueFromJson(
    data: any
  ): MeasuredWeightAndValuePayload {
    if (!data) {
      return null;
    }
    const stockRequestNoteData = data;
    const stockRequestNote: MeasuredWeightAndValuePayload = {
      currencyCode: stockRequestNoteData.currencyCode,
      totalMeasuredQuantity: stockRequestNoteData.totalMeasuredQuantity,
      totalMeasuredValue: stockRequestNoteData.totalMeasuredValue,
      totalMeasuredWeight: stockRequestNoteData.totalMeasuredWeight,
      weightUnit: stockRequestNoteData.weightUnit
    };
    return stockRequestNote;
  }

  static historyStockRequestNoteFromJson(data: any): StockRequestNote {
    if (!data) {
      return null;
    }
    const stockRequestNoteData = data;
    const stockRequestNote: StockRequestNote = {
      carrierDetails: stockRequestNoteData.carrierDetails,
      currencyCode: stockRequestNoteData.currencyCode,
      destDocDate: moment(stockRequestNoteData.destDocDate),
      destDocNo: stockRequestNoteData.destDocNo,
      destLocationCode: stockRequestNoteData.destLocationCode,
      destLocationDescription: stockRequestNoteData.destLocationDescription,
      destLocationName: stockRequestNoteData?.destDetails?.companyName,
      destLocationAddress: this.getAddress(
        stockRequestNoteData?.destDetails?.addressLines,
        null,
        null,
        null
      ),
      id: stockRequestNoteData.id,
      orderType: stockRequestNoteData.orderType,
      otherDetails: stockRequestNoteData.otherDetails,
      reqDocDate: moment(stockRequestNoteData.reqDocDate),
      reqDocNo: stockRequestNoteData.reqDocNo,
      reqLocationCode: stockRequestNoteData.reqLocationCode,
      requestType: stockRequestNoteData.requestType,
      srcDocDate: moment(stockRequestNoteData.srcDocDate),
      srcDocNo: stockRequestNoteData.srcDocNo,
      srcFiscalYear: stockRequestNoteData.srcFiscalYear,
      srcLocationCode: stockRequestNoteData.srcLocationCode,
      srcLocationDescription: stockRequestNoteData.srcLocationDescription,
      srcLocationName: stockRequestNoteData?.srcDetails?.companyName,
      srcLocationAddress: this.getAddress(
        stockRequestNoteData?.srcDetails?.addressLines,
        null,
        null,
        null
      ),
      status: stockRequestNoteData.status,
      totalAvailableQuantity: stockRequestNoteData.totalAvailableQuantity,
      totalAvailableValue: stockRequestNoteData.totalAvailableValue,
      totalAvailableWeight: stockRequestNoteData.totalAvailableWeight,
      totalMeasuredQuantity: stockRequestNoteData.totalMeasuredQuantity,
      totalMeasuredValue: stockRequestNoteData.totalMeasuredValue,
      totalMeasuredWeight: stockRequestNoteData.totalMeasuredWeight,
      weightUnit: stockRequestNoteData.weightUnit,
      courierReceivedDate: data.courierReceivedDate,
      reasonForDelay: data.reasonForDelay,
      remarks: data.remarks,
      transferType: data.transferType,
      cancelledDate: moment(data.cancelledDate),
      cancelledRemarks: data.cancelledRemarks
    };
    return stockRequestNote;
  }

  static regenerateFileFromJson(data: any): RegenerateFileResponse {
    if (!data) {
      return null;
    }
    const request: RegenerateFileResponse = {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      status: data.status,
      weightUnit: data.weightUnit,
      currencyCode: data.currencyCode,
      srcLocationDescription: data.srcLocationDescription,
      destLocationDescription: data.destLocationDescription,
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcDocDate: moment(data.srcDocDate),
      destDocNo: data.destDocNo,
      destDocDate: moment(data.destDocDate),
      orderType: data.orderType,
      reqDocNo: data.reqDocNo,
      reqDocDate: moment(data.reqDocDate),
      cancelledRemarks: data.cancelledRemarks,
      cancelledDate: moment(data.cancelledDate),
      remarks: data.remarks,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalMeasuredValue: data.totalMeasuredValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredWeight: data.totalMeasuredWeight,
      invoiceType: data.invoiceType,
      issuedRemarks: data.issuedRemarks,
    };
    return request;
  }

  static getAddress(
    addressLines: string[],
    city: string,
    state: string,
    country: string
  ): string {
    let address = '';

    if (addressLines) {
      for (let i = 0; i < addressLines.length; i++) {
        if (i > 0) {
          address = address + ', ';
        }
        address = address + addressLines[i];
      }
    }

    if (city) {
      address = address + ' ,' + city;
    }

    if (state) {
      address = address + ' ,' + state;
    }
    if (country) {
      address = address + ' ,' + country;
    }

    return address;
  }
}
