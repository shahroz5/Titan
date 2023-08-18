import * as PaymentAdaptors from '../payment/payment-type.adaptors';

import {
  PaymentModeEnum,
  PaymentDetails,
  PaymentGroupEnum,
  AllowedPaymentsResponse,
  PaymentConfig,
  PaymentRequest,
  CNListResponse,
  CNListResponsePayload,
  CnPriorityDetail
} from '@poss-web/shared/models';

import { PaymentAdaptorBuilder } from '../payment/payment-type-adaptor.builder';
import { PaymentAdaptor } from '../payment/payment.adaptor';
import { PaymentAdaptorBase } from '../payment/payment-type-adaptors.base';
import { PaymentAdaptorMap } from '../payment/payment-type.adaptors';

export class PaymentHelper {
  static getAllowedPayments(data: any): AllowedPaymentsResponse {
    const allowedPayments: Map<PaymentModeEnum, PaymentGroupEnum> = new Map<
      PaymentModeEnum,
      PaymentGroupEnum
    >();
    const wallets: string[] = [];
    const subBankLoans: string[] = [];
    const airpayFields: string[] = [];
    const razorpayFiled: string[] = [];
    // const paymentFieldNames: {
    //   paymentCode: [];
    //   fields: string[];
    // }[] = [];

    const paymentFieldNames = [];

    const customerSpecificPayments: PaymentModeEnum[] = [];
    const customerSpecificWalletPayments: string[] = [];
    const customerSpecificBankLoanPayments: string[] = [];
    const response = {
      allowedPayments,
      wallets,
      subBankLoans,
      customerSpecificPayments,
      customerSpecificWalletPayments,
      customerSpecificBankLoanPayments,
      paymentFieldNames
    };

    let walletCount = 0;
    let subBankLoanCount = 0;
    let customerSpecificWalletPaymentsCount = 0;
    let customerSpecificBankLoanPaymentsCount = 0;
    for (const payementMode of data.paymentCodeDetails) {
      const paymentGroup = payementMode.paymentGroup;
      if (
        paymentGroup === PaymentGroupEnum.REGULAR &&
        (payementMode.paymentCode === PaymentModeEnum.AIRPAY ||
          payementMode.paymentCode === PaymentModeEnum.RTGS ||
          payementMode.paymentCode === PaymentModeEnum.RAZOR_PAY)
      ) {
        const element = {};
        element['code'] = payementMode.paymentCode;
        element['fields'] = payementMode.fields;
        paymentFieldNames.push(element);
      }
      if (paymentGroup === PaymentGroupEnum.WALLET) {
        if (!allowedPayments.has(PaymentModeEnum.WALLET)) {
          allowedPayments.set(PaymentModeEnum.WALLET, PaymentGroupEnum.WALLET);
        }
        wallets.push(payementMode.paymentCode);
        const element = {};
        element['code'] = payementMode.paymentCode;
        element['fields'] = payementMode.fields;
        paymentFieldNames.push(element);
        if (payementMode.customerDependent) {
          customerSpecificWalletPayments.push(payementMode.paymentCode);
          customerSpecificWalletPaymentsCount =
            customerSpecificWalletPaymentsCount + 1;
        }
        walletCount = walletCount + 1;
      } else if (paymentGroup === PaymentGroupEnum.BANK_LOAN) {
        if (!allowedPayments.has(PaymentModeEnum.BANK_LOAN)) {
          allowedPayments.set(
            PaymentModeEnum.BANK_LOAN,
            PaymentGroupEnum.BANK_LOAN
          );
        }
        subBankLoans.push(payementMode.paymentCode);
        if (payementMode.customerDependent) {
          customerSpecificBankLoanPayments.push(payementMode.paymentCode);
          customerSpecificBankLoanPaymentsCount =
            customerSpecificBankLoanPaymentsCount + 1;
        }
        subBankLoanCount = subBankLoanCount + 1;
        const element = {};
        element['code'] = payementMode.paymentCode;
        element['fields'] = payementMode.fields;
        paymentFieldNames.push(element);
      } else {
        const paymentMode = payementMode.paymentCode;
        if (paymentMode && paymentGroup) {
          allowedPayments.set(paymentMode, paymentGroup);
        }
        if (payementMode.customerDependent) {
          customerSpecificPayments.push(paymentMode);
        }
      }
    }
    if (
      walletCount !== 0 &&
      walletCount === customerSpecificWalletPaymentsCount
    ) {
      customerSpecificPayments.push(PaymentModeEnum.WALLET);
    }
    if (
      subBankLoanCount !== 0 &&
      subBankLoanCount === customerSpecificBankLoanPaymentsCount
    ) {
      customerSpecificPayments.push(PaymentModeEnum.BANK_LOAN);
    }
    return response;
  }

  /**
   *
   *  getPaymentList is used in for preparing the Payment Details list for CM.
   * @param data  : Data obtained
   */
  static getPaymentList(data: any): PaymentDetails[] {
    const paymentDetails: PaymentDetails[] = [];
    if (!data) {
      return paymentDetails;
    }
    for (const payment of data.results) {
      paymentDetails.push(this.getPaymentDetails(payment));
    }
    return paymentDetails;
  }

  /**
   * getPaymentDetails function is used for preparing the payment details via Payment Adaptots based
   * on Payment Type.
   * @param data
   */
  static getPaymentDetails(data: any): PaymentDetails {
    const paymentDetail = PaymentAdaptor.getDefaultPaymentDetails(data);
    const paymentAdaptorBuilder: PaymentAdaptorBuilder = new PaymentAdaptorBuilder(
      PaymentAdaptors
    );
    const adaptor = PaymentAdaptorMap.get(paymentDetail.paymentCode);

    const paymentAdaptorBase: PaymentAdaptorBase = paymentAdaptorBuilder.construct(
      adaptor,
      paymentDetail
    );

    return paymentAdaptorBase.getPaymentDetails();
  }

  static createPayeeBankList(
    bankPriorities: string[],
    payeeBanks: string[]
  ): string[] {
    bankPriorities = bankPriorities.filter(bank => payeeBanks.includes(bank));
    payeeBanks.forEach(payeeBank => {
      if (!bankPriorities.includes(payeeBank)) {
        bankPriorities.push(payeeBank);
      }
    });
    return bankPriorities;
  }

  static getPayeeBanks(data: any): string[] {
    const payeeBanks: string[] = [];
    if (!data) {
      return payeeBanks;
    }
    for (const payeeBank of data) {
      payeeBanks.push(payeeBank.bankName);
    }
    return payeeBanks;
  }

  static getCnType(data: any): string[] {
    const cnType: any[] = [];
    if (!data) {
      return cnType;
    }
    for (const cn of data.priorityDetails) {
      cnType.push(cn.cnType);
    }
    return cnType;
  }

  static getROPaymentRequests(data: any): PaymentRequest[] {
    const requests: PaymentRequest[] = [];
    if (!data) {
      return requests;
    }
    for (const request of data.results) {
      requests.push(PaymentAdaptor.getROPaymentRequest(request));
    }
    return requests;
  }

  static getPayerBanks(data: any): PaymentConfig {
    const config: PaymentConfig = {
      payerBanks: [],
      cardType: [],
      isBankMandatory: null,
      isCardTypeMandatory: null
    };
    if (!data) {
      return config;
    }
    config.payerBanks = data.payerBank ? data.payerBank : [];
    config.cardType =
      data.paymentDetails && data.paymentDetails.cardType
        ? data.paymentDetails.cardType
        : [];
    config.isBankMandatory = data.paymentDetails
      ? data.paymentDetails.isBankMandatory
      : null;
    config.isCardTypeMandatory = data.paymentDetails
      ? data.paymentDetails.isCardMandatory
      : null;

    return config;
  }

  static getCNListResponse(
    cnPriority: CnPriorityDetail[],
    data: any
  ): CNListResponse {
    let requests: CNListResponse;
    const cnListResponse: CNListResponsePayload[] = [];
    if (!data) {
      return requests;
    }
    data.results = data.results.sort(function (x, y) {
      return x.amount - y.amount;
    });
    cnPriority.forEach(cnType => {
      for (const request of data.results) {
        if (cnType.cnType === request.creditNoteType) {
          cnListResponse.push(
            PaymentAdaptor.getCnListResponse(request, cnType.priority)
          );
        }
      }
    });
    // for (const cnPrioritys of cnPriority) {
    //   for (const request of data.results) {
    //     if (cnPrioritys === request) {
    //       cnListResponse.push(PaymentAdaptor.getCnListResponse(request));
    //     }
    //   }
    // }
    // for (const request of data.results) {
    //   cnListResponse.push(PaymentAdaptor.getCnListResponse(request));
    // }

    requests = {
      cnList: cnListResponse,
      totalElements: data.totalElements
    };
    return requests;
  }
}
