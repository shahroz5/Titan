export enum BinDetailsRequestTypesEnum {
  BINS = 'bins',
  REQUESTS = 'request',
  //history
  HISTORY = 'binHistory',

}

export enum  BinDetailsStatusTypesEnum {
  ACCEPTED = 'ACCEPTED',
  ACPT_REJECTED = 'ACPT_REJECTED',
  APPROVED = 'APPROVED',
  APVL_REJECTED = 'APVL_REJECTED',
  REQUESTED = 'REQUESTED',
  APVL_PENDING = 'APVL_PENDING',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SELECTED = 'SELECTED',
  ISSUED = 'ISSUED',
  ISSUE_REJECTED = 'ISSUE_REJECTED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CNCL_APVL_PENDING = 'CNCL_APVL_PENDING'
}

export enum  BinDetailsStatusColorsEnum {
  REQUESTED = 'pw-seventh-color',
  ACCEPTED = 'pw-success-color',
  ACPT_REJECTED = 'pw-error-color',
  APPROVED = 'pw-success-color',
  APVL_PENDING = 'pw-warning-color',
  APVL_REJECTED = 'pw-error-color',
  CANCELLED = 'pw-error-color',
  EXPIRED = 'pw-error-color',
  SELECTED = 'pw-success-color',
  ISSUED = 'pw-success-color',
  ISSUE_REJECTED = 'pw-error-color',
  OPEN = 'pw-seventh-color',
  CLOSED = 'pw-error-color',
  CNCL_APVL_PENDING = 'pw-warning-color'
}
