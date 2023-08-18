import { CustomerInfo } from '@poss-web/shared/models';
import * as moment from 'moment';

export class CustomerSearchAdaptor {
  static fromJson(data: any): CustomerInfo {
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
      enrollmentDate: data?.enrollmentDate ? moment(data?.enrollmentDate) : null,
      isMemberBlocked: data?.isMemberBlocked ? data?.isMemberBlocked : '',
      emailId: data?.emailId ? data?.emailId : '',
      isActive: data?.isActive ? data?.isActive : '',
      passportId: data?.passportId ? data?.passportId : '',
      panHolderName: data?.panHolderName ? data?.panHolderName : null,
      customerDetails: data?.customerDetails
        ? {
            type: 
              data?.customerDetails?.type
                ? data?.customerDetails?.type
                : '',
            data: 
              data?.customerDetails?.data
                ? {
                    catchmentName: 
                      data?.customerDetails?.data?.catchmentName
                        ? data?.customerDetails?.data?.catchmentName
                        : '',
                    birthday: 
                      data?.customerDetails?.data?.birthday
                        ? moment(data?.customerDetails?.data?.birthday)
                        : null,
                    spouseBirthday: 
                      data?.customerDetails?.data?.spouseBirthday
                        ? moment(data?.customerDetails?.data?.spouseBirthday)
                        : null,
                    anniversary: 
                      data?.customerDetails?.data?.anniversary
                        ? moment(data?.customerDetails?.data?.anniversary)
                        : null,
                    idProof: 
                      data?.customerDetails?.data?.idProof
                        ? data?.customerDetails?.data?.idProof
                        : null,
                    idNumber: 
                      data?.customerDetails?.data?.idNumber
                        ? data?.customerDetails?.data?.idNumber
                        : null,
                    isHardCopySubmitted: 
                      data?.customerDetails?.data?.isHardCopySubmitted
                        ? data?.customerDetails?.data?.isHardCopySubmitted
                        : false,
                    isNRI: 
                      data?.customerDetails?.data?.isNRI
                        ? data?.customerDetails?.data?.isNRI
                        : false,
                    landlineNumber: 
                      data?.customerDetails?.data?.landlineNumber
                        ? data?.customerDetails?.data?.landlineNumber
                        : '',
                    authorizedName: 
                      data?.customerDetails?.data?.authorizedName
                        ? data?.customerDetails?.data?.authorizedName
                        : '',
                    form60AndIdProofSubmitted: 
                      data?.customerDetails?.data?.form60
                        ? data?.customerDetails?.data?.form60
                        : '',
                    addressLines: 
                      data?.customerDetails?.data?.addressLines
                        ? data?.customerDetails?.data?.addressLines
                        : '',
                    city: 
                      data?.customerDetails?.data?.city
                        ? data?.customerDetails?.data?.city
                        : '',
                    state: 
                      data?.customerDetails?.data?.state
                        ? data?.customerDetails?.data?.state
                        : '',
                    pinCode: 
                      data?.customerDetails?.data?.pincode
                        ? data?.customerDetails?.data?.pincode
                        : '',
                    isIndividualCustomer: 
                      data?.customerDetails?.data?.isIndividualCustomer
                        ? data?.customerDetails?.data?.isIndividualCustomer
                        : '',
                    canSendSMS: 
                      data?.customerDetails?.data?.canSendSMS
                        ? data?.customerDetails?.data?.canSendSMS
                        : null,
                    country: 
                      data?.customerDetails?.data?.country
                        ? data?.customerDetails?.data?.country
                        : '',
                    zone: 
                      data?.customerDetails?.data?.zone
                        ? data?.customerDetails?.data?.zone
                        : '',
                    altContactNo: 
                      data?.customerDetails?.data?.altContactNo
                        ? data?.customerDetails?.data?.altContactNo
                        : '',
                    fullAddress: 
                      this.getAddress(
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
                    isHardCopySubmitted: null,
                    addressLines: [],
                    city: null,
                    state: null,
                    pinCode: null,
                    country: null,
                    zone: null,
                    altContactNo: null,
                    fullAddress: null
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
              isHardCopySubmitted: null,
              fullAddress: null
            }
          },
      loyaltyDetails: data?.loyaltyDetails
        ? {
            type: 
              data?.loyaltyDetails?.type
                ? data?.loyaltyDetails?.type
                : '',
            data: data?.loyaltyDetails?.data
              ? {
                  anniversary: 
                    data?.loyaltyDetails?.data?.anniversary
                      ? data?.loyaltyDetails?.data?.anniversary
                      : '',
                  anniversaryDiscount:
                    data?.loyaltyDetails?.data?.anniversaryDiscount
                      ? data?.loyaltyDetails?.data?.anniversaryDiscount
                      : '',
                  anniversaryValidityPeriod:
                    data?.loyaltyDetails?.data?.anniversaryValidityPeriod
                      ? data?.loyaltyDetails?.data?.anniversaryValidityPeriod
                      : '',
                  birthday: 
                    data?.loyaltyDetails?.data?.birthday
                      ? data?.loyaltyDetails?.data?.birthday
                      : '',
                  birthdayDiscount: 
                    data?.loyaltyDetails?.data?.birthdayDiscount
                      ? data?.loyaltyDetails?.data?.birthdayDiscount
                      : '',
                  birthdayValdityPeriod:
                    data?.loyaltyDetails?.data?.birthdayValdityPeriod
                      ? data?.loyaltyDetails?.data?.birthdayValdityPeriod
                      : '',
                  child1BirthdayDiscount:
                    data?.loyaltyDetails?.data?.child1BirthdayDiscount
                      ? data?.loyaltyDetails?.data?.child1BirthdayDiscount
                      : '',
                  child1BirthdayValidityPeriod:
                    data?.loyaltyDetails?.data?.child1BirthdayValidityPeriod
                      ? data?.loyaltyDetails?.data?.child1BirthdayValidityPeriod
                      : '',
                  child2BirthdayDiscount:
                    data?.loyaltyDetails?.data?.child2BirthdayDiscount
                      ? data?.loyaltyDetails?.data?.child2BirthdayDiscount
                      : '',
                  child2BirthdayValidityPeriod:
                    data?.loyaltyDetails?.data?.child2BirthdayValidityPeriod
                      ? data?.loyaltyDetails?.data?.child2BirthdayValidityPeriod
                      : '',
                  spouseBirthday: 
                    data?.loyaltyDetails?.data?.spouseBirthday
                      ? data?.loyaltyDetails?.data?.spouseBirthday
                      : '',
                  spouseBirthdayDiscount:
                    data?.loyaltyDetails?.data?.spouseBirthdayDiscount
                      ? data?.loyaltyDetails?.data?.spouseBirthdayDiscount
                      : '',
                  spouseBirthdayValidityPeriod:
                    data?.loyaltyDetails?.data?.spouseBirthdayValidityPeriod
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

  static getOneTimeCustomer(data: any): CustomerInfo[] {
    const customerInfo: CustomerInfo[] = [];
    console.log('customer', data);
    for (const customer of data) {
      customerInfo.push( this.fromJson(customer))
    }
    return customerInfo;
  }

  static getAddress(
    addressLines: string[],
    city: string,
    state: string,
    country: string
  ): string {
    let address = '';

    if (addressLines) {
      for (let i = 0; i < addressLines?.length; i++) {
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
}
