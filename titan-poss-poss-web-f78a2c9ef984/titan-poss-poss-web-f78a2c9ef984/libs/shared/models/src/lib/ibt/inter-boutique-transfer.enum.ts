/**
 * Inter-boutique-transfer enum types
 */
export enum InterBoutiqueTransferRequestTypesEnum {
  SENT = 'sent',
  RECEIVED = 'received',
  //history
  HISTORY = 'history',
  ISSUE = 'ISSUE',
  RECEIVE = 'RECEIVE',
  REQUESTDATE = 'REQUESTDATE',
  ACCEPTEDDATE = 'ACCEPTEDDATE'
}

export enum InterBoutiqueTransferStatusTypesEnum {
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

export enum InterBoutiqueTransferStatusColorsEnum {
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
  CNCL_APVL_PENDING = 'pw-warning-color',
  RECEIVED = 'pw-success-color',
  VERIFIED = 'pw-success-color',
  IN_PROGRESS = 'pw-warning-color',
  REJECTED = 'pw-error-color',
  FAILED = 'pw-error-color',
  APPROVAL_PENDING = 'pw-warning-color',
  PENDING_FROM_RO = 'pw-warning-color',
  REFUNDED = 'pw-success-color',
  ALLOWED_TO_CANCEL = 'pw-warning-color',
  PUBLISHED = 'pw-success-color'
}

export enum IBTBoutiquesFilterEnum {
  ALL = 'All',
  TOWN = 'Town',
  STATE = 'State',
  REGION = 'Region',
  COUNTRY = 'Country'
}
