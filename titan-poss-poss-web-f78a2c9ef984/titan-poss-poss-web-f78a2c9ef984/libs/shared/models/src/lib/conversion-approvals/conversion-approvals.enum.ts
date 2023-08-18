export enum ConversionApprovalsEnum {
  TAB = 'tab',
  OPEN_REQUESTS = 'open-requests',
  ACKNOWLEDGED_REQUESTS = 'acknowledged-requests',

  OPEN_REQUESTS_TAB_PERMISSIONS = 'ConversionApprovals_OpenRequests_Tab',
  ACKNOWLEDGED_REQUESTS_TAB_PERMISSIONS = 'ConversionApprovals_AcknowledgedRequests_Tab',
  REQUEST_TYPE = 'CONV',
  PARENT = 'PARENT'
}

export enum ConversionApprovalStatus {
  APVL_PENDING = 'APVL_PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  APPROVED = 'APPROVED',
  APVL_REJECTED = 'APVL_REJECTED',
  ACKNOWLEDGE_PENDING = 'ACKNOWLEDGE_PENDING'
}

export enum ConversionStatusColorsEnum {
  ACKNOWLEDGED = 'pw-warning-color',
  ACKNOWLEDGE_PENDING = 'pw-warning-color'
}
