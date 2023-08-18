import { Moment } from 'moment';

export interface GvStatusList {
  serialNo: number;
  newlyAdded: boolean;
  giftCode: string;
  regionCode: string;
  denomination: number;
  quantity: number;
  totalValue: number;
  status: string;
  mfgDate: number;
  locationCode: number;
  validityDays: number;
  activationDate: number;
  validFrom: Moment;
  validTill: Moment;
  giftDetails: GiftDetails;
  remarks: string;
  excludes: string[];
  indentNo: number;
  extendCount: number;
}

export class GVExtendValidity {
  giftValidity: GVSerialNoList[];
  remarks: string;
}

export class GVStatusChange {
  giftVoucherStatus: GVStatusChangeList[];
  remarks: string;
}

export interface GVSerialNoList {
  serialNo: number;
  validTill: string;
}

export interface GVStatusChangeList {
  serialNo: number;
  status: string;
}

export interface GiftDetails {
  issuedTo: string;
  customerName: string;
  customerType: string;
  discount: string;
  discountPercentage: string;
}

export interface GVStatusUpdateList {
  gvStatusList: GvStatusList[];
  count: number;
}

export interface GVStatusListingPayload {
  pageIndex?: number;
  pageSize?: number;
  serialNo: string;
  length?: number;
  status?: string;
}
