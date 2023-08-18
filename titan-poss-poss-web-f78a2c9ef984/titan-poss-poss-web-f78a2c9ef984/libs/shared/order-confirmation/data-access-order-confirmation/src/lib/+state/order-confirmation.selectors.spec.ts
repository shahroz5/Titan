import {
  CustomErrors,
  StatusTypesEnum,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  CashMemoDetailsResponse,
  UpdateOrderDetails
} from '@poss-web/shared/models';

import { OrderConfirmationState } from './order-confirmation.state';
import { initialState } from './order-confirmation.reducer';
import * as selectors from './order-confirmation.selectors';
import { Moment } from 'moment';
import * as moment from 'moment';

describe('order Confirmation Selector Testing Suite', () => {
  const updateOrderDetails: UpdateOrderDetails = {
    cashMemoId: '12',
    orderDetails: {
      customerId: 1,
      finalValue: 1,
      paidValue: 1,
      remarks: '1',
      metalRateList: 1,
      minValue: 1,
      occasion: 'test',
      hallmarkCharges: 0,
      hallmarkDiscount: 0,
      totalDiscount: 1,
      totalQuantity: 1,
      totalTax: 1,
      totalValue: 1,
      totalWeight: 1,
      weightAgreed: 1
    },
    status: StatusTypesEnum.APPROVAL_PENDING,
    subTransactionType: SubTransactionTypeEnum.CANCEL_GEP,
    transactionType: TransactionTypeEnum.AB,
    actionType: 'test'
  };
  const cashMemoDetailsResponse: CashMemoDetailsResponse = {
    customerId: 6,
    customerDocDetails: '',
    refSubTxnType: '',
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    occasion: 'Wedding/Marriage',
    totalQuantity: 1,
    totalWeight: 12.05,
    totalValue: 60002.3,
    totalTax: 1800.06,
    finalValue: 61802.0,
    totalDiscount: 0.0,
    paidValue: 61802.0,
    remarks: 'Remarks',
    // otherCharges: null,
    otherChargesList: null,
    metalRateList: {
      metalRates: {
        J: {
          metalTypeCode: 'J',
          purity: 91.62,
          ratePerUnit: 4762,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 22.0
        },
        L: {
          metalTypeCode: 'L',
          purity: 95.0,
          ratePerUnit: 3473,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 0.0
        }
      }
    },
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    status: StatusTypesEnum.CONFIRMED,
    refTxnId: null,
    refTxnType: null,
    docNo: 54,
    docDate: moment(1611081000000),
    fiscalYear: 2020,
    firstHoldTime: moment(1610012299519),
    lastHoldTime: moment(1610012299519),
    roundingVariance: -0.36,
    employeeCode: 'cashiercpd',
    txnType: 'CM',
    subTxnType: 'NEW_CM',
    // confirmedTime: moment(1611110936440),
    manualBillDetails: null,
    taxDetails: {
      // taxes: [
      //   {
      //     taxType: 'ITEMCHARGES',
      //     taxClass: 'TC75',
      //     data: [
      //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
      //     ],
      //     cess: []
      //   }
      // ]
      taxType: 'ITEMCHARGES',
      taxClass: 'TC75',
      data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },

      cess: { cessCode: '', cessOnTax: true, cessPercentage: 0, cessValue: 0 }
    },
    // currencyCode: 'INR',
    // weightUnit: 'gms',
    // manualBillId: null,
    discountDetails: null,
    itemIdList: ['741B3399-ED98-44D8-B25D-BBDADCA2F1D2'],
    focDetails: null,
    txnTime: null
  };

  describe('Testing Confirm Order Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: OrderConfirmationState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.orderConfirmationSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return isLoading selector', () => {
      const state: OrderConfirmationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.orderConfirmationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return updateCashMemoResponse selector', () => {
      const state: OrderConfirmationState = {
        ...initialState,
        updateCashMemoResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.orderConfirmationSelectors.updateCashMemoResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });
  });
});
