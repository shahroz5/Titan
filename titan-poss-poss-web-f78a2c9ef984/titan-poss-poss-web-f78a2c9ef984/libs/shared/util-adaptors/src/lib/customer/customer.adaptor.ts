import {
  CatchmentAreas,
  Pincode,
  PincodeSummary,
  CreatedCustomerResponse,
  CustomerStateSummary,
  ValidatePanResponse,
  ValidateGstResponse,
  RivaahCouponDetail,
  ValidateEmailResponse,
  VerifyPanDetailsResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class CustomerDataAdaptor {
  static catchmentDataFromJson(data: any): CatchmentAreas[] {
    const catchmentAreaData: CatchmentAreas[] = [];
    for (const catchmentArea of data.results) {
      catchmentAreaData.push({
        description: catchmentArea.description,
        catchmentCode: catchmentArea.catchmentCode,
        isActive: catchmentArea.isActive
      });
    }
    return catchmentAreaData;
  }

  static customerFromJson(
    data: any,
    isCalledFromCustomer?: boolean
  ): CreatedCustomerResponse {
    console.log('customer', data);
    return {
      customerId: data?.customerId ? data?.customerId : null,
      ulpId: data?.ulpId ? data?.ulpId : '',
      mobileNumber: data?.mobileNumber ? data?.mobileNumber : '',
      title: data?.title ? data?.title : '',
      customerName: data?.customerName ? data?.customerName : '',
      isPulseCustomer: data?.isPulseCustomer ? data?.isPulseCustomer : '',
      currentTier: data?.currentTier ? data?.currentTier : '',
      customerType: data?.customerType ? data?.customerType : '',
      instiTaxNo: data?.instiTaxNo ? data?.instiTaxNo : '',
      custTaxNo: data?.custTaxNo ? data?.custTaxNo : '',
      pointBalance: data?.pointBalance ? data?.pointBalance : '',
      enrollmentDate: data?.enrollmentDate
        ? moment(data?.enrollmentDate)
        : null,
      isMemberBlocked: data?.isMemberBlocked ? data?.isMemberBlocked : '',
      emailId: data?.emailId ? data?.emailId : '',
      passportId: data?.passportId ? data?.passportId : '',
      isActive: data?.isActive ? data?.isActive : '',
      isCalledFromCustomer: isCalledFromCustomer,
      isForm60Matched: data.isForm60Matched ? data.isForm60Matched : false,
      isCustTaxMatched: data.isCustTaxMatched ? data.isCustTaxMatched : false,
      isInstiTaxNoVerified: data?.isInstiTaxNoVerified
        ? data?.isInstiTaxNoVerified
        : false,
      iscustTaxNoVerified: data?.iscustTaxNoVerified
        ? data?.iscustTaxNoVerified
        : false,
      isEmailIdValidated: data?.isEmailIdValidated
        ? data?.isEmailIdValidated
        : false,
      isEmailIdValidationInitiated: data?.isEmailIdValidationInitiated
        ? data?.isEmailIdValidationInitiated
        : false,
      panHolderName: data?.panHolderName
        ? data?.panHolderName
        : null,
      customerDetails: data?.customerDetails
        ? {
            type: data?.customerDetails?.type
              ? data?.customerDetails?.type
              : '',
            data: data?.customerDetails?.data
              ? {
                  catchmentName: data?.customerDetails?.data?.catchmentName
                    ? data?.customerDetails?.data?.catchmentName
                    : '',
                  isHardCopySubmitted: data?.customerDetails?.data
                    ?.isHardCopySubmitted
                    ? data?.customerDetails?.data?.isHardCopySubmitted
                    : '',
                  isNRI: data?.customerDetails?.data?.isNRI
                    ? data?.customerDetails?.data?.isNRI
                    : '',
                  birthday: data?.customerDetails?.data?.birthday
                    ? moment(data?.customerDetails?.data?.birthday)
                    : null,
                  spouseBirthday: data?.customerDetails?.data?.spouseBirthday
                    ? moment(data?.customerDetails?.data?.spouseBirthday)
                    : null,
                  anniversary: data?.customerDetails?.data?.anniversary
                    ? moment(data?.customerDetails?.data?.anniversary)
                    : null,
                  idProof: data?.customerDetails?.data?.idProof
                    ? data?.customerDetails?.data?.idProof
                    : null,
                  form60Number: data?.customerDetails?.data?.form60Number
                    ? data?.customerDetails?.data?.form60Number
                    : null,
                  form60IdType: data?.customerDetails?.data?.form60IdType
                    ? data?.customerDetails?.data?.form60IdType
                    : null,
                  idNumber: data.customerDetails?.data?.idNumber
                    ? data?.customerDetails?.data?.idNumber
                    : null,
                  form60AndIdProofSubmitted: data?.customerDetails?.data?.form60
                    ? data?.customerDetails?.data?.form60
                    : '',
                  canSendSMS: data?.customerDetails?.data?.canSendSMS
                    ? data?.customerDetails?.data?.canSendSMS
                    : null,
                  addressLines: data?.customerDetails?.data?.addressLines
                    ? data?.customerDetails?.data?.addressLines
                    : '',
                  city: data?.customerDetails?.data?.city
                    ? data?.customerDetails?.data?.city
                    : '',
                  state: data?.customerDetails?.data?.state
                    ? data?.customerDetails?.data?.state
                    : '',
                  pinCode: data?.customerDetails?.data?.pincode
                    ? data?.customerDetails?.data?.pincode
                    : '',
                  country: data?.customerDetails?.data?.country
                    ? data?.customerDetails?.data?.country
                    : '',
                  zone: data?.customerDetails?.data?.zone
                    ? data?.customerDetails?.data?.zone
                    : '',
                  landlineNumber: data?.customerDetails?.data?.landlineNumber
                    ? data?.customerDetails?.data?.landlineNumber
                    : '',
                  authorizedName: data?.customerDetails?.data?.authorizedName
                    ? data?.customerDetails?.data?.authorizedName
                    : '',
                  isIndividualCustomer: data?.customerDetails?.data
                    ?.isIndividualCustomer
                    ? data?.customerDetails?.data?.isIndividualCustomer
                    : '',
                  altContactNo: data?.customerDetails?.data?.altContactNo
                    ? data?.customerDetails?.data?.altContactNo
                    : '',
                  fullAddress: this.getAddress(
                    data?.customerDetails?.data?.addressLines
                      ? data?.customerDetails?.data?.addressLines
                      : '',
                    data?.customerDetails?.data?.city
                      ? data?.customerDetails?.data?.city
                      : '',
                    data?.customerDetails?.data?.state
                      ? data?.customerDetails?.data?.state
                      : '',
                    data?.customerDetails?.data?.country
                      ? data?.customerDetails?.data?.country
                      : ''
                  )
                }
              : {
                  catchmentName: null,
                  birthday: null,
                  spouseBirthday: null,
                  anniversary: null,
                  form60AndIdProofSubmitted: null,
                  addressLines: [],
                  city: null,
                  state: null,
                  pinCode: null,
                  country: null,
                  zone: null,
                  altContactNo: null,
                  fullAddress: null,
                  isHardCopySubmitted: null
                }
          }
        : {
            type: null,
            data: {
              catchmentName: null,
              birthday: null,
              spouseBirthday: null,
              anniversary: null,
              form60AndIdProofSubmitted: null,
              addressLines: [],
              city: null,
              state: null,
              pinCode: null,
              country: null,
              zone: null,
              altContactNo: null,
              fullAddress: null
            }
          },
      loyaltyDetails: data?.loyaltyDetails
        ? {
            type: data?.loyaltyDetails?.type ? data?.loyaltyDetails?.type : '',
            data: data?.loyaltyDetails?.data
              ? {
                  anniversary: data?.loyaltyDetails?.data?.anniversary
                    ? data?.loyaltyDetails?.data?.anniversary
                    : '',
                  anniversaryDiscount: data?.loyaltyDetails?.data
                    ?.anniversaryDiscount
                    ? data?.loyaltyDetails?.data?.anniversaryDiscount
                    : '',
                  anniversaryValidityPeriod: data?.loyaltyDetails?.data
                    ?.anniversaryValidityPeriod
                    ? data?.loyaltyDetails?.data?.anniversaryValidityPeriod
                    : '',
                  birthday: data?.loyaltyDetails?.data?.birthday
                    ? data?.loyaltyDetails?.data?.birthday
                    : '',
                  birthdayDiscount: data?.loyaltyDetails?.data?.birthdayDiscount
                    ? data?.loyaltyDetails?.data?.birthdayDiscount
                    : '',
                  birthdayValdityPeriod: data?.loyaltyDetails?.data
                    ?.birthdayValdityPeriod
                    ? data?.loyaltyDetails?.data?.birthdayValdityPeriod
                    : '',
                  child1BirthdayDiscount: data?.loyaltyDetails?.data
                    ?.child1BirthdayDiscount
                    ? data?.loyaltyDetails?.data?.child1BirthdayDiscount
                    : '',
                  child1BirthdayValidityPeriod: data?.loyaltyDetails?.data
                    ?.child1BirthdayValidityPeriod
                    ? data?.loyaltyDetails?.data?.child1BirthdayValidityPeriod
                    : '',
                  child2BirthdayDiscount: data?.loyaltyDetails?.data
                    ?.child2BirthdayDiscount
                    ? data?.loyaltyDetails?.data?.child2BirthdayDiscount
                    : '',
                  child2BirthdayValidityPeriod: data?.loyaltyDetails?.data
                    ?.child2BirthdayValidityPeriod
                    ? data?.loyaltyDetails?.data?.child2BirthdayValidityPeriod
                    : '',
                  spouseBirthday: data?.loyaltyDetails?.data?.spouseBirthday
                    ? data?.loyaltyDetails?.data?.spouseBirthday
                    : '',
                  spouseBirthdayDiscount: data?.loyaltyDetails?.data
                    ?.spouseBirthdayDiscount
                    ? data?.loyaltyDetails?.data?.spouseBirthdayDiscount
                    : '',
                  spouseBirthdayValidityPeriod: data?.loyaltyDetails?.data
                    ?.spouseBirthdayValidityPeriod
                    ? data?.loyaltyDetails?.data?.spouseBirthdayValidityPeriod
                    : ''
                }
              : {
                  anniversary: null,
                  anniversaryDiscount: null,
                  anniversaryValidityPeriod: null,
                  birthday: null,
                  birthdayDiscount: null,
                  birthdayValdityPeriod: null,
                  child1BirthdayDiscount: null,
                  child1BirthdayValidityPeriod: null,
                  child2BirthdayDiscount: null,
                  child2BirthdayValidityPeriod: null,
                  spouseBirthday: null,
                  spouseBirthdayDiscount: null,
                  spouseBirthdayValidityPeriod: null
                }
          }
        : {
            type: null,
            data: {
              anniversary: null,
              anniversaryDiscount: null,
              anniversaryValidityPeriod: null,
              birthday: null,
              birthdayDiscount: null,
              birthdayValdityPeriod: null,
              child1BirthdayDiscount: null,
              child1BirthdayValidityPeriod: null,
              child2BirthdayDiscount: null,
              child2BirthdayValidityPeriod: null,
              spouseBirthday: null,
              spouseBirthdayDiscount: null,
              spouseBirthdayValidityPeriod: null
            }
          }
    };
  }

  static getAddress(
    addressLines: string[],
    city: string,
    state: string,
    country: string
  ): string {
    let address = '';

    if (addressLines) {
      for (let i = 0; i < addressLines.length; i++) {
        if (i > 0) {
          address = address + ', ';
        }
        address = address + addressLines[i];
      }
    }

    if (city) {
      address = address + ' ,' + city;
    }

    if (state) {
      address = address + ' ,' + state;
    }
    if (country) {
      address = address + ' ,' + country;
    }

    return address;
  }

  static pincodeDataSummaryFromJson(data: Pincode[]): PincodeSummary {
    const pincodeSummary: PincodeSummary = {
      stateName: '',
      townName: '',
      cachementArea: []
    };
    if (data.length > 0) {
      pincodeSummary.stateName = data[0].stateName;
      pincodeSummary.townName = data[0].townName;
      for (const pincodeData of data) {
        pincodeSummary.cachementArea.push(pincodeData.cachementArea);
      }
    } else {
      pincodeSummary.stateName = '';
      pincodeSummary.townName = '';
      pincodeSummary.cachementArea = [];
    }

    return pincodeSummary;
  }

  static rivaahCouponDetailJson(data: any, couponSend): RivaahCouponDetail {
    let rivaahCouponDetail: RivaahCouponDetail = {
      attempts: 0,
      couponCode: '',
      couponType: '',
      customerMasterId: '',
      docDate: null,
      expiryDate: null,
      refId: '',
      status: '',
      couponSend: false
    };
    if (data) {
      rivaahCouponDetail.attempts = data.attempts;
      rivaahCouponDetail.couponCode = data.couponCode;
      rivaahCouponDetail.couponType = data.couponType;
      rivaahCouponDetail.customerMasterId = data.customerMasterId;
      rivaahCouponDetail.docDate = moment(data.docDate);
      rivaahCouponDetail.expiryDate = moment(data.expiryDate);
      rivaahCouponDetail.refId = data.refId;
      rivaahCouponDetail.status = data.status;
      rivaahCouponDetail.couponSend = couponSend === true ? true : false;
    } else {
      rivaahCouponDetail = null;
    }

    return rivaahCouponDetail;
  }

  static stateDataSummaryFromJson(data: any): CustomerStateSummary[] {
    const stateData: CustomerStateSummary[] = [];
    for (const state of data) {
      stateData.push({
        stateId: state.stateId,
        description: state.description,
        stateTaxCode: state.stateTaxCode
      });
    }
    return stateData;
  }

  static getCatchmentList(data: any): any {
    const catchmentList = [];
    for (const catchment of data.results) {
      catchmentList.push(catchment.description);
    }

    return catchmentList;
  }

  static panVerificationJson(data: any): ValidatePanResponse {
    const panVerificationResponse: ValidatePanResponse = {
      message: '',
      ownerName: null,
      verificationStatus: false
    };
    if (data) {
      panVerificationResponse.message = data.message;
      panVerificationResponse.ownerName = data.ownerName;
      panVerificationResponse.verificationStatus = data.verificationStatus;
    }

    return panVerificationResponse;
  }

  static gstVerificationJson(data: any): ValidateGstResponse {
    const gstVerificationResponse: ValidateGstResponse = {
      errorMessage: '',
      gstIn: null,
      status: false
    };
    if (data) {
      gstVerificationResponse.errorMessage = data.errorMessage;
      gstVerificationResponse.gstIn = data.gstIn;
      gstVerificationResponse.status = data.status;
    }

    return gstVerificationResponse;
  }

  static emailvalidationJson(data: any): ValidateEmailResponse {
    if (data) {
      return {
        emailId: data.emailId,
        invalidationreason: data.invalidationReason,
        validationstatus: data.validationStatus
      };
    } else {
      return null;
    }
  }

  static verifyPanDetailsJson(data: any): VerifyPanDetailsResponse {
    if (data) {
      return {
        name: data?.panHolderName,
        category: data?.panHolderCategory,
        verificationStatus: data?.panVerified
      };
    } else {
      return null;
    }
  }
}
