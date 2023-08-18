import { Injectable } from '@angular/core';
import {
  ConfirmTransactionLevelDiscountPayload,
  DiscountsResponse,
  DiscountTypeEnum,
  EditCashDetails,
  OrderServiceDetails,
  PaymentDetails,
  PaymentModeEnum,
  PaymentStatusEnum,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateOrderDetails
} from '@poss-web/shared/models';

import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { of, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { OrderConfirmationFacade } from './+state/order-confirmation.facade';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  paymentConfirmationOrder = [
    PaymentModeEnum.GIFT_VOUCHER,
    PaymentModeEnum.GHS_EVOUCHER,
    PaymentModeEnum.ENCIRCLE,
    PaymentModeEnum.QCGC,
    PaymentModeEnum.DIGI_GOLD_TANISHQ,
    PaymentModeEnum.DIGI_GOLD_NON_TANISHQ,
    PaymentModeEnum.LINKED_CN
  ];

  cmBillLevelDiscountTypes = [
    DiscountTypeEnum.SYSTEM_DISCOUNT_DV,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY,
    DiscountTypeEnum.DIGI_GOLD_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.RIVAAH_CARD_DISCOUNT,
    DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];
  abBillLevelDiscountTypes = [
    //Todo add other Coin offer

    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT
  ];

  paymentStack: PaymentDetails[] = [];

  discountStack: DiscountTypeEnum[] = [];
  //maxCashLimit = 200000;
  orderDetails: UpdateOrderDetails;
  dvDiscountDetails = [];
  private destroy$ = new Subject<void>();
  constructor(
    private paymentFacade: PaymentFacade,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private productFacade: ProductFacade,
    private discountFacade: DiscountFacade
  ) {}

  /*Order Discount confirmation process:
--------------------------------------------------

step1: Based on the transaction type select allowed discount type.
Step2: check if the discount is valid at both item level and transaction level
step3: if step2 has invalid discount. notify the user regarding the invalid discount
step4: if step2 has no invalid discount and discount stack is empty move to step 10
step5: if step2 has no invalid discount and discount stack is not empty move to step 6
step6: start confirming the discount sequentially using discount stack
step7: subscribe to discount store to check the status of current discount which was sent for confirmation
step8: step 7 returns discount and status is confirmed. and if discount stack has more than one discount. move to step 6
step9: step 7 returns discount and status is confirmed. and  if discount stack has only discount move to step 10
step10: emit discount confirmation completed.

*/

  /* This method will notify the user if any discounts provide at transactionLevel is not present at any item
     at item level and also if there is no invalid discount, It will prepare an discount stack with all valid
     Discounts which are in open state that need be confimed*/

  ConfirmAllBillLevelDiscounsts(
    id: string,
    transactionType: TransactionTypeEnum,
    SubTransactionType: SubTransactionTypeEnum,
    transactionLevelDiscounts: any
  ) {
    this.dvDiscountDetails =
      transactionLevelDiscounts?.ghsDiscountDetails?.voucherDetails;

    //Reset stacks
    this.discountStack = [];
    this.discountFacade.setDiscountState(null);

    const allowedBillLevelDiscount =
      transactionType === TransactionTypeEnum.CM
        ? this.cmBillLevelDiscountTypes
        : this.abBillLevelDiscountTypes;

    const invalidDiscount = allowedBillLevelDiscount.find(discount => {
      return this.toBeConfirmedDiscountStack(
        discount,
        transactionLevelDiscounts
      );
    });

    if (invalidDiscount) {
      this.discountFacade.setDiscountState(
        this.generateDiscountErrorMsg(invalidDiscount)
      );
    } else {
      if (this.discountStack.length > 0) {
        this.destorySubscription();

        this.discountConfirm(
          this.discountStack[0],
          id,
          transactionType,
          SubTransactionType
        );

        this.checkDiscountStore();
      } else {
        this.discountFacade.setDiscountState(PaymentStatusEnum.COMPLETED);
      }
    }
  }

  toBeConfirmedDiscountStack(type: any, transactionLevelDiscounts: any) {
    switch (type) {
      case DiscountTypeEnum.EMPLOYEE_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.employeeDetails?.couponDetails[0]
              ?.couponCode
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.EMPLOYEE_DISCOUNT);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.RIVAAH_CARD_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.rivaahCardDetails?.couponCode
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.rivaahGhsDiscountDetails?.rivaahGhs
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(
                DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
              );
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.TSSS_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.tsssDetails?.couponDetails[0]?.couponCode
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.TSSS_DISCOUNT);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.tataEmployeeDetails
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT);
            }
            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.SYSTEM_DISCOUNT_DV: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.ghsDiscountDetails?.voucherDetails
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.SYSTEM_DISCOUNT_DV);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            //statements;
            break;
          }
        }
        // }
        break;
      }
      case DiscountTypeEnum.EMPOWERMENT_DISCOUNT: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.empowermentDetails
              ?.applyEmpowermentDiscount
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(DiscountTypeEnum.EMPOWERMENT_DISCOUNT);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            break;
          }
        }
        break;
      }
      case DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT:
      case DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY:
      case DiscountTypeEnum.COIN_OFFER_DISCOUNT:
      case DiscountTypeEnum.DIGI_GOLD_DISCOUNT:
      case DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT: {
        switch (this.getItemlevelDiscountDetails(type, null)) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(type);
            }

            break;
          }

          default: {
            //statements;
            break;
          }
        }

        break;
      }

      case DiscountTypeEnum.ULP_ANNIVERSARY:
      case DiscountTypeEnum.ULP_BIRTHDAY:
      case DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY: {
        switch (
          this.getItemlevelDiscountDetails(
            type,
            transactionLevelDiscounts?.encircleDetails?.discountType === type
          )
        ) {
          case true: {
            if (this.getDiscountConfirmationStatus(type)) {
              this.discountStack.push(type);
            }

            break;
          }
          case false: {
            return type;
          }
          default: {
            break;
          }
        }

        break;
      }

      default:
    }
  }

  generateDiscountErrorMsg(type: DiscountTypeEnum): string {
    switch (type) {
      case DiscountTypeEnum.EMPLOYEE_DISCOUNT:
        return 'Employee';
      case DiscountTypeEnum.TSSS_DISCOUNT:
        return 'TSSS';
      case DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT:
        return 'Tata Employee';
      case DiscountTypeEnum.SYSTEM_DISCOUNT_DV:
        return 'GHS Discount Voucher';
      case DiscountTypeEnum.EMPOWERMENT_DISCOUNT:
        return 'Empowerment';

      case DiscountTypeEnum.ULP_ANNIVERSARY:
      case DiscountTypeEnum.ULP_BIRTHDAY:
      case DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY:
        return 'Encircle';
      default:
        return type;
    }
  }

  getItemlevelDiscountDetails(type: string, discounttDetails: any) {
    let discountValue;
    this.productFacade
      .getItemlevelDiscountbyKey(type)
      .pipe(withLatestFrom(of(discounttDetails)), take(1))
      .subscribe(([val1, val2]) => {
        // val2 should not be equal to null
        if (
          type === DiscountTypeEnum.DIGI_GOLD_DISCOUNT ||
          type === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT ||
          type === DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY ||
          type === DiscountTypeEnum.COIN_OFFER_DISCOUNT ||
          type === DiscountTypeEnum.GRN_MULTIPLE_DISCOUNT
        ) {
          return val1 && val1.filter(value => !!value).length > 0
            ? (discountValue = true)
            : (discountValue = false);
        } else {
          if (val1 && val1.filter(value => !!value).length > 0 && val2) {
            //discount present at item level and get CM details
            discountValue = true;
          } else if (
            val1 &&
            val1.filter(value => !!value).length === 0 &&
            val2
          ) {
            //discount is not present at any item level and but get CM details its present. now user needs to be
            //notified to remove tht discount
            discountValue = false;
          }
        }
      });

    return discountValue;
  }

  getDiscountConfirmationStatus(type: DiscountTypeEnum) {
    //To check tranaction level api if discount is confirmed
    let value;
    this.discountFacade
      .getTransactionLevelDiscountByKey(type)
      .pipe(take(1))
      .subscribe((val: DiscountsResponse[]) => {
        if (val.length > 0) {
          value = true;
        } else {
          value = false;
        }
      });
    return value;
  }

  discountConfirm(
    type: DiscountTypeEnum,
    id: string,
    transactionType: string,
    SubTransactionType: string
  ) {
    // if (type === DiscountTypeEnum.SYSTEM_DISCOUNT_DV) {
    //   let dvDiscountTxnId = [];

    //   this.dvDiscountDetails.forEach(element => {
    //     dvDiscountTxnId.push(element.discountTxnId);
    //   });

    //   this.discountFacade.confirmTransactionLevelDiscount({
    //     discountTxnId: dvDiscountTxnId,
    //     discountType: type,
    //     subTxnType: SubTransactionTypeEnum.NEW_CM,
    //     transactionId: id,
    //     txnType: TransactionTypeEnum.CM
    //   });
    // } else {
    this.discountFacade.confirmTransactionLevelDiscount({
      discountType: type,
      subTxnType: SubTransactionType,
      transactionId: id,
      txnType: transactionType
    });
    //}
  }

  checkDiscountStore(): any {
    this.discountFacade
      .getConfirmedDiscount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (confirmedDiscount: ConfirmTransactionLevelDiscountPayload) => {
          if (confirmedDiscount) {
            if (confirmedDiscount.discountType === this.discountStack[0]) {
              this.discountStack.shift();

              if (this.discountStack.length > 0) {
                this.discountConfirm(
                  this.discountStack[0],
                  confirmedDiscount.transactionId,
                  confirmedDiscount.txnType,
                  confirmedDiscount.subTxnType
                );
              } else {
                this.discountFacade.setDiscountState(
                  PaymentStatusEnum.COMPLETED
                );
              }
            }
          }
        }
      );
  }
  /*Discount confirmation logic Ends here*/

  /*Order confirmation logic starts here*/
  confirmOrder(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[],
    type: string
  ): string {
    switch (type) {
      case TransactionTypeEnum.CM:
        const cmErrorMessage = this.validateCashmemo(
          orderDetails,
          paymentDetails
        );
        if (cmErrorMessage) {
          return cmErrorMessage;
        }
        break;

      case TransactionTypeEnum.ADV:
        const advErrorMessage = this.validateAcceptAdavance(
          orderDetails,
          paymentDetails
        );
        if (advErrorMessage) {
          return advErrorMessage;
        }
        break;
      case TransactionTypeEnum.AB:
        const abErrorMessage = this.validateAdvanceBooking(
          orderDetails,
          paymentDetails
        );
        if (abErrorMessage) {
          return abErrorMessage;
        }
        break;

      case TransactionTypeEnum.CO:
        const coErrorMessage = this.validateCustomerOrder(
          orderDetails,
          paymentDetails
        );
        if (coErrorMessage) {
          return coErrorMessage;
        }
        break;

      default:
      // code block
    }
  }

  removeComfirmedPayemt(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[]
  ) {
    let notConfimedPayment = paymentDetails.filter(
      payment => payment.status !== PaymentStatusEnum.COMPLETED
    );

    if (
      notConfimedPayment.filter(
        payment =>
          payment.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
          payment.otherDetails.data.isLinkedCn
      ).length > 0
    ) {
      notConfimedPayment = notConfimedPayment.filter(
        payment =>
          !(
            payment.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
            payment.otherDetails.data.isLinkedCn
          )
      );

      const isLinkedCnPayment: PaymentDetails = {
        paymentCode: PaymentModeEnum.LINKED_CN,
        status: PaymentStatusEnum.INPROGRESS,
        id: orderDetails.cashMemoId.toLocaleLowerCase()
      };

      notConfimedPayment.push(isLinkedCnPayment);
    }

    if (notConfimedPayment.length > 0) {
      this.setConfirmPaymentsOrder({
        cashMemoPayload: orderDetails,
        paymentDetails: notConfimedPayment
      });
    } else {
      this.orderConfirm(orderDetails);
    }
  }

  //will sort the payments according to order provided

  setConfirmPaymentsOrder(orderServiceDetails: OrderServiceDetails) {
    this.destorySubscription();
    this.orderDetails = orderServiceDetails.cashMemoPayload;

    this.paymentStack = orderServiceDetails.paymentDetails
      .slice()
      .sort((firstPayment, Secondpayment) => {
        return (
          this.paymentConfirmationOrder.indexOf(firstPayment.paymentCode) -
          this.paymentConfirmationOrder.indexOf(Secondpayment.paymentCode)
        );
      });

    if (this.paymentStack.length !== 0) {
      this.paymentConfirm(this.paymentStack[0]);
    }

    this.checkPaymentStore();
  }

  //this validates the payment and if it's completed it will be removed from the list and next payment in list proceeds.
  //if the list is empty cash memo will be confirmed
  checkPaymentStore() {
    this.paymentFacade
      .getCurrentConfirmedPayment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmedPayment: PaymentDetails) => {
        if (confirmedPayment) {
          if (
            confirmedPayment.id === this.paymentStack[0].id &&
            confirmedPayment.status === PaymentStatusEnum.COMPLETED
          ) {
            this.paymentStack.shift();

            if (this.paymentStack.length > 0) {
              this.paymentConfirm(this.paymentStack[0]);
            } else {
              this.orderConfirm(this.orderDetails);
            }
          }
        }
      });
  }

  //The first parameter will be the payment thats going to get confirmed
  paymentConfirm(payment: PaymentDetails) {
    const details: EditCashDetails = {
      paymentId: payment.id,
      paymentGroup: payment.paymentGroup,
      details: {
        amount: payment.amount
      }
    };

    this.paymentFacade.confirmPayment({
      transactionType: this.orderDetails.transactionType,
      subTransactionType: this.orderDetails.subTransactionType,
      paymentDetails: details,
      paymentMode: payment.paymentCode
    });
  }

  orderConfirm(orderDetails: UpdateOrderDetails) {
    this.orderConfirmationFacade.confirmCashMemo(orderDetails);
  }

  destorySubscription(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //checks if there are cash payment . if exist it will take sum of all cash payments and checks
  // checkMaxLimit(paymentDetails): number {
  //   if (
  //     paymentDetails.filter(
  //       payment => payment.paymentCode === PaymentModeEnum.CASH
  //     ).length > 0
  //   ) {
  //     //this.paymentFacade.getMaxCashLimit().subscribe(maxAmount => {
  //     if (
  //       this.maxCashLimit >
  //       paymentDetails
  //         .filter(payment => payment.paymentCode === PaymentModeEnum.CASH)
  //         .map(payment => payment.amount)
  //         .reduce((amount1, amount2) => amount1 + amount2, 0)
  //     ) {
  //       return 0;
  //     } else {
  //       return 1;
  //     }
  //     // });
  //   } else {
  //     return 0;
  //   }
  // }

  validateAcceptAdavance(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[]
  ) {
    if (orderDetails.orderDetails.customerId === null) {
      return 'pw.regularCashMemo.selectCustomerMsg';
    }
    // else if (
    //   !orderDetails.orderDetails.remarks &&
    //   orderDetails.transactionType !== TransactionTypeEnum.ADV
    // ) {
    //   return 'pw.regularCashMemo.remarksMsg';

    // } else if (this.checkMaxLimit(paymentDetails)) {
    //   {
    //     return 'pw.regularCashMemo.maxCashMsg';
    //   }
    //}
    else if (
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.DD
      ).length > 1
    ) {
      return 'pw.regularCashMemo.multipleDD';
    } else if (
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.CHEQUE
      ).length > 1
    ) {
      return 'pw.regularCashMemo.multipleCheque';
    } else if (
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.CHEQUE
      ).length > 1 &&
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.CHEQUE
      ).length !== paymentDetails.length
    ) {
      return 'pw.regularCashMemo.chequeOption';
    } else if (
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.DD
      ).length > 1 &&
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.DD
      ).length !== paymentDetails.length
    ) {
      return 'pw.regularCashMemo.ddOption';
    } else if (
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.CREDIT_NOTE
      ).length > 1 &&
      paymentDetails.filter(
        payment => payment.paymentCode === PaymentModeEnum.CREDIT_NOTE
      ).length !== paymentDetails.length
    ) {
      return 'pw.regularCashMemo.cnOption';
    } else if (
      orderDetails.status !== StatusTypesEnum.APPROVAL_PENDING &&
      orderDetails.orderDetails.paidValue > orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.ExcessAmountPaid';
    } else if (
      orderDetails.orderDetails.paidValue !==
      orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.dueAmountMsg';
    } else {
      this.removeComfirmedPayemt(orderDetails, paymentDetails);
    }
  }

  validateCashmemo(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[]
  ) {
    if (orderDetails.orderDetails.customerId === null) {
      return 'pw.regularCashMemo.selectCustomerMsg';
    } else if (orderDetails.orderDetails.occasion === null) {
      return 'pw.regularCashMemo.selectOccasionDetailsMessage';
    } else if (
      orderDetails.orderDetails.totalQuantity === 0 &&
      orderDetails.orderDetails.manualFoc === false
    ) {
      return 'pw.regularCashMemo.addItemToGridMessage';
    } else if (
      !this.checkGRFCNAdded(paymentDetails) &&
      this.checkIfNoLinkedPayment(paymentDetails, orderDetails.isABinvoked) &&
      // !orderDetails.isABinvoked &&
      // orderDetails.status !== StatusTypesEnum.APPROVAL_PENDING &&
      orderDetails.originalPaidValue > orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.ExcessAmountPaid';
    } else if (
      orderDetails.isABinvoked &&
      orderDetails.status !== StatusTypesEnum.APPROVAL_PENDING &&
      orderDetails.orderDetails.paidValue < orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.dueAmountMsg';
    } else if (
      !orderDetails.isABinvoked &&
      orderDetails.status !== StatusTypesEnum.APPROVAL_PENDING &&
      ((orderDetails.orderDetails.paidValue !==
        orderDetails.orderDetails.finalValue &&
        !this.checkGRFCNAdded) ||
        (orderDetails.orderDetails.paidValue <
          orderDetails.orderDetails.finalValue &&
          this.checkGRFCNAdded))
    ) {
      return 'pw.regularCashMemo.dueAmountMsg';
    } else if (
      orderDetails.isNarrationMandatory &&
      !orderDetails.orderDetails.remarks
    ) {
      return 'pw.regularCashMemo.isNarrationMandatory';
    }
    // } else if (this.checkMaxLimit(paymentDetails)) {
    //   {
    //     return 'pw.regularCashMemo.maxCashMsg';
    //   }
    // else if (orderDetails.orderDetails.remarks === 'invalid') {
    //   return 'pw.giftCards.invalidRemarksAlertMessage';
    // }
    else {
      this.removeComfirmedPayemt(orderDetails, paymentDetails);
    }
  }

  validateAdvanceBooking(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[]
  ) {
    if (orderDetails.orderDetails.customerId === null) {
      return 'pw.regularCashMemo.selectCustomerMsg';
    } else if (orderDetails.orderDetails.totalQuantity === 0) {
      return 'pw.advanceBooking.addItemToGridMessage';
    } else if (
      !this.checkGRFCNAdded(paymentDetails) &&
      orderDetails.orderDetails.paidValue > orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.ExcessAmountPaid';
    } else if (
      !(
        orderDetails.subTransactionType == SubTransactionTypeEnum.MANUAL_AB &&
        orderDetails?.status == StatusTypesEnum.APPROVAL_PENDING
      ) &&
      orderDetails.orderDetails.paidValue < orderDetails.orderDetails.minValue
    ) {
      return 'pw.advanceBooking.minDueAmountMsg';
    }
    //  else if (!orderDetails.orderDetails.remarks) {
    //   return 'pw.regularCashMemo.remarksMsg';
    // }
    // } else if (this.checkMaxLimit(paymentDetails)) {
    //   return 'pw.regularCashMemo.maxCashMsg';
    else {
      this.removeComfirmedPayemt(orderDetails, paymentDetails);
    }
  }

  validateCustomerOrder(
    orderDetails: UpdateOrderDetails,
    paymentDetails: PaymentDetails[]
  ) {
    if (orderDetails.orderDetails.customerId === null) {
      return 'pw.regularCashMemo.selectCustomerMsg';
    } else if (orderDetails.orderDetails.totalQuantity === 0) {
      return 'pw.newCustomerOrder.addItemToGridMessage';
    } else if (
      !this.checkGRFCNAdded(paymentDetails) &&
      orderDetails.orderDetails.paidValue > orderDetails.orderDetails.finalValue
    ) {
      return 'pw.regularCashMemo.ExcessAmountPaid';
    } else if (
      !(
        orderDetails.subTransactionType === SubTransactionTypeEnum.MANUAL_CO &&
        orderDetails?.status === StatusTypesEnum.APPROVAL_PENDING
      ) &&
      orderDetails.orderDetails.paidValue < orderDetails.orderDetails.minValue
    ) {
      return 'pw.newCustomerOrder.minDueAmountMsg';
    }
    //  else if (!orderDetails.orderDetails.remarks) {
    //   return 'pw.regularCashMemo.remarksMsg';
    // }
    // } else if (this.checkMaxLimit(paymentDetails)) {
    //   return 'pw.regularCashMemo.maxCashMsg';
    else {
      this.removeComfirmedPayemt(orderDetails, paymentDetails);
    }
  }

  checkGRFCNAdded(paymentDetails: PaymentDetails[]) {
    return paymentDetails.some(
      x =>
        x.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
        x.otherDetails?.data?.isRateProtectedCN
    );
  }

  checkIfNoLinkedPayment(
    paymentDetails: PaymentDetails[],
    isABinvoked: boolean
  ) {
    if (!isABinvoked) {
      return true;
    }
    let paymentCount = paymentDetails.length;
    let linkedPaymentCount = paymentDetails.filter(
      x => x.otherDetails?.data?.isLinkedCn
    ).length;

    return paymentCount !== linkedPaymentCount;
  }
}
