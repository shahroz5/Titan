import * as selectors from './gift-cards.selectors';
import { initialState } from './gift-cards.reducer';
import { GiftCardsState } from './gift-cards.state';
import {
  GetPartiallyUpdatedGcCmResponse,
  GetAddedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetDeletedGiftCardItemResponse,
  GiftCardItem,
  CustomErrors
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Gift Cards Selector Testing Suite', () => {
  it('Testing selectGcCashMemoDetails selector', () => {
    const gcCashMemoDetails = {
      id: '',
      status: '',
      docNo: ''
    };
    const state: GiftCardsState = {
      ...initialState,
      gcCashMemoDetails: {
        id: '',
        status: '',
        docNo: ''
      }
    };
    expect(
      selectors.giftCardsSelectors.selectGcCashMemoDetails.projector(state)
    ).toEqual(gcCashMemoDetails);
  });
  it('Testing selectError selector', () => {
    const payload: CustomErrors = CustomErrorAdaptor.fromJson(
      Error('Some Error')
    );
    const state: GiftCardsState = {
      ...initialState,
      errors: payload
    };
    expect(selectors.giftCardsSelectors.selectError.projector(state)).toEqual(
      payload
    );
  });
  it('Testing selectIsLoading selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.giftCardsSelectors.selectIsLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectGcCashMemoAvailableForCancellation selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      gcCashMemoBillsReadyForCancellation: [
        {
          customerName: 'Customer Name',
          refDocDate: 'DATESTRING',
          refDocNo: 123,
          refTxnId: 'dsad-2344-sfds-5466',
          refTxnTime: 'DOCTIME',
          subTxnType: 'GIFT_SALE'
        }
      ]
    };
    expect(
      selectors.giftCardsSelectors.selectGcCashMemoAvailableForCancellation.projector(
        state
      ).length
    ).toEqual(1);
  });
  it('Testing selectSelectedGcCashMemoData selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      selectedGcCashMemoData: {
        customerId: 123,
        itemIdList: ['1234-asfg'],
        id: 'sads-3133-wdsd-5455',
        docNo: 234,
        totalQuantity: 2,
        totalTax: 1000,
        confirmedTime: 12345643,
        totalValue: 13450,
        employeeCode: '456'
      }
    };
    expect(
      selectors.giftCardsSelectors.selectSelectedGcCashMemoData.projector(state)
        .customerId
    ).toEqual(123);
  });
  it('Testing selectGcCashMemoCancelResponse selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      cancelGcCashMemoResponse: {
        cndocNos: [],
        docNo: 123,
        id: 'abcd-1234'
      }
    };
    expect(
      selectors.giftCardsSelectors.selectGcCashMemoCancelResponse.projector(
        state
      ).docNo
    ).toEqual(123);
  });
  it('Testing selectUpdateGcCashMemoResponse selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      updateGcCashMemoResponse: {
        customerId: 234,
        docDate: 'DATE',
        docNo: 123,
        employeeCode: '456',
        finalValue: 34567,
        id: '3234-sdfc-4567-edfr',
        paidValue: 30000,
        remarks: 'sdsfs',
        status: 'sadsfs',
        subTxnType: 'sdsdfs',
        totalDiscount: 765,
        totalQuantity: 1,
        totalTax: 1000,
        totalValue: 33456,
        txnType: 'GIFT_SALE'
      }
    };
    expect(
      selectors.giftCardsSelectors.selectUpdateGcCashMemoResponse.projector(
        state
      ).docNo
    ).toEqual(123);
  });
  it('Testing selectprintDataResponse selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      printDataResponse: {
        printData: 'PRINT_DATA'
      }
    };
    expect(
      selectors.giftCardsSelectors.selectprintDataResponse.projector(state)
        .printData
    ).toEqual('PRINT_DATA');
  });
  it('Testing selectGcCancellationReasons selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      gcCancellationReasons: ['REASON1', 'REASON2']
    };
    expect(
      selectors.giftCardsSelectors.selectGcCancellationReasons.projector(state)
        .length
    ).toEqual(2);
  });
  it('Testing selectRemarks selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      remarks: 'Sample Remarks'
    };
    expect(selectors.giftCardsSelectors.selectRemarks.projector(state)).toEqual(
      'Sample Remarks'
    );
  });
  it('Testing selectOrderNumber selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      orderNumber: {
        order: 345,
        status: 'OPEN'
      }
    };
    expect(
      selectors.giftCardsSelectors.selectOrderNumber.projector(state).order
    ).toEqual(345);
  });
  it('Testing selectGcBalance selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      gcBalance: {
        amount: '2345',
        cardNumber: '32324324343535',
        cardType: 'QCGC',
        cardName: 'QCGC',
        cardExpiryDate: '12132124442',
        responseCode: 200,
        responseMessage: 'sdsafsfsf',
        transactionId: 234567,
        productGroup: [],
        paymentCategoryName: '',
        partialRedemption: false
      }
    };
    expect(
      selectors.giftCardsSelectors.selectGcBalance.projector(state).amount
    ).toEqual('2345');
  });
  it('Testing selectPartiallyUpdatedGcCmResponse selector', () => {
    const partiallyUpdatedCashMemoResponse: GetPartiallyUpdatedGcCmResponse = {
      customerId: 625,
      paidValue: 1000,
      id: '1232142',
      status: '',
      docNo: 233,
      docDate: 32423424,
      employeeCode: 'rso',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE'
    };
    const state: GiftCardsState = {
      ...initialState,
      partiallyUpdatedGcCmResponse: partiallyUpdatedCashMemoResponse
    };
    expect(
      selectors.giftCardsSelectors.selectPartiallyUpdatedGcCmResponse.projector(
        state
      )
    ).toEqual(partiallyUpdatedCashMemoResponse);
  });
  it('Testing selectAddGiftCardItemResponse selector', () => {
    const giftCardItemResponse: GetAddedGiftCardItemResponse = {
      customerId: 625,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 1000,
      totalTax: 0,
      finalValue: 1000,
      totalDiscount: 0,
      paidValue: 1000,
      id: 'sadssf',
      status: '',
      docNo: 233,
      docDate: 4243532,
      employeeCode: 'rso',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE',
      giftDetailsDto: {
        itemId: '434353535333535',
        instrumentNo: '224243253533535',
        vendorCode: 'QC',
        binCode: 'QCGC',
        giftType: 'CARD',
        rowId: 1,
        totalValue: 1000,
        finalValue: 1000,
        totalTax: 0
      }
    };
    const state: GiftCardsState = {
      ...initialState,
      addGiftCardItemResponse: giftCardItemResponse
    };
    expect(
      selectors.giftCardsSelectors.selectAddGiftCardItemResponse.projector(
        state
      )
    ).toEqual(giftCardItemResponse);
  });
  it('Testing selectGetAddedGiftCardItemResponse selector', () => {
    const getAddedGiftCardItemResponse: GetGiftCardItemResponse = {
      itemId: '434353535333535',
      instrumentNo: '224243253533535',
      vendorCode: 'QC',
      binCode: 'QCGC',
      giftType: 'CARD',
      rowId: 1,
      totalValue: 1000,
      finalValue: 1000,
      totalTax: 0
    };
    const state: GiftCardsState = {
      ...initialState,
      getAddedGiftCardItemResponse
    };
    expect(
      selectors.giftCardsSelectors.selectGetAddedGiftCardItemResponse.projector(
        state
      )
    ).toEqual(getAddedGiftCardItemResponse);
  });
  it('Testing selectDeleteAddedGiftCardItemResponse selector', () => {
    const deleteAddedGiftCardItemResponse: GetDeletedGiftCardItemResponse = {
      customerId: 625,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 1000,
      totalTax: 0,
      finalValue: 1000,
      totalDiscount: 0,
      paidValue: 1000,
      id: 'sadssf',
      status: '',
      docNo: 233,
      docDate: 4243532,
      employeeCode: 'rso',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE'
    };
    const state: GiftCardsState = {
      ...initialState,
      deleteAddedGiftCardItemResponse
    };
    expect(
      selectors.giftCardsSelectors.selectDeleteAddedGiftCardItemResponse.projector(
        state
      )
    ).toEqual(deleteAddedGiftCardItemResponse);
  });
  it('Testing selectPartiallyUpdateGiftCardItemResponse selector', () => {
    const partiallyUpdateGiftCardItemResponse: GetAddedGiftCardItemResponse = {
      customerId: 625,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 1000,
      totalTax: 0,
      finalValue: 1000,
      totalDiscount: 0,
      paidValue: 1000,
      id: 'sadssf',
      status: '',
      docNo: 233,
      docDate: 4243532,
      employeeCode: 'rso',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE',
      giftDetailsDto: {
        itemId: '434353535333535',
        instrumentNo: '224243253533535',
        vendorCode: 'QC',
        binCode: 'QCGC',
        giftType: 'CARD',
        rowId: 1,
        totalValue: 1000,
        finalValue: 1000,
        totalTax: 0
      }
    };
    const state: GiftCardsState = {
      ...initialState,
      partiallyUpdateGiftCardItemResponse
    };
    expect(
      selectors.giftCardsSelectors.selectPartiallyUpdateGiftCardItemResponse.projector(
        state
      )
    ).toEqual(partiallyUpdateGiftCardItemResponse);
  });
  it('Testing selectLoadRSODetails selector', () => {
    const rsoDetails = [
      {
        value: 'rso.urb.2',
        description: 'rso.urb.2'
      }
    ];
    const state: GiftCardsState = {
      ...initialState,
      rsoDetails
    };
    expect(
      selectors.giftCardsSelectors.selectLoadRSODetails.projector(state)
    ).toEqual(rsoDetails);
  });
  it('Testing Cards list selector', () => {
    const cardsList: GiftCardItem[] = [
      {
        cardNo: '3456789009876543',
        bin: 'QCGC',
        amount: 0,
        tax: 0,
        finalPrice: 0,
        itemId: 'adsafaf22-safsfsf'
      }
    ];
    const state: GiftCardsState = {
      ...initialState,
      cardsList
    };
    expect(
      selectors.giftCardsSelectors.selectCardsList.projector(state)
    ).toEqual(cardsList);
  });
  it('Testing selected RSO Name selector', () => {
    const selectedRSOName = { value: 'SO Name 1', description: 'SO Name 1' };
    const state: GiftCardsState = {
      ...initialState,
      selectedRSOName
    };
    expect(
      selectors.giftCardsSelectors.selectSelectedRSOName.projector(state)
    ).toEqual(selectedRSOName);
  });
  it('Testing CardsTotalAmount selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      cardsTotalAmount: 1000
    };
    expect(
      selectors.giftCardsSelectors.selectCardsTotalAmount.projector(state)
    ).toEqual(1000);
  });
  it('Testing CardsTotalQty selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      cardsTotalQty: 2
    };
    expect(
      selectors.giftCardsSelectors.selectCardsTotalQty.projector(state)
    ).toEqual(2);
  });
  it('Testing GcTotalPaidAmount selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      gcTotalAmountPaid: 1000
    };
    expect(
      selectors.giftCardsSelectors.selectGcTotalPaidAmount.projector(state)
    ).toEqual(1000);
  });
  it('Testing minAmount selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      minAmount: 2000
    };
    expect(
      selectors.giftCardsSelectors.selectMinAmount.projector(state)
    ).toEqual(2000);
  });
  it('Testing MaxAmount selector', () => {
    const state: GiftCardsState = {
      ...initialState,
      maxAmount: 10000
    };
    expect(
      selectors.giftCardsSelectors.selectMaxAmount.projector(state)
    ).toEqual(10000);
  });
});
