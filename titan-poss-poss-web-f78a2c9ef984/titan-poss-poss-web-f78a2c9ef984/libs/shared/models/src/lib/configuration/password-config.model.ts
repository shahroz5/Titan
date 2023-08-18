import { Moment } from 'moment';

export interface GenerateBoutiquePasswordForManualBillRequest {
  locationCode: string;
  manualBillDate: number;
  manualBillNo: string;
  manualBillValue: number;
  metalRates: any;
  remarks: string;
  txnType: string;
}

export interface GenerateBoutiquePasswordForManualBillResponse {
  id: string;
  locationCode: string;
  manualBillDate: Moment;
  manualBillNo: string;
  manualBillValue: number;
  metalRates: any;
  password: string;
  remarks: string;
  txnType: string;
  isOld: boolean;
}

export interface GenerateBoutiquePasswordForGoldRateRequest {
  locationCode: string;
  applicableDate: number;
  metalRates: any;
  remarks: string;
}

export interface GenerateBoutiquePasswordForGoldRateResponse {
  id: string;
  locationCode?: string;
  applicableDate: Moment;
  metalRates: any;
  password: string;
  remarks?: string;
}

export interface GenerateCashDepositPasswordResponse {
  businessDate: Moment;
  collectionDate: Moment;
  depositAmount: number;
  id: string;
  locationCode: string;
  password: string;
  remarks: string;
}

export interface GenerateCashDepositPasswordRequest {
  businessDate: number;
  collectionDate: number;
  depositAmount: number;
  locationCode: string;
  remarks: string;
}
