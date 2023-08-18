export enum AdvanceBookingActionTypesEnum {
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  CANCEL = 'CANCEL',
  ACTIVATE_REQUEST = 'ACTIVATE_REQUEST',
  ACTIVATE = 'ACTIVATE',
  RATE_FREEZE = 'RATE_FREEZE',
  ADD_PAYMENT = 'ADD_PAYMENT'
}

export enum FreezeRateEnum {
  YES = 'Yes',
  NO = 'No'
}

export enum ABSearchActionType {
  CANCEL = 'CANCEL',
  ACTIVATE = 'ACTIVATE',
  FREEZE = 'RATE_FREEZE',
  VIEW_ORDERS = 'VIEW_ORDERS',
  ADD_PAYMENTS = 'ADD_PAYMENT'
}

export enum SearchListFields {
  FINAL_VALUE = 'finalValue',
  SUB_TXNTYPE = 'subTxnType'
}

export enum ABSubTxnTypes {
  NEW_AB = 'New AB',
  MANUAL_AB = 'Manual AB'
}

export enum RequestDropdownvalues {
  CANCEL_AB = 'CANCEL_ADVANCE_BOOKING',
  ACTIVATE_AB = 'ACTIVATE_ADVANCE_BOOKING',
  MANUAL_BILL_AB = 'ADVANCE_BOOKING_MANUAL_BILL'
}
