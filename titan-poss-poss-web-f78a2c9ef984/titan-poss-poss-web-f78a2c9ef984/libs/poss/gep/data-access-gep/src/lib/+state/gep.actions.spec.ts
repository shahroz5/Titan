//import { LoadOnHoldFailure } from './../../../../../shared/toolbar/data-access-toolbar/src/lib/+state/toolbar.actions';
import { AdvanceHistoryItemsRequestPayload, CustomErrors, GEPSearchResponse, HistorySearchParamDetails, TransactionTypeEnum } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GepInit,
  GepInitSuccess,
  GepInitFailure,
  PostGepItems,
  PostGepItemsSuccess,
  PostGepItemsFailure,
  GepMetalRate,
  GepMetalRateSuccess,
  GepMetalRateFailure,
  TotalValueBreakUp,
  TotalValueBreakUpSuccess,
  TotalValueBreakupFailure,
  LoadMetal,
  LoadMetalSuccess,
  LoadMetalFailure,
  LoadITEM,
  LoadITEMSuccess,
  LoadITEMFailure,
  UpdateSummaryBar,
  HoldConfirm,
  HoldConfirmSuccess,
  HoldConfirmFailure,
  Delete,
  DeleteSuccess,
  DeleteFailure,
  PostRSO,
  PostRSOSuccess,
  PostRSOFailure,
  UpdateITEM,
  UpdateITEMSuccess,
  UpdateITEMFailure,
  GetGepITEM,
  GetGepITEMSuccess,
  GetGepITEMFailure,
  ResetGep,
  SaveCanceleGep,
  SaveCanceleGepFailure,
  SaveCanceleGepSuccess,
  LoadCancelGep,
  LoadCancelGepSuccess,
  LoadCancelGepFailure,
  LoadCountOnHoLd,
  LoadCountOnHoLdSuccess,
  LoadCountOnHoLdFailure,
  LoadOnHold,
  LoadOnHoldSuccess,
  LoadOnHoldFailure,
  DeleteGepITEM,
  DeleteITEMSuccess,
  DeleteITEMFailure,
  LoadGepItem,
  LoadGepItemSuccess,
  LoadGepItemFailure,
  ImageUpload,
  ImageUploadSuccess,
  ImageUploadFailure,
  SaveProduct,
  UpdateProduct,
  UpdatePremelting,
  DeleteTempId,
  UpdatePrice,
  UpdatePriceSuccess,
  UpdatePriceFailure,
  UpdateWeight,
  UpdatePurity,
  LoadGepItemPriceSuccess,
  SaveRso,
  SaveReason,
  GepActionsTypes,
  ClearSearchList,
  LoadGEPHistory,
  LoadGEPHistorySuccess,
  LoadGEPHistoryFailure,
  SetHistoryGEPSearchParamDetails,
  ViewGEP,
  ViewGEPSuccess,
  ViewGEPFailure
  
} from './gep.actions';
import * as moment from 'moment';

const advanceHistoryItemsRequestPayload : AdvanceHistoryItemsRequestPayload = { 
  "docNo": 26,
  "fiscalYear": 2020
}  

const gepSearchResponse : GEPSearchResponse = { GEPList:[], totalElements:1 };

const historySearchParamDetails : HistorySearchParamDetails = { cnDocNo:3 };

describe('Gep Action Testing suit', () => {
  // const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  //   id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //   subTxnType: 'NEW_CM',
  //   txnType: 'CM',
  //   itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
  // };

  // const CmItemDetailsResponse: CashMemoItemDetails = {
  //   itemCode: '503820DCEABAP1',
  //   lotNumber: '2EA000011',
  //   // inventoryWeight: 12.081
  //   unitWeight: 12.081,
  //   totalWeight: 12.05,
  //   totalQuantity: 1,
  //   inventoryId: 'AAB96E94-3AF9-4ADD-A6FC-0044417CDD67',
  //   unitValue: 60002.3,
  //   totalValue: 60002.3,
  //   totalDiscount: 0.0,
  //   finalValue: 61802.36,
  //   totalTax: 1800.06,
  //   employeeCode: 'rsocpd',
  //   remarks: 'asd',
  //   reason: null,
  //   itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
  //   binCode: 'ZEROBIN',
  //   rowId: 1,
  //   refTxnId: null,
  //   refTxnType: null,
  //   inventoryWeightDetails: {
  //     type: 'WEIGHT_DETAILS',
  //     data: {
  //       goldWeight: 12.081,
  //       platinumWeight: 0,
  //       silverWeight: 0,
  //       stoneWeight: 0.53,
  //       materialWeight: 0,
  //       diamondWeight: 0.0
  //     }
  //   },
  //   measuredWeightDetails: {
  //     type: 'WEIGHT_DETAILS',
  //     data: {
  //       silverWeight: 0.0,
  //       stoneWeight: 0,
  //       materialWeight: 0,
  //       goldWeight: 0.0,
  //       diamondWeight: 0,
  //       platinumWeight: 0.0
  //     }
  //   },
  //   priceDetails: {
  //     metalPriceDetails: {
  //       preDiscountValue: 46948.85,
  //       metalPrices: [
  //         {
  //           weightUnit: 'gms',
  //           netWeight: 12.05,
  //           metalValue: 46948.85,
  //           type: 'Gold',
  //           ratePerUnit: 3896.17,
  //           karat: 18.0,
  //           purity: 75.0,
  //           metalTypeCode: 'J'
  //         }
  //       ]
  //     },
  //     stonePriceDetails: {
  //       preDiscountValue: 612.0,
  //       weightUnit: null,
  //       stoneWeight: null,
  //       numberOfStones: null
  //     },
  //     makingChargeDetails: {
  //       preDiscountValue: 12441.45,
  //       makingChargePercentage: 26.5,
  //       isDynamicPricing: true
  //     }
  //   },
  //   taxDetails: {
  //     taxType: 'ITEMCHARGES',
  //     taxClass: 'TC75',
  //     data: [
  //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
  //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
  //     ],
  //     cess: []
  //   },
  //   productGroupCode: '75',
  //   productCategoryCode: 'D',
  //   discountDetails: null,
  //   focDetails: {},
  //   isFoc: true,
  //   itemInStock: true
  //   // inventoryStdValue: 47951.13,
  //   // inventoryStdWeight: 12.081,
  // };

  // const billCancelPayload: BillCancelPayload = {
  //   cancelType: 'CANCEL_WITH_CN',
  //   employeeCode: 'rso',
  //   reasonForCancellation: 'test',
  //   refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //   remarks: 'test'
  // };

  // const cancelResponse: CancelResponse = {
  //   cndocNos: [234, 235],
  //   docNo: 12,
  //   id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
  // };

  // const confirmResponse: ConfirmResponse = {
  //   docNo: 12,
  //   id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //   requestNo: '90'
  // };

  // const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  //   id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //   subTxnType: 'NEW_CM',
  //   txnType: 'CM'
  // };

  // const cashMemoDetailsResponse: CashMemoDetailsResponse = {
  //   customerId: 6,
  //   occasion: 'Wedding/Marriage',
  //   totalQuantity: 1,
  //   totalWeight: 12.05,
  //   totalValue: 60002.3,
  //   totalTax: 1800.06,
  //   finalValue: 61802.0,
  //   totalDiscount: 0.0,
  //   paidValue: 61802.0,
  //   remarks: 'Remarks',
  //   // otherCharges: null,
  //   otherChargesList: null,
  //   metalRateList: {
  //     metalRates: {
  //       J: {
  //         metalTypeCode: 'J',
  //         purity: 91.62,
  //         ratePerUnit: 4762,
  //         currency: 'INR',
  //         applicableDate: 1611081000000,
  //         karat: 22.0
  //       },
  //       L: {
  //         metalTypeCode: 'L',
  //         purity: 95.0,
  //         ratePerUnit: 3473,
  //         currency: 'INR',
  //         applicableDate: 1611081000000,
  //         karat: 0.0
  //       }
  //     }
  //   },
  //   id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //   status: StatusTypesEnum.CONFIRMED,
  //   refTxnId: null,
  //   refTxnType: null,
  //   docNo: 54,
  //   docDate: moment(1611081000000),
  //   fiscalYear: 2020,
  //   firstHoldTime: moment(1610012299519),
  //   lastHoldTime: moment(1610012299519),
  //   roundingVariance: -0.36,
  //   employeeCode: 'cashiercpd',
  //   txnType: 'CM',
  //   subTxnType: 'NEW_CM',
  //   // confirmedTime: moment(1611110936440),
  //   manualBillDetails: null,
  //   taxDetails: {
  //     // taxes: [
  //     //   {
  //     //     taxType: 'ITEMCHARGES',
  //     //     taxClass: 'TC75',
  //     //     data: [
  //     //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
  //     //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
  //     //     ],
  //     //     cess: []
  //     //   }
  //     // ]
  //     taxType: 'ITEMCHARGES',
  //     taxClass: 'TC75',
  //     data: [
  //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
  //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
  //     ],
  //     cess: []
  //   },
  //   // currencyCode: 'INR',
  //   // weightUnit: 'gms',
  //   // manualBillId: null,
  //   discountDetails: null,
  //   itemIdList: ['741B3399-ED98-44D8-B25D-BBDADCA2F1D2'],
  //   focDetails: null,
  //   txnTime: null
  // };

  // const cmBillListPayload: CmBillListPayload = {
  //   subTxnType: 'NEW_CM',
  //   txnType: 'CM',
  //   sort: 'docDate, DESC'
  //   // customerName?: string;
  //   // refDocNo?: number;
  //   // pageIndex?: number;
  //   // pageSize?: number;
  // };

  // const cmBillList: CmBillList[] = [
  //   {
  //     currencyCode: 'INR',
  //     customerName: 'SREENIVAS',
  //     refDocDate: moment(1611081000000),
  //     refDocNo: 54,
  //     refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
  //     refTxnTime: moment(1611110936440),
  //     subTxnType: 'NEW_CM',
  //     totalValue: 60002.3,
  //     txnType: 'CM',
  //     totalElements: 10
  //   }
  // ];

  // const LOVCode = 'REASON_FOR_CANCELLATION';

  // const dummyReasonForCancelResponse: Lov[] = [
  //   {
  //     code: 'CM',
  //     isActive: true,
  //     value: 'Cash Memo'
  //   }
  // ];

  const RSOCode = 'RSO';

  const RSOResponae = ['RSO'];

  describe(' ResetGep Action Test Cases', () => {
    it('should check correct type is used for  ResetGep action ', () => {
      const action = new ResetGep();

      expect(action.type).toEqual(GepActionsTypes.RESET_GEP);
    });
  });

  describe(' UpdateWeight Action Test Cases', () => {
    it('should check correct type is used for  updateWeight action ', () => {
      const action = new UpdateWeight({ weight: 67, id: '456789' });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_WEIGHT);
    });
  });

  describe(' SaveReasson Action Test Cases', () => {
    it('should check correct type is used for  saveReason action ', () => {
      const action = new SaveReason('check');

      expect(action.type).toEqual(GepActionsTypes.SAVE_REASON);
    });
  });

  describe(' SaveRso Action Test Cases', () => {
    it('should check correct type is used for  saveReason action ', () => {
      const action = new SaveRso('check');

      expect(action.type).toEqual(GepActionsTypes.SAVE_RSO);
    });
  });

  describe('upadatePurity Action Test Cases', () => {
    it('should check correct type is used for  updatePurity action ', () => {
      const action = new UpdatePurity({
        purity: 78,
        id: '56890-sdfuop'
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_Purity);
    });
  });

  describe(' deleteTempId Action Test Cases', () => {
    it('should check correct type is used for  deleteTempId action ', () => {
      const action = new DeleteTempId('34567890');

      expect(action.type).toEqual(GepActionsTypes.DELETE_TEMPID);
    });
  });

  describe(' UpdatePremelting Action Test Cases', () => {
    it('should check correct type is used for  updatepremelting action ', () => {
      const action = new UpdatePremelting({
        preMelting: {
          weight: 56,
          purity: 78,
          karatage: 12
        },
        id: 'w456789-567890'
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_PREMELTING);
    });
  });

  describe(' UpdateProduvt Action Test Cases', () => {
    it('should check correct type is used for  updateproDuct action ', () => {
      const action = new UpdateProduct({
        metal: 'J',
        item: 'jewellery',
        id: 'sdfhjk-3456789'
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_PRODUCT);
    });
  });

  describe(' UpdateSummaryBar Action Test Cases', () => {
    it('should check correct type is used for  update Summary bar action ', () => {
      const action = new UpdateSummaryBar('check');

      expect(action.type).toEqual(GepActionsTypes.UPDATE_SUMMARY);
    });
  });

  describe(' SaveReasson Action Test Cases', () => {
    it('should check correct type is used for  saveReason action ', () => {
      const action = new SaveReason('check');

      expect(action.type).toEqual(GepActionsTypes.SAVE_REASON);
    });
  });

  describe(' SaveProduct Action Test Cases', () => {
    it('should check correct type is used for  saveReason action ', () => {
      const action = new SaveProduct({
        weight: 78,
        purity: 56,
        metalType: 'J'
      });

      expect(action.type).toEqual(GepActionsTypes.SAVE_PRODUCT_ID);
    });
  });

  describe(' UpdatePrice Action Test Cases', () => {
    it('should check correct type is used for  updatePrice action ', () => {
      const action = new UpdatePrice({
        subTxnType: 'NEW_GEP',
        id: '2346789-DDFTHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_PRICE);
    });
    it('should check correct type is used for  UPDATEPRICESUCCESS action ', () => {
      const action = new UpdatePriceSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_PRICE_SUCCESS);
    });

    it('should check correct type is used for  GetItemfromCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePriceFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_PRICE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe(' ImaggeUpload Action Test Cases', () => {
    it('should check correct type is used for  ImageUplaod action ', () => {
      const action = new ImageUpload({
        file: null,
        customerId: 345678,

        id: '2346789-DDFTHJ',
        txnType: TransactionTypeEnum.GEP
      });

      expect(action.type).toEqual(GepActionsTypes.IMAGE_UPLOAD);
    });
    it('should check correct type is used for  ImageUploadESUCCESS action ', () => {
      const action = new ImageUploadSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.IMAGE_UPLOAD_SUCCESS);
    });

    it('should check correct type is used for  ImageUploafFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ImageUploadFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.IMAGE_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe(' ISavdeCancel Action Test Cases', () => {
    it('should check correct type is used for  SaveCancel action ', () => {
      const action = new SaveCanceleGep({
        data: null,
        subTxnType: 'NEW_GEP'
      });

      expect(action.type).toEqual(GepActionsTypes.SAVE_CANCEL_GEP);
    });
    it('should check correct type is used for  SavecancelsUCCESS action ', () => {
      const action = new SaveCanceleGepSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.SAVE_CANCEL_GEP_SUCCESS);
    });

    it('should check correct type is used for  SavecancelFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCanceleGepFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.SAVE_CANCEL_GEP_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe(' LOADGEPITEM Action Test Cases', () => {
    it('should check correct type is used for  action ', () => {
      const action = new LoadGepItem({
        id: '2346789-DDFTHJ',
        subTxnType: 'NEW_GEP',
        itemId: '23456789-ertyui-345678'
      });

      expect(action.type).toEqual(GepActionsTypes.LOAD_GEP_ITEM);
    });

    it('should check correct type is used for  loadGepItemSuccess action ', () => {
      const action = new LoadGepItemPriceSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_GEP_ITEM_PRICE_SUCCESS);
    });

    it('should check correct type is used for  loadGepItemSuccess action ', () => {
      const action = new LoadGepItemSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_GEP_ITEM_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGepItemFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.LOAD_GEP_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe(' LOADCANCEL Action Test Cases', () => {
    it('should check correct type is used for  LoadCancelGep action ', () => {
      const action = new LoadCancelGep({});

      expect(action.type).toEqual(GepActionsTypes.LOAD_CANCEL_GEP);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new LoadCancelGepSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_CANCEL_GEP_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCancelGepFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.LOAD_CANCEL_GEP_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe(' LOADCOUNTAction Test Cases', () => {
    it('should check correct type is used for  LoadCOUNTGep action ', () => {
      const action = new LoadCountOnHoLd({
        status: 'CONFIRM',
        subTxnType: 'NEW_GEP'
      });

      expect(action.type).toEqual(GepActionsTypes.COUNT_ON_HOLD);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new LoadCountOnHoLdSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.COUNT_ON_HOLD_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountOnHoLdFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.COUNT_ON_HOLD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('deleteitem Test Cases', () => {
    it('should check correct type is used for  deleteitem  action ', () => {
      const action = new DeleteGepITEM({
        id: 'ej-2345789-sdghj',
        subTxnType: 'NEW_GEP'
      });

      expect(action.type).toEqual(GepActionsTypes.DELETE_GEP);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new DeleteITEMSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.DELETE_GEP_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteITEMFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.DELETE_GEP_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('loadOnHols Test Cases', () => {
    it('should check correct type is used for  loadOnHold action ', () => {
      const action = new LoadOnHold({
        subTxnType: 'NEW_GEP',
        status: 'yu'
      });

      expect(action.type).toEqual(GepActionsTypes.LOAD_ON_HOLD);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new LoadOnHoldSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_ON_HOLD_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOnHoldFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.LOAD_ON_HOLD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('getGEPItem Test Cases', () => {
    it('should check correct type is used for  lGetGEpItem action ', () => {
      const action = new GetGepITEM({
        subTxnType: 'NEW_GEP',
        id: '56789-ERTYU'
      });

      expect(action.type).toEqual(GepActionsTypes.GET_GEP_ITEM);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new GetGepITEMSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.GET_GEP_ITEM_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetGepITEMFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.GET_GEP_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('updateItem Test Cases', () => {
    it('should check correct type is used for  Updatetem action ', () => {
      const action = new UpdateITEM({
        subTxnType: 'NEW_GEP',
        id: 'wertyuio-45678',
        itemId: '345678',
        data: null
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_GEP_ITEM);
    });
    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new UpdateITEMSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_GEP_ITEM_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const errorpayLoad = CustomErrorAdaptor.fromJson(Error('Some Error'));
      const payload = {
        error: errorpayLoad,
        data: null
      };
      const action = new UpdateITEMFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_GEP_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('loadItem Test Cases', () => {
    it('should check correct type is used for  load item action ', () => {
      const action = new LoadITEM('LOAD');

      expect(action.type).toEqual(GepActionsTypes.LOAD_ITEM);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new LoadITEMSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_ITEM_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadITEMFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.LOAD_ITEM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('HoldConfirm Test Cases', () => {
    it('should check correct type is used for  Updatetem action ', () => {
      const action = new HoldConfirm({
        data: null,
        id: '3456789-SDFGHJK',
        status: 'ASDFGHJ',
        subTxnType: 'SDFGHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.GEP_HOLD_CONFIRM);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new HoldConfirmSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.GEP_HOLD_CONFIRM_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new HoldConfirmFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.GEP_HOLD_CONFIRM_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Delete Test Cases', () => {
    it('should check correct type is used for  delete action ', () => {
      const action = new Delete({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.DELETE);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new DeleteSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.DELETE_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new DeleteFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.DELETE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Delete Test Cases', () => {
    it('should check correct type is used for  delete action ', () => {
      const action = new Delete({
        id: '3456789-SDFGHJK',
        itemId: '345678-SDTYUI-45678',
        subTxnType: 'SDFGHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.DELETE);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new DeleteSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.DELETE_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new DeleteFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.DELETE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GepInit Test Cases', () => {
    it('should check correct type is used for  GepInit action ', () => {
      const action = new GepInit({ data: null, subTxnType: 'NEW_GEP' });

      expect(action.type).toEqual(GepActionsTypes.GEP_INIT);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new GepInitSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.GEP_INIT_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new GepInitFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.GEP_INIT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('PostGepItems Test Cases', () => {
    it('should check correct type is used for  PostGepItems action ', () => {
      const action = new PostGepItems({
        id: '3456789-SDFGHJK',
        data: null,
        subTxnType: 'SDFGHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.POST_GEP_ITEMS);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new PostGepItemsSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.POST_GEP_ITEMS_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new PostGepItemsFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.POST_GEP_ITEMS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('PatchRSO Test Cases', () => {
    it('should check correct type is used for  PatchRSO action ', () => {
      const action = new PostRSO({
        id: '3456789-SDFGHJK',
        data: null,
        subTxnType: 'SDFGHJ'
      });

      expect(action.type).toEqual(GepActionsTypes.UPDATE_RSO);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new PostRSOSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_RSO_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new PostRSOFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.UPDATE_RSO_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GepMetalRate Test Cases', () => {
    it('should check correct type is used for  delete action ', () => {
      const action = new GepMetalRate();

      expect(action.type).toEqual(GepActionsTypes.GEP_METAL_PRICE);
    });
    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new GepMetalRateSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.GEP_METAL_PRICE_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new GepMetalRateFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.GEP_METAL_PRICE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('TotalValueBreakUp Test Cases', () => {
    it('should check correct type is used for  delete action ', () => {
      const action = new TotalValueBreakUp({
        standardPrice: null,
        metalType: 'J',
        itemType: 'JEWELLERY',
        measuredPurity: 90,
        measuredWeight: 78
      });

      expect(action.type).toEqual(GepActionsTypes.GEP_TOTAL_VALUE);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new TotalValueBreakUpSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.GEP_TOTAL_VALUE_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new TotalValueBreakupFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.GEP_TOTAL_VALUE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadMetal Test Cases', () => {
    it('should check correct type is used for  delete action ', () => {
      const action = new LoadMetal('METAL');

      expect(action.type).toEqual(GepActionsTypes.LOAD_METAL);
    });

    it('should check correct type is used for  SUCCESS action ', () => {
      const action = new LoadMetalSuccess(null);

      expect(action.type).toEqual(GepActionsTypes.LOAD_METAL_SUCCESS);
    });

    it('should check correct type is used for  Failure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadMetalFailure(payload);

      expect(action.type).toEqual(GepActionsTypes.LOAD_METAL_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Reset Action Test Cases', () => {
    it('should check correct type is used for  ClearSearchList action ', () => {
      const action = new ClearSearchList();

      expect(action.type).toEqual(
        GepActionsTypes.CLEAR_SEARCH_LIST
      );
    });
  });

  describe('LoadGEPHistory Response Action Test Cases', () => {
    it('should check correct type is used for  LoadGEPHistory  action ', () => {
      const action = new LoadGEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'GEP','New_GEP');

      expect(action.type).toEqual(GepActionsTypes.LOAD_GEP_HISTORY);

      expect(action.payload).toEqual(advanceHistoryItemsRequestPayload);
    });

    it('should check correct type is used for LoadFEPHistorySuccess action ', () => {
      const action = new LoadGEPHistorySuccess(gepSearchResponse);

      expect(action.type).toEqual(
        GepActionsTypes.LOAD_GEP_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(gepSearchResponse);
    });

    it('should check correct type is used for LoadGEPHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGEPHistoryFailure(payload);

      expect(action.type).toEqual(
        GepActionsTypes.LOAD_GEP_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SetHistoryGEPSearchParamDetails Action Test Cases', () => {
    it('should check correct type is used for  SetHistoryTEPSearchParamDetails action ', () => {
      const action = new SetHistoryGEPSearchParamDetails(historySearchParamDetails);

        expect(action.type).toEqual(
          GepActionsTypes.SET_HISTORY_SEARCH_PARAM_DETAILS
        );
        expect(action.payload).toEqual(historySearchParamDetails);
    });
  });

  describe('ViewGep Response Action Test Cases', () => {
    it('should check correct type is used for  ViewGep  action ', () => {
      const payload = "C5611428-A559-488B-957B-94732086A54B";
      const action = new ViewGEP(payload, "NEW_GEP");

      expect(action.type).toEqual(GepActionsTypes.VIEW_GEP);

      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for ViewGEPSuccess action ', () => {
      const action = new ViewGEPSuccess(gepSearchResponse);

      expect(action.type).toEqual(
        GepActionsTypes.VIEW_GEP_SUCCESS
      );
      expect(action.payload).toEqual(gepSearchResponse);
    });

    it('should check correct type is used for ViewGEPFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewGEPFailure(payload);

      expect(action.type).toEqual(
        GepActionsTypes.VIEW_GEP_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
