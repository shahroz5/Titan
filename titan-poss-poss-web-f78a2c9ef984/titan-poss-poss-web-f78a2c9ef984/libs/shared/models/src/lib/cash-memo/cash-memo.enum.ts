export enum CashMemoTypesEnum {
  GEP = 'new',
  MANUAL_GEP = 'manual',
  CANCEL_GEP = 'cancel',
  CM = 'cash-memo',
  AB = 'advance-booking',
  QUICK_CM = 'quick-cash-memo',
  MANUAL_BILL = 'manual-bill',
  MANUAL_ADB = 'manual',
  HISTORY = 'history',
  CM_REQUESTS = 'cm-requests',
  Search_AB = 'search-advance-booking',
  BC = 'bill-cancel',
  CREATE_AB = 'create'
}

export enum advanceBookingEnum {
  CREATE_AB = 'create',
  SEARCH_AB = 'search',
  ACTIVATE_AB = 'activate',
  CANCEL_AB = 'cancel',
  VIEW_AB = 'view',
  CANCEL_REQUEST = 'cancel-request',
  ACTIVATE_REQUEST = 'activate-request',
  FREEZE = 'freeze'
}

export enum PriceTypeEnum {
  METAL_PRICE,
  STONE_CHARGE,
  MAKING_CHARGE,
  UCP_PRICE,
  HALLMARKING_CHARGE
}

export enum TransactionTypeEnum {
  GEP = 'GEP',
  CM = 'CM',
  NEW_CM = 'NEW_CM',
  CANCEL_GEP = 'CANCEL_GEP',
  CUST_TRANSACTION_CM = 'CUST_TRANSACTION_CM',
  CUST_TRANSACTION_AB = 'CUST_TRANSACTION_ADV_BOOKING',
  AB = 'AB',
  ADV = 'ADV',
  CUST_TRANSACTION_ADV_BOOKING = 'CUST_TRANSACTION_ADV_BOOKING',
  CO = 'CO',
  GRN = 'GRN',
  TEP = 'TEP',
  GRF = 'GRF',
  CMCAN = 'CMCAN',
  MERGE_GRF = 'MERGE_GRF',
  GIFT_SALE = 'GIFT_SALE',
  CN_REDEMPTION = 'CN_REDEMPTION',
  GHS_REDEMPTION = 'GHS_REDEMPTION'
}

export enum SubTransactionTypeEnum {
  NEW_GEP = 'NEW_GEP',
  MANUAL_GEP = 'MANUAL_GEP',
  MANUAL_GRF = 'MANUAL_GRF',
  NEW_CM = 'NEW_CM',
  QUICK_CM = 'QUICK_CM',
  MANUAL_CM = 'MANUAL_CM',
  CANCEL_GEP = 'CANCEL_GEP',
  GIFT_SALE = 'GIFT_SALE',
  NEW_AB = 'NEW_AB',
  MANUAL_AB = 'MANUAL_AB',
  NON_FROZEN_RATES = 'NON_FROZEN_RATES',
  FROZEN_RATES = 'FROZEN_RATES',
  NEW_TEP = 'NEW_TEP',
  CUT_PIECE_TEP = 'CUT_PIECE_TEP',
  TEP_CAN = 'TEPCAN',
  MANUAL_TEP = 'MANUAL_TEP',
  FOC_CM = 'FOC_CM',
  MANUAL_FROZEN_RATES = 'MANUAL_FROZEN_RATES',
  NEW_CO = 'NEW_CO',
  MANUAL_CO = 'MANUAL_CO'
}

export enum StatusTypesEnum {
  HOLD = 'HOLD',
  OPEN = 'OPEN',
  CANCEL = 'CANCEL',
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  SUSPENDED = 'SUSPENDED',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PARTIAL_INVOICE = 'PARTIAL_INVOICE',
  DELETED = 'DELETED',
  CANCELLATION_PENDING = 'CANCELLATION_PENDING',
  NEWCANCELLED = 'CANCELLED',
  CANCEL_AFTER_REQUEST = 'CANCEL_AFTER_REQUEST',
  CANCEL_BEFORE_REQUEST = 'CANCEL_BEFORE_REQUEST'
}

export enum ProductTypesEnum {
  REGULAR = 'REGULAR',
  COINS = 'COINS',
  FOC = 'FOC',
  PLAIN = 'PLAIN',
  STUDDED = 'STUDDED'
}

export enum ProductGridFieldsEnum {
  ITEMCODE = 'itemCode',
  SELECTEDLOTNUMBER = 'selectedLotNumber',
  UNITWEIGHT = 'unitWeight',
  ACTUALWEIGHT = 'actualWeight',
  SELECTEDRSO = 'selectedRso',
  PRICEPERUNIT = 'pricePerUnit',
  DISCOUNT = 'discount',
  FINALPRICE = 'finalPrice',
  DELETE = 'delete',
  SELECT = 'select',
  HMQUANTITY = 'hmQuantity',
  AGE = 'age',
  FOCFORHM = 'isFOCForHallmarkingCharges',
  ISHM = 'isHallmarked',
  ROWID = 'rowId'
}

export enum OccasionTypesEnum {
  BIRTHDAY = 'birthday',
  ANNIVERSARY = 'anniversary',
  SPOUSE_BIRTHDAY = 'spouseBirthday'
}

export enum ValidationTypesEnum {
  PASSWORD_VALIDATION = 'PASSWORD_VALIDATION',
  REQUEST_APPROVAL = 'REQUEST_APPROVAL',
  PASSWORD = 'Password Validation',
  APPROVAL = 'Request Approval',
  SENT_FOR_APPROVAL = 'Sent For Approval',
  REGULARIZE = 'REGULARIZE',
  SENDAPPROVAL = 'SENDAPPROVAL',
  EXPIRED = 'Expired'
}

export enum RuleTypesEnum {
  WEIGHT_TOLERANCE = 'Weight Tolerance',
  ORDER_AB_FROZEN_TOLERANCE = 'ORDER_AB_FROZEN_TOLERANCE',
  BGR_TOLERANCE_CONFIG = 'BGR_TOLERANCE_CONFIG',
  ORDER_AB_BGR_CONFIG = 'ORDER_AB_BGR_CONFIG',
  GRF_CONFIGURATION = 'GRF_CONFIGURATION',
  GRN_CONFIGURATION = 'GRN_TOLERANCE_CONFIG'
}

export enum RangeTypesEnum {
  ORDER_TOTAL_WEIGHT = 'ORDER_TOTAL_WEIGHT',
  BGR_WEIGHT_TOLERANCE = 'BGR_WEIGHT_TOLERANCE'
}

export enum MetalNamesEnum {
  J = 'Gold',
  P = 'Silver',
  L = 'Platinum'
}

export enum ImageTypesEnum {
  MANUAL_BILL = 'MANUAL_BILL'
}

export enum CashMemoRouteEnum {
  REGULAR = 'regular',
  MANUAL = 'manual',
  FOC = 'foc'
}

export enum CashMemoHistorySearchByEnum {
  MOBILE_NO = 'MOBILE_NO',
  GST_NO = 'GST_NO',
  ULP_ID = 'ULP_ID',
  PAN_NO = 'PAN_NO',
  EMAIL_ID = 'EMAIL_ID',
  CUSTOMER_NAME = 'CUSTOMER_NAME'
}

export enum EncircleTypesEnum {
  ULP_DISCOUNT_BIRTHDAY = 'ULP_DISCOUNT_BIRTHDAY',
  ULP_DISCOUNT_ANNIVERSARY = 'ULP_DISCOUNT_ANNIVERSARY',
  ULP_DISCOUNT_SPOUSE_BIRTHDAY = 'ULP_DISCOUNT_SPOUSE_BIRTHDAY'
}

export enum EncircleEligibleTypesEnum {
  ULP_DISCOUNT_BIRTHDAY = 'MB',
  ULP_DISCOUNT_ANNIVERSARY = 'Y',
  ULP_DISCOUNT_SPOUSE_BIRTHDAY = 'MSB'
}

export enum TaxTypesEnum {
  HALLMARK_GST = 'HMGST'
}

export enum LotNumberSelectionEnum {
  LOTNUMBER = 'lotNumber'
}
