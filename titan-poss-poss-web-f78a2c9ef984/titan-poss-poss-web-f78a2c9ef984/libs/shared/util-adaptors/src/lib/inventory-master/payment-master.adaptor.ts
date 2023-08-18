import { PaymentMasterList, PaymentMaster } from '@poss-web/shared/models';

export class PaymentMasterAdaptor {
  static getPaymentMasterList(data: any): PaymentMasterList {
    let paymentMasterList: PaymentMasterList;
    let totalElements: number;
    const paymentMaster: PaymentMaster[] = [];
    if (data && data.results) {
      for (const paymentData of data.results) {
        paymentMaster.push({
          customerDependent: paymentData.customerDependent,
          paymentCode: paymentData.paymentCode,
          description: paymentData.description,
          isActive: paymentData.isActive,
          type: paymentData.paymentGroup,
          isEditable: paymentData.isEditable
        });
      }

      totalElements = data.totalElements;
    }
    paymentMasterList = {
      results: paymentMaster,
      totalElements: totalElements
    };
    return paymentMasterList;
  }
  static getSearchResult(data: any): PaymentMasterList {
    let paymentMasterList: PaymentMasterList = null;
    const paymentMaster: PaymentMaster[] = [];
    paymentMaster.push({
      customerDependent: data.customerDependent,
      paymentCode: data.paymentCode,
      description: data.description,
      referenceMandatory: true,
      referenceOne: data.fields
        ? data.fields[0]
          ? data.fields[0].fieldName
          : ''
        : '',
      referenceTwo: data.fields
        ? data.fields[1]
          ? data.fields[1].fieldName
          : ''
        : '',
      referenceThree: data.fields
        ? data.fields[2]
          ? data.fields[2].fieldName
          : ''
        : '',
      isActive: data.isActive,
      type: data.paymentGroup,
      isEditable: data.isEditable
    });

    paymentMasterList = {
      results: paymentMaster,
      totalElements: 1
    };
    return paymentMasterList;
  }
  static getPaymentMasterDataByPaymentCode(data: any): PaymentMaster {
    let paymentMaster: PaymentMaster;
    paymentMaster = {
      paymentCode: data.paymentCode,
      description: data.description,
      referenceMandatory: true,
      referenceOne: data.fields
        ? data.fields[0]
          ? data.fields[0].fieldName
          : ''
        : '',
      referenceTwo: data.fields
        ? data.fields[1]
          ? data.fields[1].fieldName
          : ''
        : '',
      referenceThree: data.fields
        ? data.fields[2]
          ? data.fields[2].fieldName
          : ''
        : '',
      isActive: data.isActive,
      customerDependent: data.customerDependent,
      type: data.paymentGroup,
      isEditable: data.paymentData
    };

    return paymentMaster;
  }
}
