export enum TepTypesEnum {
  CREATE_TEP = 'create-tep',
  CUT_PIECE_TEP = 'cut-piece-tep',
  MANUAL_TEP = 'manual-tep',
  REFUND_STATUS = 'refund-status',
  REQUEST_STATUS = 'request-status',
  SEARCH_TEP = 'search-tep',
  CANCEL_TEP = 'cancel-tep',
  TEP_HISTORY = 'tep-history',
  HISTORY = 'history',
  CANCEL = 'cancel',
  TEP_CUT_PIECE = 'cut_piece_tep'
}

export enum TepShellEnum {
  TAB = 'tab'
}

export enum CreateTepTypesEnum {
  REGULAR_TEP = 'NEW_TEP',
  INTER_BRAND_TEP = 'INTER_BRAND_TEP',
  FULL_VALUE_TEP = 'FULL_VALUE_TEP',
  CUT_PIECE_TEP = 'CUT_PIECE_TEP',
  TEP_EXCEPTION_APPROVAL_WORKFLOW = 'TEP_EXCEPTION_APPROVAL_WORKFLOW',
  MANUAL_TEP = 'MANUAL_TEP',
  MANUAL_INTER_BRAND_TEP = 'MANUAL_INTER_BRAND_TEP',
  MANUAL_FULL_VALUE_TEP = 'MANUAL_FULL_VALUE_TEP'
}

export enum TepPaymentTypesEnum {
  CN = 'CN',
  REFUND = 'REFUND'
}

export enum TepTxnTypesEnum {
  TEP = 'TEP',
  NEW_TEP = 'NEW_TEP'
}

export enum TepStatusEnum {
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  HOLD = 'HOLD',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  APPROVAL_PENDING = 'APPROVAL_PENDING'
}

export enum TepTypes {
  REGULAR_TEP = 'REGULAR_TEP',
  INTER_BRAND_TEP = 'INTER_BRAND_TEP'
}

export enum RefundOptionTypes {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  RTGS = 'RTGS',
  RO_RTGS = 'RO RTGS',
  RO_PAYMENT = 'RO PAYMENT',
  AIRPAY = 'AIRPAY',
  CC = 'CC',
  CARD = 'CARD',
  RAZORPAY = 'RAZOR PAY',
  WALLET = 'WALLET',
  VOID_UNIPAY = 'VOID_UNIPAY'
}

export enum TepUploadTypes {
  ID_PROOF = 'ID_PROOF',
  CANCELLED_CHEQUE = 'CANCELLED_CHEQUE',
  APPROVAL_MAIL = 'APPROVAL_MAIL'
}

export enum TepWorkflowTypes {
  TEP_APPROVAL_WORKFLOW = 'TEP_APPROVAL_WORKFLOW',
  FULL_VALUE_WORKFLOW = 'FULL_VALUE_TEP'
}

export enum RefundDateRangeTypeEnum {
  TODAY = 'TODAY',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
  ALL = 'ALL'
}

export enum RefundStatusEnum {
  PENDING_FROM_RO = 'PENDING_FROM_RO',
  REFUNDED = 'REFUNDED',
  REJECTED = 'REJECTED',
  ALLOWED_TO_CANCEL = 'ALLOWED_TO_CANCEL',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  CANCELLED = 'CANCELLED'
}

export enum RefundStatusDescriptionEnum {
  PENDING_FROM_RO = 'PENDING FROM RO',
  REFUNDED = 'REFUNDED',
  REJECTED = 'REJECTED',
  ALLOWED_TO_CANCEL = 'ALLOWED TO CANCEL',
  APPROVAL_PENDING = 'APPROVAL PENDING',
  CANCELLED = 'CANCELLED'
}
