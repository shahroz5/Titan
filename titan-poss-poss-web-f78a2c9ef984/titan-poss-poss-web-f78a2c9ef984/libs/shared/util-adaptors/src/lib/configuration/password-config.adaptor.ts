import {
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateCashDepositPasswordResponse
} from '@poss-web/shared/models';

export class PasswordConfigAdaptor {
  /**
   * The function maps the json data to respective model type
   */

  static generateBoutiquePasswordResponseForManualBillFromJson(
    data: any
  ): GenerateBoutiquePasswordForManualBillResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      locationCode: data.locationCode,
      manualBillDate: data.manualBillDate,
      manualBillNo: data.manualBillNo,
      manualBillValue: data.manualBillValue,
      metalRates: data.metalRates,
      password: data.password,
      remarks: data.remarks,
      txnType: data.txnType,
      isOld: data.isOld
    };
  }

  static generateBoutiquePasswordResponseForGoldRateFromJson(
    data: any
  ): GenerateBoutiquePasswordForGoldRateResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      locationCode: data.locationCode,
      applicableDate: data.applicableDate,
      metalRates: data.metalRates,
      password: data.password,
      remarks: data.remarks
    };
  }

  static generateCashDepositPasswordResponseFromJson(
    data: any
  ): GenerateCashDepositPasswordResponse {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      locationCode: data.locationCode,
      businessDate: data.businessDate,
      collectionDate: data.collectionDate,
      password: data.password,
      depositAmount: data.depositAmount,
      remarks: data.remarks
    };
  }
}
