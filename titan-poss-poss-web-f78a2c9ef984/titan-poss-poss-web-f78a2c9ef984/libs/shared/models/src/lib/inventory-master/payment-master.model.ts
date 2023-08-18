export interface SavePaymentMasterPayload {
  paymentGroup: string;

  data: {
    customerDependent: boolean;
    paymentCode: string;
    description: string;
    isActive: boolean;
    fieldDetails: {
      fieldCode: string;
      fieldName: string;
      fieldType: string;
      fieldRegex: string;
    }[];
  };
}
export interface PaymentMaster {
  type: string;
  paymentCode: string;
  description: string;
  referenceMandatory?: boolean;
  referenceOne?: string;
  referenceTwo?: string;
  referenceThree?: string;
  isActive: boolean;
  customerDependent: boolean;
  isEditable: boolean;
}
export interface PaymentMasterList {
  results: PaymentMaster[];
  totalElements: number;
}
export interface PaymentMasterListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface UpdatePaymentMasterPayload {
  paymentCode: string;
  paymentGroup: string;
  data: any;
}
export enum paymentMasterEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit',
  regular = 'REGULAR'
}
