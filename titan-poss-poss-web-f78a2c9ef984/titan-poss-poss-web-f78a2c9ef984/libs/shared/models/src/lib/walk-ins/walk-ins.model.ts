// export interface WalkInsDetails {
//   conversion: number;
//   employeeCode: string;
//   locationCode: string;
//   noOfInvoice: number;
//   walkins: number;
//   purchasers?: number;
//   nonPurchasers?: number;
// }

export interface WalkInsDetails {
  businessDate: number;
  employeeCode?: string;
  noOfInvoice: number;
  nonPurchaserCount: number;
  purchaserCount: number;
  walkins: number;
}

export interface WalkInsDetailsHistoryApiResponse {
  results: [
    {
      businessDate: number;
      noOfInvoice: number;
      nonPurchaserCount: number;
      purchaserCount: number;
      walkins: number;
    }
  ];
}
export interface WalkInsDetailsHistoryResponse {
  businessDate: number | string;
  noOfInvoice: number;
  nonPurchaserCount: number;
  purchaserCount: number;
  walkins: number;
}

// export interface SaveWalkInDetailsRequestPayload {
//   conversion: number;
//   employeeCode: string;
//   locationCode: string;
//   noOfInvoice: number;
//   walkins: number;
// }

export interface SaveWalkInDetailsRequestPayload {
  businessDate: number;
  // conversion: number;
  // employeeCode: string;
  noOfInvoice: number;
  nonPurchaserCount: number;
  purchaserCount: number;
  walkins: number;
}

export interface ConversionCountRequestPayload {
  businessDate: number;
}
export interface WalkInsCountRequestPayload {
  businessDate: number;
}

// export interface ConversionCountResponse {
//   businessDate: number;
//   conversions: number;
// }

export interface WalkInsConversionCount {
  conversions: number;
}
export interface WalkInsCustomerVisitDetails {
  date: number;
  invoices: number;
  purchasers: number;
}
