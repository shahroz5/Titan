export enum GiftCardsTypesEnum {
  GIFTCARD_SALE = 'sale',
  GIFTCARD_BALANCEINQUIRY = 'balance-inquiry',
  GIFTCARD_CANCELLATION = 'cancellation',
  GIFTCARD_RECEIVE = 'receive',
  HISTORY = 'history'
}

export enum GiftCardBinEnum {
  QCGC = 'QCGC'
}

export enum GiftCardTxnEnum {
  CMCAN = 'CMCAN',
  GIFT_SALE = 'GIFT_SALE',
  CM = 'CM',
  QC_VENDOR_CODE = 'QC_GC',
  DIGI_VENDOR = 'SAFE_GOLD',
  GIFT_TYPE = 'CARD',
  CONFIRMED = 'CONFIRMED'
}

export enum RoleCodesEnum {
  RSO = 'RSO'
}

export enum GiftCardErrorMessageEnum {
  DUPLICATE_CARD_ERROR = 'Card is already added!'
}

export enum GiftCardsGridEnum {
  SINGLE = 'single',
  AUTO_HEIGHT = 'autoHeight',
  LEFT = 'left',
  RIGHT = 'right',
  CARD_NO = 'cardNo',
  BIN = 'bin',
  AMOUNT = 'amount',
  INPUT_VALIDATOR = 'inputValidator',
  TAX = 'tax',
  FINAL_PRICE = 'finalPrice',
  DELETE_ROW_RENDERER = 'deleteRowRenderer',
  EDIT_ITEM_COMPONENT = 'editItemComponent'
}

export enum GiftCardTypeValueEnum {
  QUIKCILVER = 'QC',
  VALUEACCESS = 'VALUEACCESS'
}

export enum GcCancelTypesEnum {
  CANCEL_WITH_RETURN = 'CANCEL_WITH_RETURN',
  CANCEL_WITH_CN = 'CANCEL_WITH_CN'
}

export enum CancellationReasonsEnum {
  REASON_1 = 'Reason 1',
  REASON_2 = 'Reason 2',
  REASON_3 = 'Reason 3'
}

export enum GiftCardShellEnum {
  TAB = 'tab'
}

export enum GiftCardPaymentDetailsEnum {
  PAYMENTCODE = 'paymentCode',
  INSTRUMENTNO = 'instrumentNo',
  INSTRUMENTDATE = 'instrumentDate',
  INSTRUMENTTYPE = 'instrumentType',
  PAYERBANKNAME = 'payerBankName',
  AMOUNT = 'amount',
  TOTALCASHCOLLECTED = 'totalCashCollected',
  NUMERICCOLUMN = 'numericColumn'
}

export enum GiftCardsHistorySearchByEnum {
  MOBILE_NO = 'MOBILE_NO',
  GST_NO = 'GST_NO',
  ULP_ID = 'ULP_ID',
  PAN_NO = 'PAN_NO',
  EMAIL_ID = 'EMAIL_ID'
}
