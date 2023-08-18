import { GiftCardsState } from './gift-cards.state';
import { initialState, GiftCardsReducer } from './gift-cards.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './gift-cards.actions';
import {
  AddGiftCardItemPayload,
  PartiallyUpdateGiftDetailsPayload,
  GetPartiallyUpdatedGcCmResponse,
  GetAddedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetDeletedGiftCardItemResponse,
  GetUpdatedGcCashMemoResponse,
  PartiallyUpdateGcCmPayload,
  CancellableCashMemoData,
  RsoNameObject
} from '@poss-web/shared/models';

describe('Gift Cards reducer Testing Suite', () => {
  describe('Testing Create Gc Cash Memo Functionality', () => {
    beforeEach(() => {});
    it('Testing CREATE_GC_CASH_MEMO', () => {
      const action = new actions.CreateGcCashMemo();
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('CREATE_GC_CASH_MEMO_SUCCESS should return cash memo response', () => {
      const cashMemoResponse = {
        id: '',
        status: '',
        docNo: ''
      };
      const action = new actions.CreateGcCashMemoSuccess(cashMemoResponse);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.gcCashMemoDetails).toBe(cashMemoResponse);
    });
    it('CREATE_GC_CASH_MEMO_FAILURE should return error', () => {
      const action = new actions.CreateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Partially Update Gc Cash Memo Functionality', () => {
    beforeEach(() => {});
    it('Testing PARTIALLY_UPDATE_GC_CASH_MEMO', () => {
      const partiallyUpdateGcCmPayload: PartiallyUpdateGcCmPayload = {
        customerId: 625
      };
      const action = new actions.PartiallyUpdateGcCashMemo(
        '',
        partiallyUpdateGcCmPayload
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('PARTIALLY_UPDATE_GC_CASH_MEMO_SUCCESS should return partially Updated cash memo response', () => {
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
      const action = new actions.PartiallyUpdateGcCashMemoSuccess(
        partiallyUpdatedCashMemoResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.partiallyUpdatedGcCmResponse).toBe(
        partiallyUpdatedCashMemoResponse
      );
    });
    it('PARTIALLY_UPDATE_GC_CASH_MEMO_FAILURE should return error', () => {
      const action = new actions.PartiallyUpdateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Update Gc Cash Memo Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_GC_CASH_MEMO', () => {
      const requestDetails = {
        customerId: 625,
        finalValue: 22300,
        remarks: 'Test remark',
        totalDiscount: 0,
        totalQuantity: 1,
        totalTax: 0,
        totalValue: 22300,
        paidValue: 22300,
        totalWeight: 0
      };
      const action = new actions.UpdateGcCashMemo('', requestDetails);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_GC_CASH_MEMO_SUCCESS should return Updated cash memo response', () => {
      const updatedGcCashMemoResponse: GetUpdatedGcCashMemoResponse = {
        customerId: 625,
        docDate: '321214',
        docNo: 233,
        employeeCode: 'rso',
        finalValue: 1000,
        id: '224234',
        paidValue: 1000,
        remarks: 'sfsfsdgdsgdsg',
        status: 'confirmed',
        subTxnType: 'GIFT_SALE',
        totalDiscount: 0,
        totalQuantity: 1,
        totalTax: 0,
        totalValue: 1000,
        txnType: 'CM'
      };
      const action = new actions.UpdateGcCashMemoSuccess(
        updatedGcCashMemoResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.updateGcCashMemoResponse.customerId).toBe(625);
    });
    it('UPDATE_GC_CASH_MEMO_FAILURE should return error', () => {
      const action = new actions.UpdateGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Add Gift Card Item Functionality', () => {
    beforeEach(() => {});
    it('Testing ADD_GIFT_CARD_ITEM', () => {
      const requestBody: AddGiftCardItemPayload = {
        finalValue: 1000,
        instrumentNo: '',
        rowId: 1,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new actions.AddGiftCardItem('', requestBody);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('ADD_GIFT_CARD_ITEM_SUCCESS should return Added Gift Card Item response', () => {
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
      const action = new actions.AddGiftCardItemSuccess(giftCardItemResponse);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.addGiftCardItemResponse).toBe(giftCardItemResponse);
    });
    it('ADD_GIFT_CARD_ITEM_FAILURE should return error', () => {
      const action = new actions.AddGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Get Gift Card Item Functionality', () => {
    beforeEach(() => {});
    it('Testing GET_ADDED_GIFT_CARD_ITEM', () => {
      const action = new actions.GetAddedGiftCardItem('', '');
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing GET_ADDED_GIFT_CARD_ITEM_SUCCESS should return Get Gift Card Item response', () => {
      const getGiftCardItemResponse: GetGiftCardItemResponse = {
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
      const action = new actions.GetAddedGiftCardItemSuccess(
        getGiftCardItemResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.getAddedGiftCardItemResponse.itemId).toBe(
        getGiftCardItemResponse.itemId
      );
    });
    it('ADD_GIFT_CARD_ITEM_FAILURE should return error', () => {
      const action = new actions.GetAddedGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Delete Gift Card Item Functionality', () => {
    beforeEach(() => {});
    it('Testing DELETE_ADDED_GIFT_CARD_ITEM', () => {
      const action = new actions.DeleteAddedGiftCardItem('', '');
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing DELETE_ADDED_GIFT_CARD_ITEM_SUCCESS should return Delete Gift Card Item response', () => {
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
      const action = new actions.DeleteAddedGiftCardItemSuccess(
        deleteAddedGiftCardItemResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.deleteAddedGiftCardItemResponse).toBe(
        deleteAddedGiftCardItemResponse
      );
    });
    it('DELETE_ADDED_GIFT_CARD_ITEM_FAILURE should return error', () => {
      const action = new actions.DeleteAddedGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Partially update Gift Card Item Functionality', () => {
    beforeEach(() => {});
    it('Testing PARTIALLY_UPDATE_GIFT_CARD_ITEM', () => {
      const requestBody: PartiallyUpdateGiftDetailsPayload = {
        finalValue: 1000,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new actions.PartiallyUpdateGiftCardItem(
        '',
        '',
        requestBody
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing PARTIALLY_UPDATE_GIFT_CARD_ITEM_SUCCESS should return Partially Update Gift Card Item response', () => {
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
      const action = new actions.PartiallyUpdateGiftCardItemSuccess(
        partiallyUpdateGiftCardItemResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.partiallyUpdateGiftCardItemResponse).toBe(
        partiallyUpdateGiftCardItemResponse
      );
    });
    it('PARTIALLY_UPDATE_GIFT_CARD_ITEM_FAILURE should return error', () => {
      const action = new actions.PartiallyUpdateGiftCardItemFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });
  describe('Testing Load Rso Details Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_RSO_DETAILS', () => {
      const action = new actions.LoadRSODetails('RSO');
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing LOAD_RSO_DETAILS_SUCCESS should return rso details response', () => {
      const rsoDetailsResponse: RsoNameObject[] = [
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ];
      const action = new actions.LoadRSODetailsSuccess(rsoDetailsResponse);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.rsoDetails.length).toEqual(1);
    });
    it('LOAD_RSO_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Cash Memo Bills Available For Cancellation Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION', () => {
      const action = new actions.LoadCashMemoBillsAvailableForCancellation(
        '9876543210',
        65
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_SUCCESS should return list of cash memo available for cancellation response', () => {
      const cashMemoAvailableForCancellationResponse: CancellableCashMemoData[] = [
        {
          customerName: '',
          refDocDate: '',
          refDocNo: 32,
          refTxnId: '',
          refTxnTime: '',
          subTxnType: ''
        }
      ];
      const action = new actions.LoadCashMemoBillsAvailableForCancellationSuccess(
        cashMemoAvailableForCancellationResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.gcCashMemoBillsReadyForCancellation.length).toEqual(1);
      expect(result.gcCashMemoBillsReadyForCancellation[0].refDocNo).toBe(32);
    });
    it('LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_FAILURE should return error', () => {
      const action = new actions.LoadCashMemoBillsAvailableForCancellationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Selected Cash Memo Details Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_SELECTED_GC_CASH_MEMO_DETAILS', () => {
      const action = new actions.LoadSelectedGcCashMemoDetails('12345678');
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing LOAD_SELECTED_GC_CASH_MEMO_DETAILS_SUCCESS should return selected cash memo details response', () => {
      const cashMemoMinimalDetail = {
        customerId: 625,
        itemIdList: [],
        id: '',
        docNo: 23,
        totalQuantity: 2,
        totalTax: 0,
        totalValue: 1000,
        confirmedTime: 1234567890
      };
      const action = new actions.LoadSelectedGcCashMemoDetailsSuccess(
        cashMemoMinimalDetail
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.selectedGcCashMemoData).toBe(cashMemoMinimalDetail);
    });
    it('Testing LOAD_SELECTED_GC_CASH_MEMO_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadSelectedGcCashMemoDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Cancel Gc Cash Memo Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_CANCEL_GC_CASH_MEMO', () => {
      const cmCancelRequestBody = {
        cancelType: '',
        reasonForCancellation: '',
        refTxnId: '',
        remarks: '',
        employeeCode: ''
      };
      const action = new actions.LoadCancelGcCashMemo(cmCancelRequestBody);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing LOAD_CANCEL_GC_CASH_MEMO_SUCCESS should return cancel gc cash memo response', () => {
      const mockGcCashMemoCancelResponse = {
        cndocNos: [],
        docNo: 34,
        id: ''
      };
      const action = new actions.LoadCancelGcCashMemoSuccess(
        mockGcCashMemoCancelResponse
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.cancelGcCashMemoResponse).toBe(
        mockGcCashMemoCancelResponse
      );
    });
    it('Testing LOAD_CANCEL_GC_CASH_MEMO_FAILURE should return error', () => {
      const action = new actions.LoadCancelGcCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Load Cancellation Reasons Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_GC_CANCELLATION_REASONS', () => {
      const action = new actions.LoadGcCancellationReasons();
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('Testing LOAD_GC_CANCELLATION_REASONS_SUCCESS should return cancel gc cash memo response', () => {
      const cancellationReasons = ['Reason 1', 'Reason 2'];
      const action = new actions.LoadGcCancellationReasonsSuccess(
        cancellationReasons
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.gcCancellationReasons.length).toBe(2);
    });
    it('Testing LOAD_GC_CANCELLATION_REASONS_FAILURE should return error', () => {
      const action = new actions.LoadGcCancellationReasonsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing other reducers Functionality', () => {
    beforeEach(() => {});
    it('LoadCardsList should update cardsList property in store', () => {
      const cardsList = [
        {
          cardNo: '4565379098124421',
          bin: 'QCGC',
          amount: 0,
          tax: 0,
          finalPrice: 0,
          itemId: 'adsaf422-drfdsf2'
        },
        {
          cardNo: '4565379092424343',
          bin: 'QCGC1',
          amount: 0,
          tax: 0,
          finalPrice: 0,
          itemId: 'adsaf422-drfdsf3'
        }
      ];
      const action = new actions.LoadCardsList(cardsList);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.cardsList.length).toBe(2);
    });
    it('SetSelectedSOName should update selectedSOName property in store', () => {
      const selectedSO = { value: 'SO Name 1', description: 'SO Name 1' };
      const action = new actions.SetSelectedRSOName(selectedSO);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.selectedRSOName.value).toBe('SO Name 1');
    });
    it('SetCardsTotalAmount should update cardsTotalAmount property in store', () => {
      const cardTotalAmount = 11200;
      const action = new actions.SetCardsTotalAmount(cardTotalAmount);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.cardsTotalAmount).toBe(11200);
    });
    it('SetCardsTotalQty should update cardsTotalQty property in store', () => {
      const cardTotalQty = 3;
      const action = new actions.SetCardsTotalQty(cardTotalQty);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.cardsTotalQty).toBe(3);
    });
    it('SetGcTotalPaidAmount should update gcTotalPaidAmount property in store', () => {
      const gcTotalPaidAmount = 500;
      const action = new actions.SetGcTotalPaidAmount(gcTotalPaidAmount);
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.gcTotalAmountPaid).toBe(500);
    });
    it('SetSelectedCancellationReason should update gcTotalPaidAmount property in store', () => {
      const action = new actions.SetSelectedCancellationReason('Reason 1');
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.selectedGcCancellationReason).toBe('Reason 1');
    });
    it('ResetGiftCardsData should reset properties in gift card store', () => {
      const action = new actions.ResetGiftCardsData();
      const result: GiftCardsState = GiftCardsReducer(initialState, action);
      expect(result.cardsList.length).toEqual(0);
      expect(result.cardsTotalAmount).toBe(0);
      expect(result.gcTotalAmountPaid).toBe(0);
      expect(result.cardsTotalQty).toBe(0);
      expect(result.selectedRSOName).toBe(null);
    });
  });
});
