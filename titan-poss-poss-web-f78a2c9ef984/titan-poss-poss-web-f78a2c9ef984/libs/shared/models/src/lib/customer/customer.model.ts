import { CUSTOMER_TYPE_ENUM } from './customer.enum';
import { EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import { TransactionTypeEnum } from '../cash-memo/cash-memo.enum';
import { ValidatorFn } from '@angular/forms';

export abstract class CustomerServiceAbstraction {
  public abstract open(serviceConfig?: any): EventEmitter<any>;
}

export abstract class CustomerSummaryAbstraction {
  public abstract open(customerId?: any): EventEmitter<any>;
}

export abstract class PanCardPopupAbstraction {
  public abstract open(
    customerId?: any,
    customerType?: any,
    passportId?: any
  ): EventEmitter<any>;
}

export interface Customers {
  customerDetails?: CustomerDetails;
  customerName?: string;
  customerType?: string;
  emailId?: string;
  isActive?: true;
  mobileNumber?: string;
  title?: string;
  isIndividualCustomer?: boolean;
  customerId?: string;
  ulpId?: string;
  custTaxNo?: string;
  instiTaxNo?: string;
  iscustTaxNoVerified?: boolean;
  isInstiTaxNoVerified?: boolean;
}

export interface UpdateCustomerDetail {
  customerId?: string;
  data?: Customers;
}

export interface CustomerDetails {
  data?: CustomerData;
  type?: string;
}

export interface CustomerData {
  catchmentName?: string;
  birthday?: Moment;
  spouseBirthday?: Moment;
  anniversary?: Moment;
  canSendSMS?: boolean;
  form60AndIdProofSubmitted?: string;
  addressLines?: string[];
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  zone?: string;
  companyName?: string;
  patnerPropriatorship?: string;
  isNRI?: boolean;
  authorizedName?: string;
  landlineNumber?: string;
  altContactNo?: string;
  fullAddress?: string;
  form60Number?: string;
  form60IdType?: string;
  idProof?: string;
  idNumber?: string;
  isHardCopySubmitted?: boolean;
  isIndividualCustomer?: boolean;
}

export interface CustomerLov {
  code?: string;
  isActive?: true;
  value?: string;
}

export interface CatchmentAreas {
  catchmentCode?: string;
  description?: string;
  isActive?: true;
}

export interface PincodeSummary {
  townName?: string;
  stateName?: string;
  cachementArea?: string[];
}

export interface CustomerStateSummary {
  stateId?: string;
  description?: string;
  stateTaxCode?: number;
}

export interface CreatedCustomerResponse {
  customerDetails?: CustomerDetails;
  customerName?: string;
  customerType?: string;
  emailId?: string;
  isActive?: true;
  mobileNumber?: string;
  title?: string;
  customerId?: string;
  ulpId?: string;
  custTaxNo?: string;
  instiTaxNo?: string;
  passportId?: string;
  pointBalance?: number;
  enrollmentDate?: Moment;
  isMemberBlocked?: boolean;
  isPulseCustomer?: boolean;
  currentTier?: string;
  loyaltyDetails?: LoyaltyDetails;
  panHolderName?: string;
  iscustTaxNoVerified?: boolean;
  isInstiTaxNoVerified?: boolean;
  isCalledFromCustomer?: boolean;
  isEmailIdValidationInitiated?: boolean;
  isEmailIdValidated?: boolean;
  isCustTaxMatched?: boolean;
  isForm60Matched?: boolean;
}

export interface CustomerInfo {
  customerId?: string;
  ulpId?: string;
  mobileNumber?: string;
  title?: string;
  customerName?: string;
  isPulseCustomer?: boolean;
  currentTier?: string;
  customerType?: string;
  instiTaxNo?: string;
  passportId?: string;
  custTaxNo?: string;
  panHolderName?: string;
  pointBalance?: number;
  enrollmentDate?: Moment;
  isMemberBlocked?: boolean;
  emailId?: string;
  customerDetails?: CustomerDetails;
  isActive?: true;
  loyaltyDetails?: LoyaltyDetails;
  iscustTaxNoVerified?: boolean;
  isInstiTaxNoVerified?: boolean;
}

export interface SearchByOption {
  description?: string;
  value?: string;
  placeholder?: string;
  customerType?: CUSTOMER_TYPE_ENUM;
  createCustomerLabel?: string;
  validator?: ValidatorFn;
}

export type AllowedTransactionTypeMap = Map<
  CUSTOMER_TYPE_ENUM,
  TransactionTypeEnum[]
>;

export interface LoyaltyDetails {
  data?: LoyaltyData;
  type?: string;
}

export interface RivaahCouponDetail {
  attempts?: number;
  couponCode?: string;
  couponType?: string;
  customerMasterId?: string;
  docDate?: Moment;
  expiryDate?: Moment;
  refId?: string;
  status?: string;
  couponSend?: boolean;
}

export interface LoyaltyData {
  anniversary?: string;
  anniversaryDiscount?: string;
  anniversaryValidityPeriod?: string;
  birthday?: string;
  birthdayDiscount?: string;
  birthdayValdityPeriod?: string;
  child1BirthdayDiscount?: string;
  child1BirthdayValidityPeriod?: string;
  child2BirthdayDiscount?: string;
  child2BirthdayValidityPeriod?: string;
  spouseBirthday?: string;
  spouseBirthdayDiscount?: string;
  spouseBirthdayValidityPeriod?: string;
}

export interface PanVerificationRequestPayload {
  panCardNo?: string;
  panDocument?: any;
  vendorCode?: string;
  verificationType?: string;
}

export interface GstVerificationRequestPayload {
  gstIn?: string;
  vendorCode?: string;
}

export interface ValidatePanResponse {
  message?: string;
  ownerName?: string;
  verificationStatus?: boolean;
}
export interface ValidateGstResponse {
  errorMessage?: string;
  gstIn?: string;
  status?: boolean;
}

export interface PanFormDetailsRequestPayload {
  panNumber?: string;
  isIdProofSubmitted?: boolean;
  typeOfProof?: string;
  idNumber?: string;
  isProfileMatched?: boolean;
  verificationType?: string;
  customerIdDetails?: CustomerIdDetails;
}

export interface CustomerIdDetails {
  id?: string;
  collectedIdProofNumber?: string;
  customerId?: number;
  customerType?: string;
  panHolderName?: string;
  pancardNo?: string;
  txnType?: string;
}
export interface VerifyPanDetailsResponse {
  category?: string;
  name?: string;
  verificationStatus?: string;
}
export interface ValidateEmailResponse {
  emailId?: string;
  invalidationreason?: string;
  validationstatus?: boolean;
}
