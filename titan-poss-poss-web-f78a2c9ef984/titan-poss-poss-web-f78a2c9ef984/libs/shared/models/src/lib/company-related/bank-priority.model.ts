export interface BankPriority {
  bankName: string;
  priority?: string;
  locatiocode?: string;
}
export enum BankPriorityEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit'
}

export interface SaveBankPriorityFormDetailsPayload {
  addPriority: { bankName: string; priority: string; locationCode: string }[];
  removePriority: string[];
}

export interface LoadBankPriorityListingPayload {
  bankPriorityListing: BankPriority[];
}

export interface LoadBankPriorityListingSuccessPayload {
  bankPriorityListing: BankPriority[];
  totalElements: number;
}
