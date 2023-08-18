export interface CustomerDigitalSignatureRequestPayload {
  applicableTransactionTypes: {
    type: string;
    data: {
      isAdvanceOrderOrBooking: boolean;
      isCashMemo: boolean;
      isGHS: boolean;
      isAcceptAdvance: boolean;
      isGRN: boolean;
      isGRF: boolean;
      isGiftCard: boolean;
      isCNCancellation: boolean;
      isTEPDeclarationAndExchangeForm: boolean;
      isGEPDeclarationAndExchangeForm: boolean;
      isCCAFRequestServicePaymentOrCustomerOrder: boolean;
    };
  };
  emailId: string;
  mobileNumber: string;
  ulpNumber: string;
  customerType?: string;
  customerId: string;
}

export interface StoreDetailsResponse {
  storeDetails: {
    type: string;
    data: {
      companyName: string;
      addressLines: string[];
      pincode: string;
    };
  };
}

export interface CustomerDigitalSignatureResponse {
  applicableTransactionTypes: string;
  customerAddress: string;
  customerDocumentTxnId: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  digitalSignature: string;
  mobileNumber: string;
  ulpNumber: string;
  customerType: string;
}

export interface EmployeeSignatureDetailsResponse {
  address: any;
  digitalSignature: string;
  emailId: string;
  empName: string;
  employeeCode: string;
  employeeType: string;
  forcePasswordChange: boolean;
  hasLoginAccess: boolean;
  isActive: boolean;
  isLocked: boolean;
  isLoginActive: boolean;
  locationCode: string;
  mobileNo: string;
  orgCode: string;
  regionCode: string;
  userName: string;
  userType: string;
}
