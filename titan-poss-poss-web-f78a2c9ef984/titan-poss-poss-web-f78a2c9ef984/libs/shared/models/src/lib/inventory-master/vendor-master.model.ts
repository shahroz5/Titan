export interface VendorMaster {
  vendorCode: string;
  vendorType: string;
  vendorName: string;
  baseUrl: string;
  vendorDetail: string;
  isActive?: string;
}
export interface VendorMasterListPayload {
  pageIndex: number;
  pageSize: number;
}

export interface VendorMasterListing {
  results: VendorMaster[];
  totalElements: number;
}

export interface UpdateVendorMasterPayload {
  vendorCode: string;
  data: any;
}

// export interface DialogDataPriceGroup {
//   priceGroupDetail: PriceGroupMaster;
// }
export enum vendorMasterEnum {
  new = 'new',
  edit = 'edit'
}

export enum VENDOR_CODE_ENUMS {
  PAYMENT_AIRPAY = 'PAYMENT_AIRPAY',
  AWS_S3 = 'AWS_S3',
  DIAL_MILESTONE = 'DIAL_MILESTONE',
  EMAIL_VALIDATION_TITAN = 'EMAIL_VALIDATION_TITAN',
  DIAL_TRIDENT = 'DIAL_TRIDENT',
  EMAIL_GMAIL = 'EMAIL_GMAIL',
  ERP_API = 'ERP_API',
  GHS = 'GHS',
  IRN_ASPTAX = 'IRN_ASPTAX',
  LEGACY_API = 'LEGACY_API',
  ULP_NETCARROTS = 'ULP_NETCARROTS',
  PAN_KHOSLA = 'PAN_KHOSLA',
  QC_GC = 'QC_GC',
  PAYMENT_RAZORPAY = 'PAYMENT_RAZORPAY',
  SAFE_GOLD = 'SAFE_GOLD',
  EPOSS_SFTP = 'EPOSS_SFTP',
  SMS_KAP = 'SMS_KAP',
  POSS_TITAN = 'POSS_TITAN'
}
