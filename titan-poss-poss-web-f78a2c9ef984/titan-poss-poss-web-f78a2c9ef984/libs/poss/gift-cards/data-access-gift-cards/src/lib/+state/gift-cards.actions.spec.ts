import {
  GiftCardsActionTypes,
  SetSelectedRSOName,
  SetCardsTotalAmount,
  SetGcTotalPaidAmount,
  SetCardsTotalQty,
  LoadCardsList,
  ResetGiftCardsData,
  CreateGcCashMemo,
  CreateGcCashMemoSuccess,
  CreateGcCashMemoFailure,
  PartiallyUpdateGcCashMemo,
  PartiallyUpdateGcCashMemoSuccess,
  PartiallyUpdateGcCashMemoFailure,
  UpdateGcCashMemo,
  UpdateGcCashMemoSuccess,
  UpdateGcCashMemoFailure,
  AddGiftCardItem,
  AddGiftCardItemSuccess,
  AddGiftCardItemFailure,
  GetAddedGiftCardItem,
  GetAddedGiftCardItemSuccess,
  GetAddedGiftCardItemFailure,
  DeleteAddedGiftCardItem,
  DeleteAddedGiftCardItemSuccess,
  DeleteAddedGiftCardItemFailure,
  PartiallyUpdateGiftCardItem,
  PartiallyUpdateGiftCardItemSuccess,
  PartiallyUpdateGiftCardItemFailure,
  LoadRSODetails,
  LoadRSODetailsSuccess,
  LoadRSODetailsFailure,
  LoadCashMemoBillsAvailableForCancellation,
  LoadCashMemoBillsAvailableForCancellationSuccess,
  LoadCashMemoBillsAvailableForCancellationFailure,
  LoadGcCancellationReasons,
  LoadGcCancellationReasonsSuccess,
  LoadGcCancellationReasonsFailure,
  SetSelectedCancellationReason,
  LoadSelectedGcCashMemoDetails,
  LoadSelectedGcCashMemoDetailsSuccess,
  LoadSelectedGcCashMemoDetailsFailure,
  LoadCancelGcCashMemo,
  LoadCancelGcCashMemoSuccess,
  LoadCancelGcCashMemoFailure
} from './gift-cards.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  GetCreatedGiftCardCmDetails,
  AddGiftCardItemPayload,
  PartiallyUpdateGiftDetailsPayload,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GetAddedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetDeletedGiftCardItemResponse,
  GiftCardItem,
  CancellableCashMemoData
} from '@poss-web/shared/models';

describe('Gift Cards Action Testing Suite', () => {
  describe('CreateGcCashMemo Action Test Cases', () => {
    it('should check correct type is used for CreateGcCashMemo action ', () => {
      const action = new CreateGcCashMemo();
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.CREATE_GC_CASH_MEMO
      });
    });
    it('should check correct type is used for CreateGcCashMemoSuccess action ', () => {
      const payload: GetCreatedGiftCardCmDetails = {
        id: '',
        status: '',
        docNo: ''
      };
      const action = new CreateGcCashMemoSuccess(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.CREATE_GC_CASH_MEMO_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  CreateGcCashMemo Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateGcCashMemoFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.CREATE_GC_CASH_MEMO_FAILURE,
        payload
      });
    });
  });
  describe('PartiallyUpdateGcCashMemo Action Test Cases', () => {
    it('should check correct type is used for PartiallyUpdateGcCashMemo action ', () => {
      const action = new PartiallyUpdateGcCashMemo('', { customerId: 625 });
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO,
        cashMemoId: '',
        requestBody: { customerId: 625 }
      });
    });
    it('should check correct type is used for PartiallyUpdateGcCashMemo action ', () => {
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
      const action = new PartiallyUpdateGcCashMemoSuccess(
        partiallyUpdatedCashMemoResponse
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_SUCCESS,
        payload: partiallyUpdatedCashMemoResponse
      });
    });
    it('should check correct type is used for  CreateGcCashMemo Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartiallyUpdateGcCashMemoFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_FAILURE,
        payload
      });
    });
  });
  describe('UpdateGcCashMemo Action Test Cases', () => {
    it('should check correct type is used for UpdateGcCashMemo action ', () => {
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
      const action = new UpdateGcCashMemo('', requestDetails);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.UPDATE_GC_CASH_MEMO,
        cashMemoId: '',
        requestDetails
      });
    });
    it('should check correct type is used for UpdateGcCashMemoSuccess action ', () => {
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
      const action = new UpdateGcCashMemoSuccess(updatedGcCashMemoResponse);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_SUCCESS,
        payload: updatedGcCashMemoResponse
      });
    });
    it('should check correct type is used for  UpdateGcCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateGcCashMemoFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_FAILURE,
        payload
      });
    });
  });
  describe('AddGiftCardItem Action Test Cases', () => {
    it('should check correct type is used for AddGiftCardItem action ', () => {
      const requestBody: AddGiftCardItemPayload = {
        finalValue: 1000,
        instrumentNo: '',
        rowId: 1,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new AddGiftCardItem('', requestBody);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.ADD_GIFT_CARD_ITEM,
        cashMemoId: '',
        requestBody
      });
    });
    it('should check correct type is used for AddGiftCardItemSuccess action ', () => {
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
      const action = new AddGiftCardItemSuccess(giftCardItemResponse);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_SUCCESS,
        payload: giftCardItemResponse
      });
    });
    it('should check correct type is used for  AddGiftCardItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddGiftCardItemFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('GetAddedGiftCardItem Action Test Cases', () => {
    it('should check correct type is used for GetAddedGiftCardItem action ', () => {
      const action = new GetAddedGiftCardItem('', '');
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM,
        cashMemoId: '',
        giftCardItemId: ''
      });
    });
    it('should check correct type is used for GetAddedGiftCardItemSuccess action ', () => {
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
      const action = new GetAddedGiftCardItemSuccess(getGiftCardItemResponse);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_SUCCESS,
        payload: getGiftCardItemResponse
      });
    });
    it('should check correct type is used for  GetAddedGiftCardItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetAddedGiftCardItemFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('DeleteAddedGiftCardItem Action Test Cases', () => {
    it('should check correct type is used for DeleteAddedGiftCardItem action ', () => {
      const action = new DeleteAddedGiftCardItem('', '');
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM,
        cashMemoId: '',
        giftCardItemId: ''
      });
    });
    it('should check correct type is used for DeleteAddedGiftCardItemSuccess action ', () => {
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
      const action = new DeleteAddedGiftCardItemSuccess(
        deleteAddedGiftCardItemResponse
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_SUCCESS,
        payload: deleteAddedGiftCardItemResponse
      });
    });
    it('should check correct type is used for DeleteAddedGiftCardItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteAddedGiftCardItemFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('PartiallyUpdateGiftCardItem Action Test Cases', () => {
    it('should check correct type is used for PartiallyUpdateGiftCardItem action ', () => {
      const requestBody: PartiallyUpdateGiftDetailsPayload = {
        finalValue: 1000,
        totalTax: 0,
        totalValue: 1000
      };
      const action = new PartiallyUpdateGiftCardItem('', '', requestBody);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM,
        cashMemoId: '',
        giftCardItemId: '',
        requestBody
      });
    });
    it('should check correct type is used for PartiallyUpdateGiftCardItemSuccess action ', () => {
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
      const action = new PartiallyUpdateGiftCardItemSuccess(
        partiallyUpdateGiftCardItemResponse
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_SUCCESS,
        payload: partiallyUpdateGiftCardItemResponse
      });
    });
    it('should check correct type is used for  PartiallyUpdateGiftCardItemFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartiallyUpdateGiftCardItemFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_FAILURE,
        payload
      });
    });
  });
  describe('LoadRSODetails Action Test Cases', () => {
    it('should check correct type is used for LoadRSODetails action ', () => {
      const action = new LoadRSODetails('');
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_RSO_DETAILS,
        payload: ''
      });
    });
    it('should check correct type is used for LoadRSODetailsSuccess action ', () => {
      const rsoDetailsResponse = [
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ];
      const action = new LoadRSODetailsSuccess(rsoDetailsResponse);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_RSO_DETAILS_SUCCESS,
        payload: rsoDetailsResponse
      });
    });
    it('should check correct type is used for  LoadRSODetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRSODetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_RSO_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCashMemoBillsAvailableForCancellation Action Test Cases', () => {
    it('should check correct type is used for LoadCashMemoBillsAvailableForCancellation action ', () => {
      const mobileNumber = '9876543210';
      const cmNumber = 65;
      const action = new LoadCashMemoBillsAvailableForCancellation(
        mobileNumber,
        cmNumber
      );
      expect({ ...action }).toEqual({
        type:
          GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION,
        mobileNumber,
        cmNumber
      });
    });
    it('should check correct type is used for LoadCashMemoBillsAvailableForCancellationSuccess action ', () => {
      const cancellableCashMemoData: CancellableCashMemoData = {
        customerName: '',
        refDocDate: '',
        refDocNo: 23,
        refTxnId: '',
        refTxnTime: '',
        subTxnType: ''
      };
      const action = new LoadCashMemoBillsAvailableForCancellationSuccess([
        cancellableCashMemoData
      ]);
      expect({ ...action }).toEqual({
        type:
          GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_SUCCESS,
        payload: [cancellableCashMemoData]
      });
    });
    it('should check correct type is used for  LoadCashMemoBillsAvailableForCancellationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCashMemoBillsAvailableForCancellationFailure(
        payload
      );
      expect({ ...action }).toEqual({
        type:
          GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadGcCancellationReasons Action Test Cases', () => {
    it('should check correct type is used for LoadGcCancellationReasons action ', () => {
      const action = new LoadGcCancellationReasons();
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS
      });
    });
    it('should check correct type is used for LoadGcCancellationReasonsSuccess action ', () => {
      const mockCancellationReasons = ['Reason 1', 'Reason 2'];
      const action = new LoadGcCancellationReasonsSuccess(
        mockCancellationReasons
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_SUCCESS,
        payload: mockCancellationReasons
      });
    });
    it('should check correct type is used for  LoadGcCancellationReasonsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGcCancellationReasonsFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedGcCashMemoDetails Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedGcCashMemoDetails action ', () => {
      const action = new LoadSelectedGcCashMemoDetails('12345678');
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS,
        payload: '12345678'
      });
    });
    it('should check correct type is used for LoadSelectedGcCashMemoDetailsSuccess action ', () => {
      const cashMemoMinimalDetail = {
        customerId: 625,
        itemIdList: [],
        id: '',
        docNo: 23,
        totalQuantity: 2,
        totalTax: 0,
        confirmedTime: 1234567890,
        totalValue: 1000
      };
      const action = new LoadSelectedGcCashMemoDetailsSuccess(
        cashMemoMinimalDetail
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_SUCCESS,
        payload: cashMemoMinimalDetail
      });
    });
    it('should check correct type is used for  LoadSelectedGcCashMemoDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedGcCashMemoDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadCancelGcCashMemo Action Test Cases', () => {
    it('should check correct type is used for LoadCancelGcCashMemo action ', () => {
      const cmCancelRequestBody = {
        cancelType: '',
        reasonForCancellation: '',
        refTxnId: '',
        remarks: '',
        employeeCode: ''
      };
      const action = new LoadCancelGcCashMemo(cmCancelRequestBody);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO,
        payload: cmCancelRequestBody
      });
    });
    it('should check correct type is used for LoadCancelGcCashMemoSuccess action ', () => {
      const mockGcCashMemoCancelResponse = {
        cndocNos: [],
        docNo: 34,
        id: ''
      };
      const action = new LoadCancelGcCashMemoSuccess(
        mockGcCashMemoCancelResponse
      );
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_SUCCESS,
        payload: mockGcCashMemoCancelResponse
      });
    });
    it('should check correct type is used for  LoadCancelGcCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelGcCashMemoFailure(payload);
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_FAILURE,
        payload
      });
    });
  });

  describe('Other Test Cases', () => {
    it('should check correct type is used for SelectedRSOName action ', () => {
      const payload = { value: 'RSO Name 1', description: 'Rso name' };
      const action = new SetSelectedRSOName(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.SELECTED_RSO_NAME,
        payload
      });
    });
    it('should check correct type is used for SetCardsTotalAmount action ', () => {
      const payload = 10000;
      const action = new SetCardsTotalAmount(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.SET_CARDS_TOTAL_AMOUNT,
        payload
      });
    });
    it('should check correct type is used for SetCardsTotalQty action ', () => {
      const payload = 3;
      const action = new SetCardsTotalQty(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.SET_CARDS_TOTAL_QTY,
        payload
      });
    });
    it('should check correct type is used for SetGcTotalPaidAmount action ', () => {
      const payload = 3000;
      const action = new SetGcTotalPaidAmount(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.SET_GC_TOTAL_PAID_AMOUNT,
        payload
      });
    });
    it('should check correct type is used for LoadCardsList action ', () => {
      const payload: GiftCardItem[] = [
        {
          cardNo: '4565379098124421',
          bin: 'QCGC',
          amount: 0,
          tax: 0,
          finalPrice: 0,
          itemId: 'ada4222-dss32432'
        },
        {
          cardNo: '2356890976431134',
          bin: 'QCGC1',
          amount: 0,
          tax: 0,
          finalPrice: 0,
          itemId: 'ada4222-dss32432'
        }
      ];
      const action = new LoadCardsList(payload);

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.LOAD_CARDS_LIST,
        payload
      });
    });
    it('should check correct type is used for ResetGiftCardsData action ', () => {
      const action = new ResetGiftCardsData();

      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.RESET_GIFT_CARDS_DATA
      });
    });
    it('should check correct type is used for SetSelectedCancellationReason action ', () => {
      const action = new SetSelectedCancellationReason('Reason 1');
      expect({ ...action }).toEqual({
        type: GiftCardsActionTypes.SET_SELECTED_CANCELLATION_REASON,
        payload: 'Reason 1'
      });
    });
  });
});
