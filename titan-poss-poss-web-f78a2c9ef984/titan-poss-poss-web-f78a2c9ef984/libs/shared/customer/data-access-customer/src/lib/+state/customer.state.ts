import {
  CustomErrors,
  TownSummary,
  CustomerLov,
  AllowedTransactionTypeMap,
  CustomerInfo,
  PincodeSummary,
  CreatedCustomerResponse,
  Brand,
  ValidatePanResponse,
  ValidateGstResponse,
  RivaahCouponDetail,
  ValidateEmailResponse,
  VerifyPanDetailsResponse
} from '@poss-web/shared/models';
import { CountryEntity, StateEntity, ZoneEntity } from './customer.entity';

export interface CustomerState {
  error: CustomErrors;
  isLoading: boolean;
  countries: CountryEntity;
  states: StateEntity;
  salutations: CustomerLov[];
  idProofList: CustomerLov[];
  city: TownSummary[];
  pincode: PincodeSummary;

  isSearchingCustomer: boolean;
  hasCustomerResult: boolean;
  searchCustomerResult: CustomerInfo;
  searchOneTimeCustomer: CustomerInfo[];
  selectedCustomer: any;
  searchError: CustomErrors;
  selectedCustomerDetail: CreatedCustomerResponse;
  isCustomerSaving: boolean;
  createdCustomerStatus: {
    customerId: string;
    customerType: string;
    ulpId: string;
  };
  updatedCustomerStatus: boolean;
  customerDetails: CustomerInfo;

  zones: ZoneEntity;
  isUniqueCustomer: boolean;
  isUniqueEmail: boolean;
  isUniquePan: boolean;
  isUniqueGst: boolean;
  isUniquePassport: boolean;

  countryCode: string;

  enableClear: boolean;
  enableEdit: boolean;
  enableCreate: boolean;

  allowedTransactionTypes: AllowedTransactionTypeMap;
  brandDetails: Brand;
  panVerificationResponse: ValidatePanResponse;
  gstVerificationResponse: ValidateGstResponse;
  emailValidationResponse: ValidateEmailResponse;
  catchmentList: [];

  rivaahCouponDetail: RivaahCouponDetail;
  verifyPanDetailsResponse: VerifyPanDetailsResponse;
}

export const customerFetureKey = 'customer';
