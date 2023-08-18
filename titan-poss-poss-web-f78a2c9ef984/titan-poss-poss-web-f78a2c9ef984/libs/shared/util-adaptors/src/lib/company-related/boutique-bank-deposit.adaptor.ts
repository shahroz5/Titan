import {
  BankDepositDetails,
  BoutiqueBankDepositEnum,
  BoutiqueBankDepositResponse,
  PendingDatesResponse,
  PifNoResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class BoutiqueBankDepositAdaptor {
  static getBoutiqueBankDepositDetails(
    data: any,
    selectedRowsId
  ): BoutiqueBankDepositResponse {
    const bankDepositDetails: BankDepositDetails[] = [];
    if (data.results && data.results.length) {
      for (const depositDetails of data.results) {
        bankDepositDetails.push({
          collectionDate: depositDetails.collectionDate,
          paymentCode: depositDetails.paymentCode,
          locationCode: depositDetails.locationCode,
          payerBankName: depositDetails.payerBankName,
          payeeBankName: depositDetails.payeeBankName,
          instrumentDate: depositDetails.instrumentDate,
          depositDate: depositDetails.depositDate,
          businessDate: depositDetails.businessDate,
          instrumentNo: depositDetails.instrumentNo,
          amount: depositDetails.amount,
          openingBalance: depositDetails.openingBalance,
          depositAmount: depositDetails.depositAmount,
          pifNo: depositDetails.pifNo,
          midCode: depositDetails.midCode,
          depositDetails: depositDetails.depositDetails,
          isGhsIncluded: depositDetails.isGhsIncluded,
          depositSlipNo: depositDetails.depositSlipNo,
          password: depositDetails.password,
          approvalDetails: depositDetails.approvalDetails,
          isBankingCompleted: depositDetails.isBankingCompleted,
          id: depositDetails.id,
          depositedSlipDate: moment().format('YYYY-MM-DD'),
          isSelected: selectedRowsId.includes(depositDetails.id)
        });
      }
      return { results: bankDepositDetails, totalElements: data.totalElements };
    } else {
      return { results: [], totalElements: 0 };
    }
  }
  static getSaveDepositDetailsResponse(
    data: any
  ): { data: BankDepositDetails[]; totalDepositAmount: number } {
    const bankDepositDetails: BankDepositDetails[] = [];
    let totalDepositAmount = 0;
    for (const depositDetails of data.results) {
      if (
        depositDetails.paymentCode.toUpperCase() ===
          BoutiqueBankDepositEnum.CASH &&
        depositDetails.depositDate !== null
      )
        totalDepositAmount = totalDepositAmount + depositDetails.depositAmount;
      bankDepositDetails.push({
        collectionDate: depositDetails.collectionDate,
        paymentCode: depositDetails.paymentCode,
        locationCode: depositDetails.locationCode,
        payerBankName: depositDetails.payerBankName,
        payeeBankName: depositDetails.payeeBankName,
        instrumentDate: depositDetails.instrumentDate,
        depositDate: depositDetails.depositDate,
        businessDate: depositDetails.businessDate,
        instrumentNo: depositDetails.instrumentNo,
        amount: depositDetails.amount,
        openingBalance: depositDetails.openingBalance,
        depositAmount: depositDetails.depositAmount,
        pifNo: depositDetails.pifNo,
        midCode: depositDetails.midCode,
        depositDetails: depositDetails.depositDetails,
        isGhsIncluded: depositDetails.isGhsIncluded,
        depositSlipNo: depositDetails.depositSlipNo,
        password: depositDetails.password,
        approvalDetails: depositDetails.approvalDetails,
        isBankingCompleted: depositDetails.isBankingCompleted,
        id: depositDetails.id,
        depositedSlipDate: moment().format('YYYY-MM-DD'),
        totalDepositAmount: depositDetails.depositDetails,
        isSelected: true
      });
    }
    return {
      data: bankDepositDetails,
      totalDepositAmount: totalDepositAmount
    };
  }
  static getPendingDates(
    ghsPendingDates,
    servicePendingDates = null
  ): PendingDatesResponse {
    const pendingDates = {
      ghsPendingUploadDates: ghsPendingDates,
      servicePendingUploadDates: servicePendingDates
    };
    return pendingDates;
  }
  static getDepositAmountByPifNo(data: any): PifNoResponse {
    const pifNoResponse = {
      depositAmount: data.amount,
      transactionIds: data.transactionIds,
      denominationDetails: data?.denominationDetails?.denominationDetails?.data
    };
    return pifNoResponse;
  }
}
