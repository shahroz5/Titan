import {
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  PayeeBankGLCodeDetails,
  PayeeLocations,
  PayeeGLCodeDetailsSuccessList,
  GlSelectMappedLocations
} from '@poss-web/shared/models';

export class PayeeBankAdaptor {
  static payeeBankDetailsListing: LoadPayeeBankListingSuccessPayload;

  static getPayeeBankDetailsListing(
    data: any
  ): LoadPayeeBankListingSuccessPayload {
    const payeeBankDetailsListing: PayeeBankDetails[] = [];

    for (const listItem of data.results) {
      payeeBankDetailsListing.push({
        bankName: listItem.bankName ? listItem.bankName : '',
        bankCode: listItem.bankCode ? listItem.bankCode : '',
        addressOne: listItem.address.includes(' addr2 ')
          ? listItem.address.split(' addr2 ')[0]
          : listItem.address.slice(0, 39),
        addressTwo: listItem.address.includes(' addr2 ')
          ? listItem.address.split(' addr2 ')[1]
          : listItem.address.slice(39, 79),
        townName: listItem.townName ? listItem.townName : '',
        stateName: listItem.stateName ? listItem.stateName : '',
        contactPerson: listItem.contactPerson ? listItem.contactPerson : '',
        mailId: listItem.mailId ? listItem.mailId : '',
        ownerType: listItem.ownerType ? listItem.ownerType : '',
        isActive: listItem.isActive
      });
    }

    this.payeeBankDetailsListing = {
      payeeBankListing: payeeBankDetailsListing,
      totalElements: data.totalElements
    };
    return this.payeeBankDetailsListing;
  }
  static getPayeeBankDetailsSearch(data: any): PayeeBankDetails[] {
    const countryDetails: PayeeBankDetails[] = [];
    countryDetails.push({
      bankName: data.bankName ? data.bankName : '',
      bankCode: data.bankCode ? data.bankCode : '',
      addressOne: data.address.includes(' addr2 ')
        ? data.address.split(' addr2 ')[0]
        : data.address.slice(0, 39),
      addressTwo: data.address.includes(' addr2 ')
        ? data.address.split(' addr2 ')[1]
        : data.address.slice(39, 79),
      townName: data.townName ? data.townName : '',
      stateName: data.stateName ? data.stateName : '',
      mailId: data.mailId ? data.mailId : '',
      contactPerson: data.contactPerson ? data.contactPerson : '',
      ownerType: data.ownerType ? data.ownerType : '',
      isActive: data.isActive
    });
    return countryDetails;
  }
  static geNewtPayeeBankDetails(): PayeeBankDetails {
    const newPayeeBank: PayeeBankDetails = {
      bankName: '',
      bankCode: '',
      addressOne: '',
      addressTwo: '',
      townName: '',
      stateName: '',
      mailId: '',
      contactPerson: '',
      ownerType: '',
      isActive: true
    };
    return newPayeeBank;
  }
  static getPayeeBankDetailsBasedOnBankName(data: any): PayeeBankDetails {
    const payeeBankDetailsListing: PayeeBankDetails = {
      bankName: data.bankName,
      bankCode: data.bankCode,
      addressOne: data.address.includes(' addr2 ')
        ? data.address.split(' addr2 ')[0]
        : data.address.slice(0, 39),
      addressTwo: data.address.includes(' addr2 ')
        ? data.address.split(' addr2 ')[1]
        : data.address.slice(39, 79),
      townName: data.townName,
      stateName: data.stateName,
      mailId: data.mailId,
      contactPerson: data.contactPerson,
      ownerType: data.ownerType,
      isActive: data.isActive
    };

    return payeeBankDetailsListing;
  }
  static getGLCodeDetailList(data: any): PayeeGLCodeDetailsSuccessList {
    const glCodeDetail: PayeeBankGLCodeDetails[] = [];
    for (const detail of data.results) {
      glCodeDetail.push({
        id: detail.id,
        bankName: detail.bankName,
        locationCode: detail.locationCode,
        paymentCode: detail.paymentCode,
        glCode: detail.glCode,
        isDefault: detail.isDefault
      });
    }
    return { locationList: glCodeDetail, count: data.totalElements };
  }
  static getGLCodeDefaultsList(data: any): PayeeBankGLCodeDetails[] {
    const glCodeDetail: PayeeBankGLCodeDetails[] = [];
    for (const detail of data.results) {
      glCodeDetail.push({
        id: detail.id,
        bankName: detail.bankName,
        locationCode: detail.locationCode,
        paymentCode: detail.paymentCode,
        glCode: detail.glCode,
        isDefault: detail.isDefault
      });
    }
    return glCodeDetail;
  }
  static getLocationCodes(data: any): PayeeLocations[] {
    const locationCodes: PayeeLocations[] = [];
    for (const detail of data.results) {
      locationCodes.push({
        locationCode: detail.locationCode
        // cashIsDefault: false,
        // cashGlCode: '',
        // cardIsDefault: false,
        // cardGlCode: '',
        // chequeIsDefault: false,
        // chequeGlCode: '',
        // chequeReturnIsDefault: false,
        // chequeReturnGlCode: '',
        // ddIsDefault: false,
        // ddGlCode: ''
      });
    }
    return locationCodes;
  }

  static getMappedLocationList(data: any): GlSelectMappedLocations[] {
    const glCodeDetail: GlSelectMappedLocations[] = [];
    for (const detail of data.results) {
      glCodeDetail.push({
        id: detail.locationCode,
        description: detail.locationCode
      });
    }
    console.log(glCodeDetail, 'glCodeDetail');

    return glCodeDetail;
  }
  // static getGLCodeDetailList(data: any): PayeeBankGLCodeDetailsRow[] {
  //   const glCodeDetail: PayeeBankGLCodeDetailsRow[] = [];
  //   for (const detail of data.results) {
  //     glCodeDetail.push({
  //       locationCode: detail.locationCode,
  //       cashIsDefault: detail.paymentMode === 'CASH' ? detail.isDefault : false,
  //       cashGlCode: detail.paymentMode === 'CASH' ? detail.glCode : '',
  //       cardIsDefault: detail.paymentMode === 'CARD' ? detail.isDefault : false,
  //       cardGlCode: detail.paymentMode === 'CARD' ? detail.glCode : '',
  //       chequeIsDefault:
  //         detail.paymentMode === 'CHEQUE' ? detail.isDefault : false,
  //       chequeGlCode: detail.paymentMode === 'CHEQUE' ? detail.glCode : '',
  //       chequeReturnIsDefault:
  //         detail.paymentMode === 'CHEQUERETURN' ? detail.isDefault : false,
  //       chequeReturnGlCode:
  //         detail.paymentModee === 'CHEQUERETURN' ? detail.glCode : '',
  //       ddIsDefault: detail.paymentMode === 'DD' ? detail.isDefault : false,
  //       ddGlCode: detail.paymentMode === 'DD' ? detail.glCode : ''
  //     });
  //   }

  //   return glCodeDetail;
  // }

  // static getStateList(Data: any): StateList[] {
  //   const stateList: StateList[] = [];
  //   for (const state of Data.results) {
  //     stateList.push({
  //       id: state.state,

  //       name: state.state
  //     });
  //   }
  //   return stateList;
  // }
}
