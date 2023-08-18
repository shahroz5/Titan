export interface CashPaymentConfiguration {
  ruleId: number;
  ruleType: string;
  description: string;
  ruleDetails: RuleDetails;
  isActive: boolean;
}

export interface RuleDetails {
  type: string;
  data: Data;
}

export interface Data {
  cashAmountMaxCap: string;
  validFrom: Date;
  applicableDays: ApplicableDays;
  applicablePaymentType: ApplicablePaymentType;
  applicableTransaction: ApplicableTransaction;
  l1l2Stores: boolean;
  applicableL1L2Stores: applicableL1L2L3Stores;
  l3Stores: boolean;
  applicableL3Stores: applicableL1L2L3Stores;
  cummulativeCashValue: boolean;
  cashRefundSetting: {
    refundCashLimit: string;
  };
  pmlaSettings: PmlaSettings;
}

export interface PmlaSettings {
  cashAmountMaxCap: string;
  l1l2Stores?: boolean;
  l3Stores?: boolean;
  applicableL1L2Stores?: ApplicableLStores;
  applicableL3Stores?: ApplicableLStores;
}

export interface ApplicableLStores {
  sameStore: boolean;
  sameState: boolean;
  acrossCountry: boolean;
}

export interface ApplicableDays {
  isVariableDay: boolean;
  isSingleDay: boolean;
}

export interface ApplicablePaymentType {
  grn: boolean;
  cnIBT: boolean;
  ghsMaturity: boolean;
  advanceCN: boolean;
  billCancel: boolean;
  giftCard: boolean;
}

export interface ApplicableTransaction {
  advanceBooking: boolean;
  cashMemo: boolean;
  //assm: boolean;
  grf: boolean;
  //quickCM: boolean;
  giftCardValue: boolean;
  ghs: boolean;
  customerOrder: boolean;
  acceptAdvance: boolean;
  servicePoss: boolean;
}

export interface applicableL1L2L3Stores {
  sameStore: boolean;
  sameState: boolean;
  acrossCountry: boolean;
}

/*
 export interface CashPaymentConfiguration {
    results: Result[];
}

export interface Result {
    ruleId: number;
    ruleType: string;
    values: Value[];
}

export interface Value {
    fieldCode: string;
    fieldValue: string;
    fieldDetails: FieldDetails;
}

export interface FieldDetails {
    type: string;
    data: Data;
}

export interface Data {
    validFrom: string;
    applicableDays: ApplicableDays;
    applicablePaymentType: ApplicablePaymentType;
    applicableTransaction: ApplicableTransaction;
    cummulativeCashValue: string;
}

export interface ApplicableDays {
    isVariableDay: string;
    isSingleDay: string;
}

export interface ApplicablePaymentType {
    grn: string;
    ghsMaturity: string;
    advanceCN: string;
    billCancel: string;
    giftCard: string;
}

export interface ApplicableTransaction {
    advanceBooking: string;
    cashMemo: string;
    ghs: string;
    customerOrder: string;
    acceptAdvance: string;
}
 */
