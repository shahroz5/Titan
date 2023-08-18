import {
  InterBoutiqueTransferStatusColorsEnum,
  BinToBinTransferStatusColorsEnum,
  CreditNoteStatusColorsEnum,
  StatusMessagesEnum,
  ConversionStatusColorsEnum
} from '@poss-web/shared/models';

export const commonTranslateKeyMap = new Map();

commonTranslateKeyMap.set('REQUESTED', {
  status: 'pw.statusMessages.REQUESTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.REQUESTED
});
commonTranslateKeyMap.set('ACCEPTED', {
  status: 'pw.statusMessages.ACCEPTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ACCEPTED
});
commonTranslateKeyMap.set('ACPT_REJECTED', {
  status: 'pw.statusMessages.ACPT_REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ACPT_REJECTED
});
commonTranslateKeyMap.set('REJECTED', {
  status: 'pw.statusMessages.REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ACPT_REJECTED
});
commonTranslateKeyMap.set('APPROVED', {
  status: 'pw.statusMessages.APPROVED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APPROVED
});
commonTranslateKeyMap.set('APVL_PENDING', {
  status: 'pw.statusMessages.APVL_PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});
commonTranslateKeyMap.set('ACKNOWLEDGED', {
  status: 'pw.statusMessages.ACKNOWLEDGED',
  statusColor: ConversionStatusColorsEnum.ACKNOWLEDGED
});
commonTranslateKeyMap.set('ACKNOWLEDGE_PENDING', {
  status: 'pw.statusMessages.ACKNOWLEDGE_PENDING',
  statusColor: ConversionStatusColorsEnum.ACKNOWLEDGE_PENDING
});
commonTranslateKeyMap.set('PENDING', {
  status: 'pw.statusMessages.PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});
commonTranslateKeyMap.set('APVL_REJECTED', {
  status: 'pw.statusMessages.APVL_REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_REJECTED
});
commonTranslateKeyMap.set('CANCELLED', {
  status: 'pw.statusMessages.CANCELLED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.CANCELLED
});
commonTranslateKeyMap.set('EXPIRED', {
  status: 'pw.statusMessages.EXPIRED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.EXPIRED
});
commonTranslateKeyMap.set('SUSPENDED', {
  status: 'pw.statusMessages.SUSPENDED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.EXPIRED
});
commonTranslateKeyMap.set('SELECTED', {
  status: 'pw.statusMessages.SELECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.SELECTED
});
commonTranslateKeyMap.set('ISSUED', {
  status: 'pw.statusMessages.ISSUED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ISSUED
});
commonTranslateKeyMap.set('ISSUE_REJECTED', {
  status: 'pw.statusMessages.ISSUE_REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ISSUE_REJECTED
});
commonTranslateKeyMap.set('OPEN', {
  status: 'pw.statusMessages.OPEN',
  statusColor: InterBoutiqueTransferStatusColorsEnum.OPEN
});
commonTranslateKeyMap.set('CLOSED', {
  status: 'pw.statusMessages.CLOSED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.CLOSED
});
commonTranslateKeyMap.set('CNCL_APVL_PENDING', {
  status: 'pw.statusMessages.CNCL_APVL_PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.CNCL_APVL_PENDING
});
commonTranslateKeyMap.set('COMPLETED', {
  status: 'pw.statusMessages.COMPLETED',
  statusColor: BinToBinTransferStatusColorsEnum.COMPLETED
});
commonTranslateKeyMap.set('RECEIVED', {
  status: 'pw.statusMessages.RECEIVED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.RECEIVED
});
commonTranslateKeyMap.set('VERIFIED', {
  status: 'pw.statusMessages.VERIFIED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.VERIFIED
});
commonTranslateKeyMap.set('PUBLISHED', {
  status: 'pw.statusMessages.PUBLISHED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.PUBLISHED
});
///////////////////////
commonTranslateKeyMap.set('IN_PROGRESS', {
  status: 'pw.statusMessages.IN_PROGRESS',
  statusColor: InterBoutiqueTransferStatusColorsEnum.IN_PROGRESS
});
commonTranslateKeyMap.set('INPROGRESS', {
  status: 'pw.statusMessages.INPROGRESS',
  statusColor: InterBoutiqueTransferStatusColorsEnum.IN_PROGRESS
});
commonTranslateKeyMap.set('REJECTED', {
  status: 'pw.statusMessages.REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.REJECTED
});
commonTranslateKeyMap.set('FAILED', {
  status: 'pw.statusMessages.FAILED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.FAILED
});

commonTranslateKeyMap.set('ACTIVATION_PENDING', {
  status: 'pw.statusMessages.PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});
commonTranslateKeyMap.set('CANCELLATION_PENDING', {
  status: 'pw.statusMessages.PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});

commonTranslateKeyMap.set('CONFIRMED', {
  status: 'pw.statusMessages.ACCEPTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ACCEPTED
});

commonTranslateKeyMap.set('HOLD', {
  status: 'pw.statusMessages.PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});

commonTranslateKeyMap.set('APPROVAL_PENDING', {
  status: 'pw.statusMessages.PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APVL_PENDING
});
commonTranslateKeyMap.set('REDEEMED', {
  status: 'pw.statusMessages.REDEEMED',
  statusColor: CreditNoteStatusColorsEnum.REDEEMED
});
commonTranslateKeyMap.set('TRANSFER_GHS', {
  status: 'pw.statusMessages.TRANSFER_GHS',
  statusColor: CreditNoteStatusColorsEnum.TRANSFER_GHS
});

export enum commonEnums {
  Requested = 'REQUESTED',
  Accepted = 'ACCEPTED',
  Accept_Rejected = 'ACPT_REJECTED',
  Approved = 'APPROVED',
  Approval_Pending = 'APVL_PENDING',
  Acknowledged = 'ACKNOWLEDGED',
  Approval_Rejected = 'APVL_REJECTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Selected = 'SELECTED',
  Issued = 'ISSUED',
  Issue_Rejected = 'ISSUE_REJECTED',
  Open = 'OPEN',
  Closed = 'CLOSED',
  Cancel_Approval_Pending = 'CNCL_APVL_PENDING',
  Verified = 'VERIFIED',
  Received = 'RECEIVED',
  In_Progress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Rejected = 'Rejected',
  Failed = 'FAILED',
  Suspended = 'SUSPENDED',
  InProgress = 'INPROGRESS',
  Redeemed = 'REDEEMED',
  Transfer_GHS = 'TRANSFER_GHS',
  Published = 'PUBLISHED'
}

export const commonStatusTranslateKeyMap = new Map();

commonStatusTranslateKeyMap.set('HOLD', {
  status: StatusMessagesEnum.HOLD
});
commonStatusTranslateKeyMap.set('CONFIRMED', {
  status: StatusMessagesEnum.CONFIRMED
});
commonStatusTranslateKeyMap.set('OPEN', {
  status: StatusMessagesEnum.OPEN
});
commonStatusTranslateKeyMap.set('CANCELLATION_PENDING', {
  status: StatusMessagesEnum.CANCELLATION_PENDING
});
commonStatusTranslateKeyMap.set('CANCELLED', {
  status: StatusMessagesEnum.CANCELLED
});
commonStatusTranslateKeyMap.set('DELETED', {
  status: StatusMessagesEnum.DELETED
});
commonStatusTranslateKeyMap.set('APPROVAL_PENDING', {
  status: StatusMessagesEnum.APPROVAL_PENDING
});
commonStatusTranslateKeyMap.set('EXPIRED', {
  status: StatusMessagesEnum.EXPIRED
});
commonStatusTranslateKeyMap.set('SUSPENDED', {
  status: StatusMessagesEnum.SUSPENDED
});
commonStatusTranslateKeyMap.set('ACTIVATION_PENDING', {
  status: StatusMessagesEnum.ACTIVATION_PENDING
});
commonStatusTranslateKeyMap.set('CLOSED', {
  status: StatusMessagesEnum.CLOSED
});
commonStatusTranslateKeyMap.set('RESIDUAL_CLOSURE', {
  status: StatusMessagesEnum.RESIDUAL_CLOSURE
});
commonStatusTranslateKeyMap.set('PARTIAL_INVOICE', {
  status: StatusMessagesEnum.PARTIAL_INVOICE
});
commonStatusTranslateKeyMap.set('DELIVERED', {
  status: StatusMessagesEnum.DELIVERED
});
commonStatusTranslateKeyMap.set('RELEASED', {
  status: StatusMessagesEnum.RELEASED
});

export const commonRefundTranslateKeyMap = new Map();

commonRefundTranslateKeyMap.set('APPROVAL_PENDING', {
  status: 'pw.statusMessages.APPROVAL_PENDING',
  statusColor: InterBoutiqueTransferStatusColorsEnum.APPROVAL_PENDING
});
commonRefundTranslateKeyMap.set('PENDING_FROM_RO', {
  status: 'pw.statusMessages.PENDING_FROM_RO',
  statusColor: InterBoutiqueTransferStatusColorsEnum.PENDING_FROM_RO
});

commonRefundTranslateKeyMap.set('REJECTED', {
  status: 'pw.statusMessages.REJECTED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.REJECTED
});
commonRefundTranslateKeyMap.set('REFUNDED', {
  status: 'pw.statusMessages.REFUNDED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.REFUNDED
});

commonRefundTranslateKeyMap.set('CONFIRMED', {
  status: StatusMessagesEnum.CONFIRMED,
  statusColor: InterBoutiqueTransferStatusColorsEnum.RECEIVED
});

commonRefundTranslateKeyMap.set('ALLOWED_TO_CANCEL', {
  status: 'pw.statusMessages.ALLOWED_TO_CANCEL',
  statusColor: InterBoutiqueTransferStatusColorsEnum.ALLOWED_TO_CANCEL
});

commonRefundTranslateKeyMap.set('CANCELLED', {
  status: 'pw.statusMessages.CANCELLED',
  statusColor: InterBoutiqueTransferStatusColorsEnum.REJECTED
});
